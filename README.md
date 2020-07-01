# できること
特定のカレンダーの今日のイベントを、slackに通知します。 （shareDailyMyEvent）
slackの通常の連携だとprivateイベントまで通知しちゃうので隠して連携したい時に使います。

# 使い方

## 導入
```
# claspの導入
yarn install -g clasp

# 開発するなら。使うだけなら不要
# yarn install 

# app scriptを作る
clasp create --type standalone --title "GasCalendar or whatever" --rootDir "gas_root"

# コードをpushする
clasp push
```

## 設定
ファイル　> プロジェクトのプロパティ > スクリプトのプロパティより設定を行います。

<img width="697" alt="設定箇所" src="https://user-images.githubusercontent.com/4531125/86230886-ae498e00-bbcc-11ea-9848-f2ddbc27c1c0.png">


- my_calendar_id （必須）
- webhook_url （必須）
- webhook_username
- webhook_icon_emoji
- webhook_channel

が必須項目。その他は指定しなくても良い。

### 連携する取得カレンダーIDの指定

<img width="420" alt="CalendarIDしゅとく1" src="https://user-images.githubusercontent.com/4531125/86228681-9fada780-bbc9-11ea-9c60-956041ce49a8.png">

<img width="633" alt="CalendarIDしゅとく2" src="https://user-images.githubusercontent.com/4531125/86228705-a9370f80-bbc9-11ea-83ca-1439a6c31b63.png">

で確認できるCalendarIDを `my_calendar_id` に設定します。

### 通知するslackへのwebhook情報の登録
slackでwebhookのURLを取得して、 `webhook_url` に指定します。