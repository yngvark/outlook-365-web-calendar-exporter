import { WebSocketServer } from 'ws'
import { execSync } from 'child_process'
import { Alarm } from './alarm.js'
import { ValidationError } from './validation_error.js'
// import * as fs from 'fs'

const testing = false
// const SERVER_PORT = 37124
const SERVER_PORT = 37123

// To clean jobs: JOBS=$(atq | cut -f 1) && atrm $JOBS
if (testing) {
    let text1 = `
        [
            {
                "label": "event from Tuesday, April 02, 2022 05:06 to 10:00 Planning   location https://whereby.com/somwehere organizer Guybrush Threepwood",
                "title": "Planning\\nhttps://whreby.com/somewhere\\nfrom 09:00 to 10:00"
            }
        ]
    `

    let text2 = `
    `
    handleCalendarEvents(text1)
} else {
    main()
}


function log(msg) {
    console.log(msg)

    /*
    // write t ofile
    let stream = fs.createWriteStream("log.txt", {flags:'a'})
    let d = new Date()
    let now = d.toDateString() + " " + d.toLocaleTimeString()
    let out = "[" + now + "] " + msg + "\n"
    stream.write(out);
    stream.end();
    */
}

function main() {
    const wss = new WebSocketServer({ port: SERVER_PORT });

    log("Listening for connections...")

    wss.on('connection', function connection(ws) {
        log("Client connected.")

        ws.on('message', function message(text) {
            handleCalendarEvents(text + "")
        });
    });
}

function handleCalendarEvents(calendarEventsRaw) {
    console.log("--- RAW JSON ---")
    console.log(calendarEventsRaw)

    let calendarData = JSON.parse(calendarEventsRaw)

    console.log("--- FORMATTED JSON ---")
    console.log(calendarData);

    let alarms = createAlarms(calendarData)
    let alarmsFiltered = filterAlarms(alarms)
    if (alarmsFiltered.length > 12) {
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        return
    }

    let alarmsDeDuplicated = removeDuplicates(alarmsFiltered)
    // setAlarms(alarmsDeDuplicated)
    setAlarms(alarmsDeDuplicated)
}

function createAlarms(calendarEvents) {
    let alarms = []
    for (const calendarEvent of calendarEvents) {
        let startDate
        try {
            startDate = parseStartDateFromLabel(calendarEvent.label)
            startDate.setMinutes(startDate.getMinutes() - 1)
        } catch (e) {
            continue
        }

        let meetingTitle = calendarEvent.title.split('\n')[0]

        alarms.push(new Alarm(startDate, meetingTitle))
    }

    return alarms
}

function filterAlarms(alarmsInput) {
    let alarmsOutput = []

    for (const alarm of alarmsInput) {
        // Don't create alarms if today is not same day as event
        let aDate = alarm.time.toLocaleDateString()
        let nowDate = new Date().toLocaleDateString()
        if (aDate != nowDate) {
            continue
        }

        // Don't create alarms for past events
        if (alarm.time < new Date()) {
            continue
        }

        alarmsOutput.push(alarm)
    }

    return alarmsOutput
}

function removeDuplicates(alarms) {
    let epochToAlarm = {}
    let deDuplicated = []

    for (const alarm of alarms) {
        epochToAlarm[alarm.hash()] = alarm
    }

    for (const [key, alarm] of Object.entries(epochToAlarm)) {
        deDuplicated.push(alarm)
    }

    return deDuplicated
}

function setAlarms(alarms) {
    cleanOldAlarms()

    for (const a of alarms) {
        alert(a.meetingTitle, toLinuxDate(a.time))
    }
}

// agh..
function toLinuxDate(time) {
    let t = time

    let YYYY = t.getFullYear()
    let month = fillZeroes(t.getMonth() + 1)
    let DD = fillZeroes(t.getDate())

    let HH = fillZeroes(t.getHours())
    let min = fillZeroes(t.getMinutes())
    let SS = fillZeroes(t.getSeconds())

    return `${YYYY}-${month}-${DD} ${HH}:${min}:${SS}`
}

function fillZeroes(num) {
    return ("0" + num).slice(-2);
}

function cleanOldAlarms() {
    runCmd("$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/atclean.sh")
}

function parseStartDateFromLabel(text) {
    if (!text.startsWith("event from")) {
        throw new ValidationError()
    }

    let currentYear = new Date().getFullYear()
    let dayRegex = `event from ([a-zA-Z0-9, ]+ ${currentYear})`
    let dayMatches = text.match(dayRegex)

    if (dayMatches == null) {
        throw new ValidationError()
    }

    let day = dayMatches[1]

    let timeOfDayRegex = `${currentYear} ([0-9:]+) to ([0-9:]+)`
    let timeOfDayMatches = text.match(timeOfDayRegex)
    let startHour = timeOfDayMatches[1]
    // let endHour = timeOfDayMatches[2]

    let startTime = new Date(Date.parse(day + " " + startHour))
    // let endTime = new Date(Date.parse(day + " " + endHour))

    return startTime
}

function alert(message, dateTime) {
    log("Creating alert for " + dateTime + " - " + message)

    let workingDirectory="$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server"

    let HH = fillZeroes(t.getHours())
    let min = fillZeroes(t.getMinutes())
    let time = HH + ":" + min

    //runCmd(`$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/alert.sh "${atTime}" "${atTimeUrlEncoded}" "${messageUrlEncoded}"`)
    runCmd(`sudo systemd-run --property=WorkingDirectory=${workingDirectory} --property=TimeoutSec=1sec ` +
        `--on-calendar="${dateTime}" --setenv YK_GIT_DIR=$YK_GIT_DIR --setenv IFTTT_KEY=$IFTTT_KEY ` +
        `--setenv PATH_SWAUDIO=$YK_PATH_DIR ${workingDirectory}/alert.sh "${time}" "${message}"`)
}

function escape(msg) {
    let r = /([a-zA-Z]+)/

    let match = msg.match(r)
    if (match == null) {
        return "ESCAPE-ERROR"
    }

    let escaped = match[1]
    // noinspection UnnecessaryLocalVariableJS
    let shortened = escaped.substring(0, 15)

    return shortened
}

function runCmd(cmd) {
    if (testing) {
        log("Not running command: " + cmd)
        return
    } else {
        log("Running command: " + cmd)
    }

    // log("Running command: " + cmd)

    execSync(cmd, (error, stdout, stderr) => {
        if (error) {
            log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            if (stderr.includes("commands will be executed using /bin/sh")) {
                return
            }

            log(`stderr: ${stderr}`);
            return;
        }

        if (stdout.length > 0) {
            log(`stdout: ${stdout}`);
        }
    });
}