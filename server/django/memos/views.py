
from datetime import timedelta
from django.utils import timezone
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Memo
from .serializers import MemoSerializer



class MemosAPIView(APIView):
    def post(self, request):
        # リクエストボディのpasskeyから対象のMemoを取得
        passkey = request.data.get("passkey")
        if not passkey:
            return Response({"detail": "passkeyをリクエストボディに含めてください．"}, status=status.HTTP_400_BAD_REQUEST)
        
        # オブジェクトが見つからない場合、404エラーを返す
        memo = get_object_or_404(Memo, passkey=passkey)
        
        # シリアライズしてレスポンスを返す
        return Response(MemoSerializer(memo).data, status=status.HTTP_200_OK)
    
class DeleteExpiredMemosAPIView(APIView):
    def delete(self, request):
        # 現在の時刻から15分前を計算
        time_threshold = timezone.now() - timedelta(minutes=15)

        # 15分以上前に作成されたメモの一覧を取得して削除
        memos = Memo.objects.filter(created_at__lt=time_threshold)
        deleted_count, _ = memos.delete()

        return Response({"detail": f"{deleted_count}個のmemoを削除しました．"}, status=status.HTTP_200_OK)


class MemoRetrieveDestroyAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        memo = get_object_or_404(Memo, pk=pk)
        serializer = MemoSerializer(memo)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk, *args, **kwargs):
        memo = get_object_or_404(Memo, pk=pk)
        memo.delete()
        return Response({"detail": "メモを削除しました．"}, status=status.HTTP_204_NO_CONTENT)


class MemoCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = MemoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
