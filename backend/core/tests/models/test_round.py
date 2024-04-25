from django.db import IntegrityError
from django.test import TestCase
from faker import Faker
from core.factories import RoundFactory

faker = Faker()


class RoundTests(TestCase):
    def setUp(self):
        self.match_id = faker.name()
        self.number = faker.pyint(min_value=0)

    def test_match_id_cant_be_same_as_number_more_than_once(self):
        round = RoundFactory(match_id=self.match_id, number=self.number)
        round.full_clean()
        with self.assertRaises(IntegrityError):
            round2 = RoundFactory(match_id=self.match_id, number=self.number)
            round2.full_clean()
