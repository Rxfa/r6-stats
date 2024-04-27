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
    win_condition = faker.name() if won else None
    side = faker.name()


class PlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Player

    team = factory.SubFactory(TeamFactory)
    name = faker.name()
    uid = faker.name()
    spawn = faker.name()
    operator = faker.name()
    opening_kill = faker.pybool()
    entry_kill = True if opening_kill else faker.pybool()
    kills = faker.pyint(min_value=1, max_value=5) if entry_kill else faker.pyint(min_value=0, max_value=5)
    assists = faker.pyint(min_value=0, max_value=(5-kills))
    headshots = faker.pyint(min_value=0, max_value=kills)
    opening_death = faker.pybool()
    entry_death = True if opening_death else faker.pybool()
    died = True if entry_death else faker.pybool()
    refragged = faker.pybool() if kills > 0 else False
    traded = faker.pybool() if died else False
    planted = faker.pybool()
    time_of_plant = faker.pyint(min_value=0, max_value=180) if planted else None
    disabled = False if planted else faker.pybool()
    time_of_disable = faker.pyint(min_value=0, max_value=180) if disabled else None
    kost = True if (kills > 0 or planted or disabled or traded) else False
    multikill = True if kills > 1 else False
