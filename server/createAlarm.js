import {Alarm} from "./alarm.js";
import {ValidationError} from "./validation_error.js";

function createAlarms(calendarEvents) {
    let alarms = []
    for (const calendarEvent of calendarEvents) {
        let startDate
        try {
            startDate = parseDateFromLabel(calendarEvent.label).startDate
            startDate.setMinutes(startDate.getMinutes() - 1)
        } catch (e) {
            continue
        }

        let meetingTitle = calendarEvent.title.split('\n')[0]

        alarms.push(new Alarm(startDate, meetingTitle))
    }

    return alarms
}

function parseDateFromLabel(text) {
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
    let endHour = timeOfDayMatches[2]

    let startDate = new Date(Date.parse(day + " " + startHour))
    let endDate = new Date(Date.parse(day + " " + endHour))

    return {
        startDate: startDate,
        endDate: endDate
    }
}

export {
    createAlarms,
    parseDateFromLabel
}