#!/usr/bin/env bash

# USAGE:
# Run alarm in 5 seconds
# sudo systemd-run --property=WorkingDirectory=`pwd` --property=TimeoutSec=1sec --on-calendar="$(date --date="+5 seconds" '+%Y-%m-%d %T')" --setenv YK_GIT_DIR=$YK_GIT_DIR --setenv IFTTT_KEY=$IFTTT_KEY --setenv PATH_SWAUDIO=$YK_PATH_DIR `pwd`/alert.sh "22:13" "Husk møte"

# Run alarm at given time
# sudo systemd-run --property=WorkingDirectory=`pwd` --property=TimeoutSec=1sec --on-calendar="2022-04-02 13:16:00" --setenv YK_GIT_DIR=$YK_GIT_DIR --setenv IFTTT_KEY=$IFTTT_KEY --setenv PATH_SWAUDIO=$YK_PATH_DIR `pwd`/alert.sh "22:13" "Husk møte"

# systemctl list-timers

# https://0day.work/locking-the-screen-when-removing-a-yubikey/
#
: "${YK_GIT_DIR:?Needs to be non-empty.}"
: "${IFTTT_KEY:?Needs to be non-empty.}"

ME=$(basename ${BASH_SOURCE[0]})

if [[ $* == "-h" || $* == "--help" || "$#" -eq 0 ]]
then
    echo "USAGE:"
    echo "$ME <TIME> <MSG>"
    echo "$ME 22:00 \"hello there\""
    return 0 2> /dev/null || exit 0
fi

# Thanks to https://stackoverflow.com/questions/296536/how-to-urlencode-data-for-curl-command
rawurlencode() {
  local REPLY=$(printf %s "$1"|jq -sRr @uri)
  echo $REPLY
}

ALERT_TIME=$1
MSG=$2

ALERT_TIME_URL_ENCODED=$(rawurlencode "$1")
MSG_URL_ENCODED=$(rawurlencode "$2")

# Based on https://raw.githubusercontent.com/aminb/usb-lock/master/onusbunplug.sh

getXuser() {
        user=`pinky| grep -m1 ":$displaynum" | awk '{print $1}'`
 
        if [ x"$user" != x"" ]; then
                userhome=`getent passwd $user | cut -d: -f6`
                export XAUTHORITY="$userhome/.Xauthority"
        else
                export XAUTHORITY=""
        fi
}

for x in /tmp/.X11-unix/*; do
    displaynum=`echo $x | sed s#/tmp/.X11-unix/X##`
    getXuser
    if [ x"$XAUTHORITY" != x"" ]; then
        # extract current state
    export DISPLAY=":$displaynum"
    fi
done

echo msg: $MSG_URL_ENCODED

echo Alerting $AT_TIME with msg $MSG
echo

# echo curl --silent -X POST "https://maker.ifttt.com/trigger/reminder/with/key/$IFTTT_KEY?value1=$ALERT_TIME_URL_ENCODED&value2='$MSG_URL_ENCODED'"
curl -X POST "https://maker.ifttt.com/trigger/reminder/with/key/$IFTTT_KEY?value1=$ALERT_TIME_URL_ENCODED&value2=$MSG_URL_ENCODED"
su "$user" -c "notify-send -i face-glasses \"🧧🧧🧧$ALERT_TIME $MSG XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\""
su "$user" -c "$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/soundalert.py"
