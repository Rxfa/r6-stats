"""Main file"""
import argparse
import json
import os
import sys
from statsScript.game import Match
from statsScript.utils import timer


@timer
def main(filename, output_path="."):
    with open(filename, encoding="utf-8") as f:
        data = json.load(f)
        game = Match(data)

    with open(f"{output_path}/file.json", "w", encoding="utf-8") as f:
        file = json.dumps(game, default=lambda x: x.__dict__)
        f.write(file)

    return file


if __name__ == "__main__":
    parser = argparse.ArgumentParser(prog="R6 Stats", description="R6 Stats")
    parser.add_argument("gameFile", type=str, help="Game data file")
    args = parser.parse_args()
    filename = args.gameFile

    if not os.path.isfile(filename):
        sys.exit("File does not exist.")
    main(filename)
