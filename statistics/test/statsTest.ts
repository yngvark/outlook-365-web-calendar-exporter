import { expect } from 'chai';
import { runStats }  from '../src/stats';
import {CalendarEvent} from "../src/calendarEvent";

describe('Yoyo test', () => {
    it('should parse JSON correctly', () => {
        let calendarEvents = [
            new CalendarEvent("Planning",
                new Date(2020,1,1,2),
                new Date(2020,1,1,3)
            ),
        ]

        let weeks = runStats(calendarEvents)
        console.log(weeks)
    });
});
