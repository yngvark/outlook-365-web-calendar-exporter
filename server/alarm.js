export class Alarm {
    constructor(time, meetingTitle) {
        this.time = time
        this.meetingTitle = meetingTitle
    }

    hash() {
        return this.time.getTime()
    }
}
