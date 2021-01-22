import MyCalendar from 'util/calendar';
import Slack from 'util/slack';
import Setting from 'util/setting';

function shareDailyMyEvent() {
    new ShareDailyMyEvent().run();
}

class ShareDailyMyEvent {
    private calendar: MyCalendar;
    private slack: Slack;
    private setting: Setting;

    constructor() {
        this.calendar = new MyCalendar();
        this.slack = new Slack();
        this.setting = new Setting();
    }

    run() {
        const events = this.calendar.getEvents(this.setting.getMyCalendarId(), new Date());
        const content = this.formatEvents(events);
        this.post(content);
    }

    formatEvents(events: GoogleAppsScript.Calendar.CalendarEvent[]): string {
        
        return events.map(function (e) {
            let prefix = "";
            let title = e.getTitle();
            const startTime = e.getStartTime();
            const endTime = e.getEndTime();
            const location = e.getLocation();
            const splitEventId = e.getId().split('@');
            
            const eventURL = "https://www.google.com/calendar/event?eid=" + (Utilities.base64Encode(splitEventId[0] + " " + e.getOriginalCalendarId()).replace('==', ''));
            Logger.log(eventURL);
            
    
            if (e.getVisibility() === CalendarApp.Visibility.PRIVATE) {
                title = '非公開イベント';
            }
    
            if (e.isAllDayEvent()) {
                prefix += Utilities.formatDate(startTime, "GMT+0900", "MM/dd");
                prefix += " 終日   ";
            } else {
                prefix += Utilities.formatDate(startTime, "GMT+0900", "HH:mm");
                prefix += Utilities.formatDate(endTime, "GMT+0900", "〜HH:mm ");
                if (location != "") {
                    prefix += "@" + location + " ";
                }
            }
            
            return `${prefix}<${eventURL}|${title}>`;
        }).join('\n');
    }

    post(contents: string): void {
        if (contents == "") {
            return;
        }

        const now = new Date();
        if (now.getDay() == 0 || now.getDay() == 6) {
            return;
        }

        const week = ['日', '月', '火', '水', '木', '金', '土'];
        const day = ((now.getMonth() + 1) + '/' + now.getDate() + ' (' + week[now.getDay()] + ')');

        this.slack.post('my_daily_event', day + "の本日の予定\n```" + contents + "```\n")
    }
}
