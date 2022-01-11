#!/usr/bin/env bash

if [[ ! -n `atq` ]]; then
  # Nothing to do
  exit 0
fi

JOBS=$(atq | cut -f 1)
echo Cleaning at job IDs: $JOBS
atrm $JOBS
