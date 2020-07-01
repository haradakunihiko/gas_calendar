import MyCalendar from 'util/calendar';
import Slack from 'util/slack';
import Setting from 'util/setting';

interface EventAndUser {
    event: GoogleAppsScript.Calendar.CalendarEvent,
    user: string
}

function shareRemoteEvent() {
    new ShareRemoteEvent().run();
}

class ShareRemoteEvent {
    private calendar: MyCalendar;
    private setting: Setting;
    private slack: Slack;

    constructor() {
        this.calendar = new MyCalendar();
        this.setting = new Setting();
        this.slack = new Slack();
    }

    run() {
        const eventList = this.collectEvent(this.setting.getEmailAddresses());
        const content = this.formatEvents(eventList);
        this.post(content);
    }

    collectEvent(devList: Array<string>): Array<EventAndUser> {
        return devList.flatMap(calenderId => {
            const events = this.calendar.getEvents(calenderId, new Date());
            return events.filter(e => {
                return e.isAllDayEvent();
            }).map(e => ({
                event: e,
                user: calenderId
            }));
        })
    }
    
    // format event
    formatEvents(eventList: Array<EventAndUser>): string {
        return eventList.map(e => {
            const user = e.user.split('@')[0];
    
            return `${user}: ${e.event.getTitle()}`;
        }).join('\n');
    }
    
    // send to slack
    post(content) {
        if (content === "") {
            return;
        }
    
        const now = new Date();
        if (now.getDay() == 0 || now.getDay() == 6) {
            return;
        }
    
        const week = ['日', '月', '火', '水', '木', '金', '土'];
        const day = ((now.getMonth() + 1) + '/' + now.getDate() + ' (' + week[now.getDay()] + ')');
    
        this.slack.post('share_all_devuser_event', day + "の本日の予定\n```" + content + "```\n");
    }
}