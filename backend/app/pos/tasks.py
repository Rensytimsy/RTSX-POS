from celery import shared_task
import logging

logger = logging.getLogger("pos_scanner")

# handled by the messaging broker channels_rabbitmq
@shared_task
def log_barcode_scan_async(shop_slug, session_id, barcode):
    logger.info(f"[AUDIT] Store: {shop_slug} | Session: {session_id} | Scanned Barcode: {barcode}")
    return true