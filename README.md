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

I OS-et ditt, legg til `launch-outlook-exporter`.

Putt `launch-outlook-exporter-starter` i et sted PATH-en din.

## 3. Test

Når du åpner https://outlook.office.com/calendar/view/month så vil den sende kalenderevents til server-delen.

# Testing under utvikling

