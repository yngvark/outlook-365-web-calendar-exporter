import { getWeekNumber } from "./weekNumber.js";
import { CalendarEvent } from "./calendarEvent";
import { Week } from "./week";

export function runStats(calendarEvents:CalendarEvent[]) {
    // Group events by week number
    let weekNumberToEvents: Map<string, CalendarEvent[]> = new Map()

    for (const event of calendarEvents) {
        let weekNumber = getWeekNumber(event.startDate) as string

        if (weekNumberToEvents[weekNumber] == undefined) {
            weekNumberToEvents[weekNumber] = []
        }

        weekNumberToEvents[weekNumber].push(event)
    }

    // Calculate statistics
    let weeks:Week[] = []
    weekNumberToEvents.forEach((calendarEvents:CalendarEvent[], weekNumber) => {
        console.log("Weeknumber", weekNumber, calendarEvents)

        calendarEvents.forEach(calendarEvent => {

        })

        // weeks.push(new Week(
        //     getEndOfWeek(calendarEvents[0].startDate),
        //     "100")
        // )
    })

    // for (const event of calendarEvents) {
    //     week.endOfWeek = getEndOfWeek(event.startDate)
    // }

    // Display statistics
    weeks[0] = new Week(getEndOfWeek(new Date()), "53")

    displayMeetingPercentage(weeks)
}

class WeekTemp {

}

function getEndOfWeek(d:Date):Date {
    let first = d.getDate() - d.getDay() // First day is the day of the month - the day of the week
    let last = first + 7 // last day is the first day + 6

    //var firstday = new Date(d.setDate(first)).toUTCString();

    // noinspection UnnecessaryLocalVariableJS
    let lastday = new Date(d.setDate(last))

    return lastday
}

function displayMeetingPercentage(weeks:Week[]) {
    weeks.forEach(week => {
        // Example: "#header_2022-11-20"
        let querySelector = "#header_" + week.endOfWeek.getFullYear() + "-" + week.getOneIndexedMonth() + "-" + week.endOfWeek.getDate()

        let sundayNode = document.querySelector(querySelector)

        let date: String = sundayNode.innerHTML
        sundayNode.innerHTML = date + " (" + week.meetingPercentage + "%)"
    })
}

