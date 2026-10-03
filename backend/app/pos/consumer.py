import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .tasks import log_barcode_scan_async

# from backend.docs import barcodes

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
        print("Connection was successful")
        # print(barcodes)
        
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
            
            print("Disconnected Succesfully")
            
            
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        barcode = data["barcode"]
        print("received", data)
        
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "broadcast.scan.event", "barcode": barcode}
        )
        
        

    async def broadcast_scan_event(self, event):
        barcode = event["barcode"]
        await self.send(text_data=json.dumps({
            "barcode": barcode
        }))