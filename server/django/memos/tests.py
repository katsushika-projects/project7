import uuid

from rest_framework.test import APITestCase

from django.conf import settings
from django.urls import reverse
from django.utils import timezone

from .models import Memo


class MemoAPITestCase(APITestCase):
    def setUp(self):
        self.memo_url = reverse("memos:detail_with_passkey")

    def create_memo(self, memo_text="Test Memo"):
        memo = Memo.objects.create(memo=memo_text)
        memo.save()
        return memo

    def test_successful_post_request(self):
        # メモの作成
        memo_data = {"memo": "テスト用メモ"}
        memo = self.create_memo(memo_data["memo"])
        passkey = memo.passkey

        # タイムゾーン付きのローカル時間に変換してから ISO 形式に
        created_at = timezone.localtime(memo.created_at).isoformat()

        # 作成したメモの取得
        response = self.client.post(self.memo_url, data={"passkey": passkey})

        # レスポンスの確認
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], str(memo.id))
        self.assertEqual(response.data["memo"], memo_data["memo"])
        self.assertEqual(response.data["passkey"], passkey)
        self.assertEqual(response.data["created_at"], created_at)

    def test_failed_post_with_invalid_passkey(self):
        # 無効なパスキーでのリクエスト
        invalid_passkey = "invalid_passkey"
        response = self.client.post(self.memo_url, data={"passkey": invalid_passkey})

        # 失敗時のレスポンスの確認
        self.assertEqual(response.status_code, 404)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "No Memo matches the given query.")

    def test_failed_post_with_missing_passkey(self):
        # パスキーがない場合のリクエスト
        response = self.client.post(self.memo_url, data={})

        # 失敗時のレスポンスの確認
        self.assertEqual(response.status_code, 400)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "passkeyをリクエストボディに含めてください．")


class DeleteExpiredMemosAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse("memos:delete_expired_memos")

    def create_memo(self, memo_text="Test Memo", created_at=timezone.now()):
        memo = Memo.objects.create(memo=memo_text)
        memo.save()
        memo.created_at = created_at
        memo.save()
        return memo

    def test_success_delete(self):
        # テストデータ作成
        self.create_memo()
        self.create_memo(created_at=timezone.now() - timezone.timedelta(minutes=settings.MEMO_LIFETIME_MINUTES + 1))

        # メモの数を取得
        memo_count = Memo.objects.count()
        expired_memo_count = Memo.objects.filter(
            created_at__lt=timezone.now() - timezone.timedelta(minutes=settings.MEMO_LIFETIME_MINUTES)
        ).count()

        res = self.client.delete(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Memo.objects.count(), memo_count - expired_memo_count)
        self.assertEqual(res.data["detail"], f"{expired_memo_count}個のmemoを削除しました．")


class MemoRetrieveDestroyAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.memo = Memo.objects.create(
            memo="だからしかしながら実人にしのはちょっと低級と得るなけれので、その陰をは立ちなけれどもという教場にもつばみなた。"
        )

    def setUp(self):
        self.url = reverse("memos:retrieve_destroy", kwargs={"pk": self.memo.pk})

    def test_success_get(self):
        res = self.client.get(self.url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["id"], str(Memo.objects.get(pk=self.memo.pk).id))

    def test_failure_get_with_not_exist_memo(self):
        res = self.client.get(reverse("memos:retrieve_destroy", kwargs={"pk": uuid.uuid4()}))
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.data["detail"], "No Memo matches the given query.")

    def test_success_delete(self):
        res = self.client.delete(self.url)
        self.assertEqual(res.status_code, 204)
        self.assertFalse(Memo.objects.filter(pk=self.memo.pk).exists())
        self.assertEqual(res.data["detail"], "メモを削除しました．")

    def test_failure_delete_with_not_exist_memo(self):
        res = self.client.delete(reverse("memos:retrieve_destroy", kwargs={"pk": uuid.uuid4()}))
        self.assertEqual(res.status_code, 404)
        self.assertEqual(res.data["detail"], "No Memo matches the given query.")


class MemoCreateAPITestCase(APITestCase):
    def setUp(self):
        self.url = reverse("memos:create")

    def test_success_post(self):
        valid_data = {
            "memo": "だからしかしながら実人にしのはちょっと低級と得るなけれので、その陰をは立ちなけれどもという教場にもつばみなた。"
        }
        res = self.client.post(self.url, valid_data, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Memo.objects.filter(**valid_data).exists())

    def test_failure_post_with_empty_memo(self):
        invalid_data = {"memo": ""}
        res = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertFalse(Memo.objects.filter(**invalid_data).exists())
        self.assertEqual(res.data["memo"][0], "この項目は空にできません。")
