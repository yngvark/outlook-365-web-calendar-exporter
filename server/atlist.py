#!/usr/bin/env python
import argparse
from typing import Optional
import os
import sys
from pathlib import Path
import subprocess
from subprocess import Popen, PIPE

#!/usr/bin/env bash
#while read -r id
#do
#    cmd=$(at -c $id | tail -2)
#    echo $id: $cmd
#done < <(atq | cut -f1)

def print_err(txt):
    print(txt, file=sys.stderr)

def run_cmd(cmd):
    p = Popen(cmd, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()
    if p.returncode != 0:
        print_err("stdout, response (exit code %d): %s %s" % (p.returncode, stdout, stderr))
        sys.exit(1)

    return stdout.decode("utf-8")

class Job:
    def __init__(self, id, info, cmd):
        self.id = id
        self.info = info
        self.cmd = cmd

    def string(self):
        return self.id + " - " + self.info + " - " + self.cmd

def main():
    out = run_cmd(["atq"])
    txt = str(out)

    jobs = dict()

    for line in out.split("\n"):
        # print(line)
        split = line.split("\t")
        if len(split) != 2:
            continue

        id = str(split[0])
        info = split[1].replace(" 2022 a yngvar", "")

        details = run_cmd(["at", "-c", id])

        split = details.split("\n")
        cmd = split[len(split) - 3]

        jobs[id] = Job(id, info, cmd)
        #print(id + " - " + info + " - " + cmd)

    keys = sorted(list(jobs))
    for id in keys:
        print(jobs[id].string())


main()
