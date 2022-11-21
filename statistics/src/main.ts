import {CalendarEvent} from "./calendarEvent"
import { runStats } from "./stats"
import {CalendarData} from "./calendarData"
import { parseDateFromLabel } from "../../server/createAlarm.js"
import {Week} from "./week";

function runAndShowStatistics(calendarData:CalendarData[]) {
    console.log("------------------------------------------------------------")
    console.log("Running statistics")
    console.log("------------------------------------------------------------")

    let calendarEvents = createCalendarEvents(calendarData)
    console.log(calendarEvents)
    let weeks = runStats(calendarEvents)

    console.log("Weeks", weeks)

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
        let year = week.endOfWeek.getFullYear().toString().padStart(2, '0')
        let month = week.getOneIndexedMonth().toString().padStart(2, '0')
        let day = week.endOfWeek.getDate().toString().padStart(2, '0')

        let querySelector = "#header_" + year + "-" + month + "-" + day

        console.log("querySelector", querySelector)

        let sundayNode = document.querySelector(querySelector)
        if (sundayNode != null) {
            // let date: String = sundayNode.innerHTML
            sundayNode.innerHTML = day + " (" + week.meetingPercentage + "%)"
        } else {
            console.log("warning: could not find node for querySelector", querySelector)
        }
    })
}



console.log("STATISTICS LOADED")
console.log(runAndShowStatistics)
