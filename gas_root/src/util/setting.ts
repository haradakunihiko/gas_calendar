
interface WebhookSetting {
    webhook: string
    username: string
    icon_emoji: string
    channel: string
}

export default class Setting {

    getMyCalendarId() {
        return PropertiesService.getScriptProperties().getProperty('my_calendar_id');
    }

    getSettingUrl() {
        return PropertiesService.getScriptProperties().getProperty('setting_url');
    }

    getDefaultSlackWebhookSettings(): WebhookSetting {
        return {
            webhook: PropertiesService.getScriptProperties().getProperty('webhook_url'),
            username: PropertiesService.getScriptProperties().getProperty('webhook_username'),
            icon_emoji: PropertiesService.getScriptProperties().getProperty('webhook_icon_emoji'),
            channel: PropertiesService.getScriptProperties().getProperty('webhook_channel')
        }
    }

    getEmailAddresses() {
        if (!this.getSettingUrl()) {
            return [];
        }
        const spreadsheet = SpreadsheetApp.openByUrl(this.getSettingUrl());
        const sheet = spreadsheet.getSheetByName('dev_email_addresses');
        const startrow = 1;
        const startcol = 1;
        const lastrow = sheet.getLastRow();
        const lastcol = 1;
        const values = sheet.getSheetValues(startrow, startcol, lastrow, lastcol)
        return values.map(value => value[0]).filter(_ => !!_);
    }
    
    getSlackWebhookSetting(key): WebhookSetting|undefined {
        const list: WebhookSetting[] = [this.getDefaultSlackWebhookSettings()];

        if (this.getSettingUrl()) {
            const spreadsheet = SpreadsheetApp.openByUrl(this.getSettingUrl());
            const sheet = spreadsheet.getSheetByName('slack_webhook');
            if (sheet) {
                const startrow = 2;
                const startcol = 1;
                const lastrow = sheet.getLastRow();
                const lastcol = 5;
                const values = sheet.getSheetValues(startrow, startcol, lastrow, lastcol);
            
                list.unshift(...values.filter(value => value.length === 5)
                    .filter(value => value[0] === key)
                    .map(value => ({
                        webhook: value[1],
                        username: value[2],
                        icon_emoji: value[3],
                        channel: value[4],
                    })))
            }
        }
       return list.shift();
    }
}
