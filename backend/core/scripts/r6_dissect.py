import subprocess
from statsScript import main as script


def r6_dissect(file):
    cmd = subprocess.run(
        ["core/scripts/r6-dissect/r6-dissect", file, "-x", "stdout"],
        capture_output=True,
        text=True
    )
    return script.main(cmd.stdout)

