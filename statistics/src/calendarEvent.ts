export class CalendarEvent {
    public readonly meetingTitle:String
    public readonly startDate:Date
    public readonly endDate:Date

    constructor(meetingTitle: string, startDate, endDate) {
        this.meetingTitle = meetingTitle
        this.startDate = startDate
        this.endDate = endDate
    }
}
