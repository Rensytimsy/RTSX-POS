# from django.config.auth.models import BaseUserManager

# class PsStoreAccount(BaseUserManager):
    
#     def create_user(
#         self,
#         storename,
#         email,
#         logo,
#         store_count,
#         created_at,
#         updated_at,
#         deleted_at,
#         subscribed,
#         country,
#         account_code=None,
#         account_id=None,
#         password=None
#     ):
        
#         required_fields = {
#             "storename": storename,
#             "country": country,
#             "email": email
#         }
        
#         missing_fields = [field for field, value in required_fileds.items() if not value]
        
#         newStore = self.model(
#             storename=storename,
#             store_count=store_count,
#             subscribed=subscribed,
#             country=country,
#         )
        
#         newStore.set_password(password)
#         newStore.save(using=self._db)
#         newStore.is_verified = True
#         return newStore
    
    
#     def create_superuser(
#         self,
#         storename,
#         email,
#         logo,
#         store_count,
#         created_at,
#         updated_at,
#         deleted_at,
#         subscribed,
#         country,
#         account_code=None,
#         account_id=None,
#         password=None
#     ):
        
#         storeAdmin = self.create_user(
#             storename,
#             logo,
#             store_count,
#             created_at,
#             updated_at,
#             deleted_at,
#             subscribed,
#             country,
#             account_code=None,
#             account_id=None,
#             password=None
#         )
        
#         storeAdmin.is_staff = True
#         storeAdmin.is_admin = True
#         storeAdmin.is_verified = True
#         storeAdmin.save(using=self._db)
#         return storeAdmin
        