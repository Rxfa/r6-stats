"""Main file"""
import argparse
import json
import os
import sys
from game import Matchclass
from utils import timer

@timer
def main(filename):
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
        game = Matchclass(data)
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog="R6 Stats", description="R6 Stats")
    parser.add_argument("gameFile", type=str, help="Game data file")
    args = parser.parse_args()
    filename = args.gameFile

    if not os.path.isfile(filename):
        sys.exit("File does not exist.")
    main(filename)
