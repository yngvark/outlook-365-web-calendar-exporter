import { parseDateFromLabel } from "../../server/createAlarm.js";

console.log("Hello44")

interface CalendarEventRaw {
    title:String
    label:String
}

class CalendarEvent {
    private readonly meetingTitle:String
    private readonly startDate:Date
    private readonly endDate:Date

    constructor(meetingTitle: string, startDate, endDate) {
        this.meetingTitle = meetingTitle
        this.startDate = startDate
        this.endDate = endDate
    }

}

function runStatistics(raw:CalendarEventRaw[]) {
    console.log("OWOWOWOHOHWOO")
    console.log("Prcessing events", raw)

    let calendarEvents = createCalendarEvents(raw)
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log(calendarEvents)
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
}

function createCalendarEvents(calendarEventsRaw:CalendarEventRaw[]):CalendarEvent[] {
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


console.log(runStatistics)
