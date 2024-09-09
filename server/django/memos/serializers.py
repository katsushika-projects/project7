from rest_framework import serializers

from .models import Memo

class MemoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Memo
        fields = "__all__"
        read_only_fields =["id", "qr_img", "passkey", "created_at"]
