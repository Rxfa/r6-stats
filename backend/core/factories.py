import factory
from django.contrib.auth.models import User
from faker import Faker

from backend.core.models import Round, RoundReplay, Game, Team, Player

faker = Faker()


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    name = faker.name()
    email = faker.email()


class RoundReplayFactory(factory.DjangoModelFactory):
    class Meta:
        model = RoundReplay

    timestamp = faker.date_time_this_year(before_now=True)
    uploaded_by = factory.SubFactory(UserFactory)
    file = faker.file_name(extension=".rec")


class GameFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Game

    match_id = faker.uuid()


class RoundFactory(factory.DjangoModelFactory):
    class Meta:
        model = Round

    replay = factory.SubFactory(RoundReplayFactory)
    dateTime = faker.date_time_this_year(before_now=True)
    match_id = factory.SubFactory(GameFactory)
    number = faker.pyint(min_value=0)
    own_score = faker.pyint(min_value=0)
    opp_score = faker.pyint(min_value=0)
    timestamp = faker.date_time_this_year(before_now=True)
    site = faker.name()


class TeamFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Team

    round = factory.SubFactory(RoundFactory)
    is_own = faker.pybool()
    score = faker.pyint(min_value=0)
    won = faker.pybool()
    win_condition = faker.name()  # TODO: Change so its null if won is false
    side = faker.name(choices=["DEF", "ATK"])


class PlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Player

    team = factory.SubFactory(TeamFactory)
    name = faker.name()
    uid = faker.uuid()
    spawn = faker.name()
    operator = faker.name()
    kills = faker.pyint(min_value=0)
    assists = faker.pyint(min_value=0)
    headshots = faker.pyint(min_value=0)
    died = faker.pybool()
    opening_kill = faker.pybool()
    opening_death = faker.pybool()
    entry_kill = faker.pybool()
    entry_death = faker.pybool()
    refragged = faker.pybool()
    traded = faker.pybool()
    planted = faker.pybool()
    time_of_plant = faker.pyint(min_value=0, max_value=180)
    disabled = faker.pybool()
    time_of_disable = faker.pyint(min_value=0, max_value=180)
