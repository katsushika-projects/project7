from django.urls import path

from .views import DeleteExpiredMemosAPIView, MemoCreateAPIView, MemoRetrieveDestroyAPIView, MemosAPIView

app_name = "memos"

urlpatterns = [
    path("", MemosAPIView.as_view(), name="detail_with_passkey"),
    path("<uuid:pk>/", MemoRetrieveDestroyAPIView.as_view(), name="retrieve_destroy"),
    path("create/", MemoCreateAPIView.as_view(), name="create"),
    path("delete_expired_memos/", DeleteExpiredMemosAPIView.as_view(), name="delete_expired_memos"),
]
