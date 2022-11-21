export class CalendarEvent {
    public readonly meetingTitle:String
    public readonly startDate:Date
    public readonly endDate:Date

    constructor(meetingTitle: string, startDate:Date, endDate:Date) {
        this.meetingTitle = meetingTitle
        this.startDate = startDate
        this.endDate = endDate
    }

    public durationInMs():number {
        return this.subtract(this.endDate, this.startDate)
    }

    // https://en.wikipedia.org/wiki/Subtraction
    private subtract(minuend:Date, subtrahend:Date):number {
        const minuendUtc = Date.UTC(minuend.getFullYear(), minuend.getMonth(), minuend.getDate(), minuend.getHours(), minuend.getMinutes(), minuend.getSeconds(), minuend.getMilliseconds());
        const subtrahendUtc = Date.UTC(subtrahend.getFullYear(), subtrahend.getMonth(), subtrahend.getDate(), subtrahend.getHours(), subtrahend.getMinutes(), subtrahend.getSeconds(), subtrahend.getMilliseconds());

        return minuendUtc - subtrahendUtc;
    }
}

