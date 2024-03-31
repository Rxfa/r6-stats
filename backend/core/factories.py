import factory
from django.contrib.auth.models import User
from faker import Faker

from .models import Round, RoundReplay, Team, Player, Replay

faker = Faker()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = faker.simple_profile()["username"]
    email = faker.email()
    password = factory.PostGenerationMethodCall('set_password', '')


class ReplayFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Replay

    uploaded_by = factory.SubFactory(UserFactory)
    timestamp = faker.date_time_this_year()


class RoundReplayFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RoundReplay

    replay = factory.SubFactory(ReplayFactory)
    timestamp = faker.date_time_this_year()
    file = faker.file_name(extension=".rec")


class RoundFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Round

    replay = factory.SubFactory(RoundReplayFactory)
    dateTime = faker.date_time_this_year(before_now=True)
    match_id = faker.name()  # match_id is a str so we can use name()
    number = faker.pyint(min_value=0)
    map = faker.name()
    own_score = faker.pyint(min_value=0)
    opp_score = faker.pyint(min_value=0)
    timestamp = faker.date_time_this_year(before_now=True)
    site = faker.name()
    own_atk_ban = faker.name()
    own_def_ban = faker.name()
    opp_atk_ban = faker.name()
    opp_def_ban = faker.name()


class TeamFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Team

    round = factory.SubFactory(RoundFactory)
    is_own = faker.pybool()
    score = faker.pyint(min_value=0)
    won = faker.pybool()
    win_condition = faker.name()  # TODO: Change so its null if won is false
    side = faker.name()


class PlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Player

    team = factory.SubFactory(TeamFactory)
    name = faker.name()
    uid = faker.name()
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
