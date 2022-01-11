import { WebSocketServer } from 'ws';
import { exec } from 'child_process';

const testing = true

if (testing) {
    let text = `[{"label":"event from Tuesday, January 11, 2022 09:00 to 10:00 Planning   ` +
        `location https://whereby.com/somwehere organizer Guybrush Threepwood","title":"Planning\\n` +
        `https://whreby.com/somewhere\\nfrom 09:00 to 10:00"}]`
    let calendarData = JSON.parse(text)
    setAlarms(calendarData)
}

class ValidationError extends Error {
}

const wss = new WebSocketServer({ port: 8080 });

console.log("Listening for connections...")

wss.on('connection', function connection(ws) {
    console.log("client connected")

    ws.on('message', function message(text) {
        // console.log('received: %s', text);
        let calendarData = JSON.parse(text)
        setAlarms(calendarData)
    });
});

function setAlarms(calendarEvents) {
    for (const calendarEvent of calendarEvents) {
        let startDate
        try {
            startDate = parseStartDateFromLabel(calendarEvent.label)
        } catch (e) {
            continue
        }

        console.log("Creating alert for", calendarEvent)

        let atTime = toAtTime(startDate)
        let meetingTitle = calendarEvent.title.split('\n')[0]

        alert(meetingTitle, atTime)
    }
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
    // -i icons list: https://askubuntu.com/a/189262/575647
    let escaped = escape(message)
    let cmd = `echo notify-send -i face-glasses "${escaped} XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" | at ${atTime}`

    runCmd(cmd)
    runCmd(cmd)
    runCmd(cmd)
    runCmd(`echo aplay '$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/charge.wav' | at ${atTime}`)
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
        console.log("not running command:", cmd)
        return
    } else {
        console.log("running command:", cmd)
    }

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

        console.log(`stdout: ${stdout}`);
    });
}