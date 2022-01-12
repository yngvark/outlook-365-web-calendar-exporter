import { WebSocketServer } from 'ws';
import { exec } from 'child_process';

class ValidationError extends Error {
}

class Alarm {
    constructor(time, meetingTitle) {
        this.time = time
        this.meetingTitle = meetingTitle
    }

    hash() {
        return this.time.getTime()
    }
}

const testing = false

// To clean jobs: JOBS=$(atq | cut -f 1) && atrm $JOBS
if (testing) {
    let text = `
        [
            {
                "label": "event from Tuesday, January 11, 2022 23:26 to 10:00 Planning   location https://whereby.com/somwehere organizer Guybrush Threepwood",
                "title": "Planning\\nhttps://whreby.com/somewhere\\nfrom 09:00 to 10:00"
            }
        ]
    `

    /*
    let text = `
        [
            {
                "label": "event from Tuesday, January 11, 2022 09:00 to 10:00 Planning   location https://whereby.com/somwehere organizer Guybrush Threepwood",
                "title": "Planning\\nhttps://whreby.com/somewhere\\nfrom 09:00 to 10:00"
            },
            {
                "label": "event from Tuesday, January 11, 2022 23:21 to 10:00 Planning   location https://whereby.com/somwehere organizer Guybrush Threepwood",
                "title": "Planning\\nhttps://whreby.com/somewhere\\nfrom 09:00 to 10:00"
            }
        ]
    `
    */
    handleCalendarEvents(text)
} else {
    main()
}

function main() {
    const wss = new WebSocketServer({ port: 37123 });

    console.log("Listening for connections...")

    wss.on('connection', function connection(ws) {
        console.log("Client connected.")

        ws.on('message', function message(text) {
            handleCalendarEvents(text)
        });
    });
}

function handleCalendarEvents(calendarEventsRaw) {
    // console.log('received: %s', calendarEventsRaw);
    let calendarData = JSON.parse(calendarEventsRaw)

    let alarms = createAlarms(calendarData)
    if (alarms.length > 10) {
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        return
    }

    let deDuplicated = removeDuplicates(alarms)
    setAlarms(deDuplicated)
}

function createAlarms(calendarEvents) {
    let alarms = []
    for (const calendarEvent of calendarEvents) {
        let startDate
        try {
            startDate = parseStartDateFromLabel(calendarEvent.label)
            startDate.setMinutes(startDate.getMinutes() - 2)
        } catch (e) {
            continue
        }

        let meetingTitle = calendarEvent.title.split('\n')[0]

        alarms.push(new Alarm(startDate, meetingTitle))
    }

    return alarms
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
        alert(a.meetingTitle, toAtTime(a.time))
    }
}

function cleanOldAlarms() {
    runCmd("$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/atclean.sh")
}

function parseStartDateFromLabel(text) {
    if (!text.startsWith("event from")) {
        throw ValidationError()
    }

    let currentYear = new Date().getFullYear()
    let dayRegex = `event from ([a-zA-Z0-9, ]+ ${currentYear})`
    let dayMatches = text.match(dayRegex)

    if (dayMatches == null) {
        throw ValidationError()
    }

    let day = dayMatches[1]

    let timeOfDayRegex = `${currentYear} ([0-9:]+) to ([0-9:]+)`
    let timeOfDayMatches = text.match(timeOfDayRegex)
    let startHour = timeOfDayMatches[1]
    // let endHour = timeOfDayMatches[2]

    let startTime = new Date(Date.parse(day + " " + startHour))
    // let endTime = new Date(Date.parse(day + " " + endHour))

    if (startTime.getDate() !== new Date().getDate()) {
        throw ValidationError()
    }

    return startTime
}

// at means the linux tool "at" (see "man at")
// example output: 23:45
function toAtTime(d) {
    return fillZeroes(d.getHours()) + ":" + fillZeroes(d.getMinutes())
}

function fillZeroes(hours) {
    return ("0" + hours).slice(-2);
}

function alert(message, atTime) {
    console.log("Creating alert for", atTime, message)

    let atTimeUrlEncoded = encodeURIComponent(atTime)
    runCmd(`$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/alert.sh "${atTime}" "${atTimeUrlEncoded}" "${message}"`)
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
        return
    }

    console.log("Running command:", cmd)

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            if (stderr.includes("commands will be executed using /bin/sh")) {
                return
            }

            console.log(`stderr: ${stderr}`);
            return;
        }

        if (stdout.length > 0) {
            console.log(`stdout: ${stdout}`);
        }
    });
}