Chrome extention to export data from Outlook 365's calendar to a websocket.

# Installasjon

## Sett opp miljø

Sett miljøvaribaler

* YK_GIT_DIR
* IFTTT_KEY

## 1. Installer Chrome extension

1. Klon eller last ned git repositroy
2. Pakk ut (unzip) hvis du lastet ned direkte
3. Åpne chrome
4. Gå til  ```chrome:\\extensions```
5. Skru på "developer mode" toggle i øverste høyre hjørne
6. Klikk "Load unpacked" knapp
7. Velg mappen du klonet / pakket ut
8. Ferdig!

Åpne chrome console for logging.

## 2. Sett i gang server-delen av appen

Start opp ved maskinstart:


```shell
sudo nano /etc/systemd/system/outlook-exporter.service
```

```
[Unit]
Description=Outlook Exporter
After=network.target

[Service]
ExecStart=/xxxxxxxxxxx/.nvm/versions/node/v17.3.1/bin/node /xxxxxxxxxxx/outlook-365-web-calendar-exporter/server/server.js
Type=simple
Restart=on-failure
User=youself
Group=youself
Environment=PATH=/usr/bin:/usr/local/bin
Environment=YK_GIT_DIR=/home/xxxxxxxxxxxxxxx
Environment=IFTTT_KEY=xxxxxxxxxxxxxxxxxxxx
WorkingDirectory=/xxxxxxxxx/outlook-365-web-calendar-exporter/server

[Install]
WantedBy=multi-user.target
```

```shell
sudo systemctl daemon-reload
sudo systemctl start outlook-exporter
sudo systemctl enable outlook-exporter

journalctl -xe # For å se litt logger
tail -f /var/log/syslog # For å se litt andre logger
```


### Alternativ: Forever

Funker ikke mellom restarts.

```shell
npm install forever -g
forever server/server.js

# logs
forever logs 0 -f
```

Kilde: https://www.geeksforgeeks.org/how-to-run-a-node-js-app-as-a-background-service/



## 3. Test

Når du åpner https://outlook.office.com/calendar/view/month så vil den sende kalenderevents til server-delen.
