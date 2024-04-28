import uuid

from django.db import transaction
from django.contrib.auth.models import User

from core.models import Vod


class VodService:
    def __init__(self, user: User):
        self.user = user

    def create(self, data: dict):
        Vod.objects.create(user=self.user, **data)

    def update(self, id: int, data: dict):
        try:
            with transaction.atomic():
                Vod.objects.filter(id=id, user=self.user).update(**data)
        except Exception as e:
            raise e

    @transaction.atomic
    def destroy(self, id: int):
        try:
            with transaction.atomic():
                Vod.objects.filter(id=id, user=self.user).delete()
        except Exception as e:
            raise e
