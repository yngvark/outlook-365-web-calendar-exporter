export class Week {
    // public readonly weekNumber:String
    public readonly endOfWeek:Date
    public readonly meetingPercentage:String
    // public readonly events:CalendarEvent

    constructor(endOfWeek: Date, meetingPercentage: String) {
        this.endOfWeek = endOfWeek;
        this.meetingPercentage = meetingPercentage;
    }

    getOneIndexedMonth() {
        return this.endOfWeek.getMonth() + 1;
    }

    getDateWithLeadingZero() {
        return this.endOfWeek.getDate().toString().padStart(2, '0');
    }
}
