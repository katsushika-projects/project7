import os
import uuid
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver


class Memo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    memo = models.TextField()
    passkey = models.CharField
    qr_img = models.ImageField()
    created_at = models.DateTimeField(auto_now_add=True)


@receiver(post_delete, sender=Memo)
def delete_image_files(sender, instance, **kwargs):
    if instance.qr_img:
        if os.path.isfile(instance.qr_img.path):
            os.remove(instance.qr_img.path)
