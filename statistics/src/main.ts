import {CalendarEvent} from "./calendarEvent";
import { runStats } from "./stats";
import {CalendarData} from "./calendarData";
import { parseDateFromLabel } from "../../server/createAlarm.js";

console.log("Hello555")

function runAndShowStatistics(calendarData:CalendarData[]) {
    let calendarEvents = createCalendarEvents(calendarData)

    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log(calendarEvents)
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")

    runStats(calendarEvents)
}

function createCalendarEvents(calendarEventsRaw:CalendarData[]):CalendarEvent[] {
    let calendarEvents = []
    for (const calendarEvent of calendarEventsRaw) {
        let startDate, endDate
        try {
            let dates = parseDateFromLabel(calendarEvent.label)
            startDate = dates.startDate
            endDate = dates.endDate
        } catch (e) {
            continue
        }

        let meetingTitle = calendarEvent.title.split('\n')[0]

        calendarEvents.push(new CalendarEvent(meetingTitle, startDate, endDate))
    }

    return calendarEvents
}


console.log(runAndShowStatistics)
