Chrome extention to export data from Outlook 365's calendar to a websocket.

# Installasjon

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

```shell
npm install forever -g
forever server/server.js

# logs
forever logs 0 -f
```

Kilde: https://www.geeksforgeeks.org/how-to-run-a-node-js-app-as-a-background-service/

## 3. Test

Når du åpner https://outlook.office.com/calendar/view/month så vil den sende kalenderevents til server-delen.
