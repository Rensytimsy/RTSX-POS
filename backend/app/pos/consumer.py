import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .tasks import log_barcode_scan_async

# Helper to offload synchronous Celery calls
@database_sync_to_async
def trigger_celery_task(shop_slug, session_id, barcode):
    log_barcode_scan_async.delay(shop_slug, session_id, barcode)


class PosScannerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f"pos_store_session_{self.session_id}"
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            return
        
        message_type = data.get("type")
        barcode = data.get("barcode")
        shop_slug = data.get("shop_slug", "default")
        
        if message_type == "SCAN_EVENT" and barcode:
            # 1. Broadcast to WebSocket group asynchronously
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "broadcast_scan_event",
                    "barcode": barcode
                }
            )
            
            # 2. Dispatch Celery task safely without blocking event loop
            await trigger_celery_task(shop_slug, self.session_id, barcode)

    async def broadcast_scan_event(self, event):
        await self.send(text_data=json.dumps({
            "status": "success",
            "barcode": event['barcode']
        }))