#!/usr/bin/env bash
: "${YK_GIT_DIR:?Needs to be non-empty.}"
: "${IFTTT_KEY:?Needs to be non-empty.}"

ME=$(basename ${BASH_SOURCE[0]})

if [[ $* == "-h" || $* == "--help" || "$#" -eq 0 ]]
then
    echo "USAGE:"
    echo "$ME <HOUR:MINUTE> <same URL formatted> <MSG>"
    echo "$ME 22:00 22%3A00 hello"
    return 0 2> /dev/null || exit 0
fi

AT_TIME=$1
AT_TIME_URL_ENCODED=$2
MSG=$3

echo Creating alert at $AT_TIME with msg $MSG
echo
echo "notify-send -i face-glasses \"🧧🧧🧧$MSG XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\"" | at "$AT_TIME"
echo "aplay $YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/alarm.wav" | at "$AT_TIME"
echo "curl --silent -X POST \"https://maker.ifttt.com/trigger/reminder/with/key/$IFTTT_KEY?value1=$AT_TIME_URL_ENCODED&value2=$MSG\"" | at "$AT_TIME"
