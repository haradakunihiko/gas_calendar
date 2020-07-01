export default class MyCalendar {
    getEvents(calenderId: string, date: Date) {
        const calendar = CalendarApp.getCalendarById(calenderId);
        if (!calendar) {
            Logger.log(`could not find Calendar: ${calenderId}`);
            return [];
        }

        const calEvents = calendar.getEventsForDay(date);
        
        calEvents.sort((a, b) => (a.getStartTime() <= b.getStartTime() ? -1 : 1));

        return calEvents;
    }
}