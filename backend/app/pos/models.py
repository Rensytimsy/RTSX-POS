# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser
# from . import manager


# # Create your models here.

# class StoreAccount(AbstractBaseUser):
    
#     storename = models.CharField(default="", max_length=30)
#     email = models.EmailField(null=False, blank=False)
#     subscribed = models.BooleanField(default=False)
#     store_count = models.IntegerField(default=1, null=False, blank=False)
#     logo = models.CharField(default="https://static.vecteezy.com/system/resources/thumbnails/020/662/327/small_2x/store-icon-logo-illustration-vector.jpg", max_length=500, blank=True, null=True)
#     created_at = models.TimeField(blank=True, null=True)
#     deleted_at = models.TimeField(blank=True, null=True)
#     updated_at = models.TimeField(blank=True, null=True)
#     country = models.CharField(default="Nairobi", null=False, blank=False)
#     account_code = models.CharField(default="", null=True, blank=True)
#     account_id = models.CharField(default="", null=True, blank=True)
    
#     objects = manager.PsStoreAccount()
    
#     USERNAME_FIELD = {email}
#     REQUIRED_FIELDS = [
#         "storename","country"
#     ]
    
#     def __str__(self):
#         return "{} {}".format(self.storename, self.email)