#!/usr/bin/env python
import os
import pathlib
import subprocess
import sys
from enum import Enum


class SoundOutput(Enum):
    SPEAKER = "speaker"
    HEADSET = "headset"


def print_err(txt):
    print(txt, file=sys.stderr)


def get_current_sound_output():
    proc = subprocess.run(["swaudio"], check=True, capture_output=True, text=True)

    read_now = False
    for line in proc.stdout.splitlines():
        print("stdout:", line)

        if read_now:
            if "pci-0000_0a_00.4" in line.lower():
                return SoundOutput.SPEAKER
            else:
                return SoundOutput.HEADSET

        if line.strip().startswith("*"):
            read_now = True

    raise RuntimeError("Could not find '*' in output from command swaudio")


gitDir = os.environ.get("YK_GIT_DIR")
if gitDir is None:
    print_err("YK_GIT_DIR env missing")
    sys.exit(1)


sound_out = get_current_sound_output()
path = ""

print(f"Detected output: {sound_out}")

if sound_out == SoundOutput.SPEAKER:
    path = pathlib.Path(gitDir).joinpath("yngvark/outlook-365-web-calendar-exporter/server/alarm-6.wav")
else:
    path = pathlib.Path(gitDir).joinpath("yngvark/outlook-365-web-calendar-exporter/server/alarm-2.wav")

subprocess.run(["aplay", path])
