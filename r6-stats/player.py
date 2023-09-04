class Player:
    def __init__(self, name, rounds) -> None:
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
            self.do_kd()
            self.do_kpr()
            self.do_entries()
            self.do_srv()
            self.do_rating()
            
        def do_rating(self):
            self.rating = (
                0.031 * self.entry_kills -
                0.042 * self.entry_deaths +
                0.666 * self.kpr +
                0.261 * self.srv +
                0.225 * self.kost +
                0.066 * self.clutches +
                0.076 * self.plants +
                0.033 * self.disables
            )
            
        def do_kd(self):
            self.kd_diff = self.kills - self.deaths
            self.kd = self.kills / self.deaths
            
        def do_kpr(self):
            self.kpr = self.kills / self.rounds
            
        def do_srv(self):
            self.srv = (self.rounds - self.deaths) / self.rounds
            
        def do_entries(self):
            self.entry_diff = self.entry_kills - self.entry_deaths