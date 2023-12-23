import uuid

from django.db import transaction
from ..selectors import replay_destroy_queryset
from django.contrib.auth.models import User
from ..models import Replay, Round


class GameService:
    def __init__(self, user, match_id):
        self.user = user
        self.match_id = match_id

    @transaction.atomic
    def destroy(self):
        try:
            with transaction.atomic():
                game = Round.objects.filter(match_id=self.match_id)
                Replay.objects.filter(round_replays__round__in=game).delete()
        except Exception as e:
            raise e


class ReplayService:
    def __init__(self, user: User):
        self.user = user

    @transaction.atomic
    def destroy(self, uuid: uuid.UUID):
        try:
            with transaction.atomic():
                Replay.objects.filter(pk=uuid, uploaded_by=self.user).delete()
        except Exception as e:
            raise e
