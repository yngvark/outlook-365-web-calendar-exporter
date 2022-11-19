import {CalendarEvent} from "./calendarEvent"
import { runStats } from "./stats"
import {CalendarData} from "./calendarData"
import { parseDateFromLabel } from "../../server/createAlarm.js"
import {Week} from "./week";

function runAndShowStatistics(calendarData:CalendarData[]) {
    let calendarEvents = createCalendarEvents(calendarData)

    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log(calendarEvents)
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")
    console.log("---------------------------------------------------------------")

    let weeks = runStats(calendarEvents)
    displayMeetingPercentage(weeks)
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


function displayMeetingPercentage(weeks:Week[]):void {
    weeks.forEach(week => {
        // Example: "#header_2022-11-20"
        let querySelector = "#header_" + week.endOfWeek.getFullYear() + "-" + week.getOneIndexedMonth() + "-" + week.endOfWeek.getDate()

        let sundayNode = document.querySelector(querySelector)
        if (sundayNode != null) {
            let date: String = sundayNode.innerHTML
            sundayNode.innerHTML = date + " (" + week.meetingPercentage + "%)"
        } else {
            console.log("warning: could not find node for querySelector", querySelector)
        }
    })
}

console.log(runAndShowStatistics)
