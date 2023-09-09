class Player:
    def __init__(self, name, rounds):
        self.name = name
        self.rounds = rounds
        self.kills = 0
        self.deaths = 0
        self.headshots = 0
        self.entry_kills = 0
        self.entry_deaths = 0
        self.clutches = 0
        self.multikills = 0
        self.plants = 0
        self.disables = 0
        self.kost = None

        self.rating = None
        self.kd = None
        self.kd_diff = None
        self.entry_diff = None
        self.kpr = None
        self.srv = None

    def calculate(self):
        self._do_kd()
        self._do_kpr()
        self._do_entry_diff()
        self._do_srv()
        self._do_rating()
        self._format()

    def _format(self):
        self.rating = "{:.2f}".format(self.rating)
        self.kd = "{:.2f}".format(self.kd)
        self.kost = "{:.2f}".format(self.kost)
        self.srv = "{:.2f}".format(self.srv)
        self.kpr = "{:.2f}".format(self.kpr)

    def _do_rating(self):
        self.rating = (
            0.031 * self.entry_kills -
            0.042 * self.entry_deaths +
            0.666 * self.kpr +
            0.261 * self.srv +
            0.225 * float(self.kost) +
            0.066 * self.clutches +
            0.076 * self.plants +
            0.033 * self.disables
        )

    def _do_kd(self):
        self.kd_diff = self.kills - self.deaths
        self.kd = self.kills / self.deaths

    def _do_kpr(self):
        self.kpr = self.kills / self.rounds

    def _do_srv(self):
        self.srv = (self.rounds - self.deaths) / self.rounds

    def _do_entry_diff(self):
        self.entry_diff = self.entry_kills - self.entry_deaths
