import random
import string
import uuid

from django.db import models


class Memo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    memo = models.TextField()
    passkey = models.CharField(unique=True, max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self) -> None:
        super().clean()
        # passkeyが6文字であることを確認
        if len(self.passkey) != 6:
            raise ValueError("Passkey must be 6 characters long")

    def save(self, *args, **kwargs):
        generate_passkey(self)
        super().save(*args, **kwargs)


def generate_passkey(instance):
    # ランダムに6文字生成
    while True:
        passkey = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
        # 重複していなければ採用
        if not Memo.objects.filter(passkey=passkey).exists():
            instance.passkey = passkey
            break
