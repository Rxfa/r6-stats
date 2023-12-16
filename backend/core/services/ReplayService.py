import uuid

from django.db import transaction, IntegrityError
from django.db.models import QuerySet
from ..selectors import replay_destroy_queryset
from django.contrib.auth.models import User


class ReplayService:
    def __init__(self, user: User):
        self.user = user

    @transaction.atomic
    def destroy(self, uuid: uuid.UUID):
        try:
            with transaction.atomic():
                replay_destroy_queryset(self.user, uuid).delete()
        except Exception as e:
            raise e
