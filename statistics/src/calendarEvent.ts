import * as dayjs from 'dayjs'
import {Duration} from "dayjs/plugin/duration";

export class CalendarEvent {
    public readonly meetingTitle:String
    public readonly startDate:Date
    public readonly endDate:Date

    constructor(meetingTitle: string, startDate:Date, endDate:Date) {
        this.meetingTitle = meetingTitle
        this.startDate = startDate
        this.endDate = endDate
    }

    public duration():Duration {
        return dayjs.duration({ hours: 1 })
    }
}
