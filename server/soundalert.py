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
    PATH_SWAUDIO = os.environ.get("PATH_SWAUDIO")
    if PATH_SWAUDIO is None:
        print_err("PATH_SWAUDIO env missing")
        sys.exit(1)

    output = ""
    swaudio = os.path.join(PATH_SWAUDIO, "swaudio")
    try:
        output = subprocess.check_output(swaudio, text=True)
    except subprocess.CalledProcessError as e:
        print("swaudio failed with:")
        print(e.output)
        sys.exit(1)

    read_now = False
    for line in output.splitlines():
        # print("stdout:", line)

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
    path = pathlib.Path(gitDir).joinpath("yngvark/outlook-365-web-calendar-exporter/server/alarm-speaker.wav")
else:
    path = pathlib.Path(gitDir).joinpath("yngvark/outlook-365-web-calendar-exporter/server/alarm-headset.wav")

subprocess.run(["aplay", path])
