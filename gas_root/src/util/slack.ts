import Setting from 'util/setting';
export default class Slack {
    private setting: Setting;
    constructor() {
        this.setting = new Setting();
    }

    // send to slack
    post(key: string, contents: string) {
        if (contents === "") {
            return;
        }

        const webhookSetting = this.setting.getSlackWebhookSetting(key);

        const payload = {
            "text": contents
        }

        if (webhookSetting.username) {
            // 送信者名
            payload["username"] = webhookSetting.channel;
        }

        if (webhookSetting.icon_emoji) {
            // 送信時のアイコン
            payload["icon_emoji"] = webhookSetting.icon_emoji;
        }

        if (webhookSetting.channel) {
            // チャンネル
            payload["channel"] = webhookSetting.channel;
        }

        const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            "method": "post",
            "payload": JSON.stringify(payload)
        };

        Logger.log(payload);

        const response = UrlFetchApp.fetch(webhookSetting.webhook, options);
        const content = response.getContentText("UTF-8");
    }

}