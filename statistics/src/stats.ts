import { getWeekNumber } from "./weekNumber.js";
import { CalendarEvent } from "./calendarEvent";
import { Week } from "./week";

const availableHoursAWeek = 37.5

export function runStats(calendarEvents:CalendarEvent[]):Week[] {
    // Group events by week number

    let weekNumberToEvents: Map<string, CalendarEvent[]> = new Map()

    for (const event of calendarEvents) {
        let weekNumber = getWeekNumber(event.startDate)[1] as unknown as string

        if (weekNumberToEvents.get(weekNumber) == undefined) {
            weekNumberToEvents.set(weekNumber, [])
        }

        weekNumberToEvents.get(weekNumber)!.push(event)
    }

    // Calculate statistics
    let weeks:Week[] = []
    weekNumberToEvents.forEach((calendarEvents:CalendarEvent[], weekNumber) => {
        let meetingDurationSum:number = 0

        calendarEvents.forEach(calendarEvent => {
            let eventDuration = (calendarEvent as CalendarEvent).durationInMs()
            meetingDurationSum += eventDuration
        })


        let meetingDurationSumHours = meetingDurationSum / 1000 / 60 / 60
        let meetingPercentage:String = Math.round(meetingDurationSumHours / availableHoursAWeek * 100) + ""

        weeks.push(new Week(
            getEndOfWeek(calendarEvents[0].startDate),
            meetingPercentage)
        )
    })

    // for (const event of calendarEvents) {
    //     week.endOfWeek = getEndOfWeek(event.startDate)
    // }

    // Display statistics
    // weeks[0] = new Week(getEndOfWeek(new Date()), "53")

    return weeks
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
