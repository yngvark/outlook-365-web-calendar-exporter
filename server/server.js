import { WebSocketServer } from 'ws'
import { execSync } from 'child_process'
import { createAlarms } from './createAlarm.js'
// import * as fs from 'fs'

const testing = false
const SERVER_PORT = 37123
const SERVER_PORT_TEST = 37124

// To clean jobs: JOBS=$(atq | cut -f 1) && atrm $JOBS
if (testing) {
    let text1 = `
        [
            {
                "label": "event from Tuesday, January 11, 2022 23:26 to 10:00 Planning   location https://whereby.com/somwehere organizer Guybrush Threepwood",
                "title": "Planning\\nhttps://whreby.com/somewhere\\nfrom 09:00 to 10:00"
            }
        ]
    `

    let text2 = `
    [{"title":"Workshop v6\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 12:00 to 15:30","label":"event from Monday, April 25, 2022 12:00 to 15:30 Workshop v6  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Gå igjennom lønnsposter, og finn wins for meg selv\\nfrom 12:00 to 16:00","label":"event from Tuesday, April 26, 2022 12:00 to 16:00 Gå igjennom lønnsposter, og finn wins for meg selv  event shown as Busy"},{"title":"Klarspråk, demokrati og hva Norges splitter nye språklov betyr for oss\\nORIGO-Moterom-30p-Smuget\\nfrom 10:00 to 11:00","label":"event from Wednesday, April 27, 2022 10:00 to 11:00 Klarspråk, demokrati og hva Norges splitter nye språklov betyr for oss  location ORIGO-Moterom-30p-Smuget organizer Therese Bergwitz-Larsen event shown as Tentative"},{"title":"1:1 Yngvar\\nGM\\nfrom 13:30 to 14:00","label":"event from Thursday, June 03, 2022 23:30 to 23:31 1:1 Yngvar  location GM organizer Astri Ek Aparicio event shown as Busy"},{"title":"Fredagsdemo\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:05 to 09:55","label":"event from Friday, April 29, 2022 09:05 to 09:55 Fredagsdemo  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski recurring event shown as Busy"},{"title":"Meet & Gree tTeam B(est) - Holmenkollstafett\\nORIGO-Moterom-12p-Headon-Video\\nfrom 13:30 to 14:00","label":"event from Wednesday, April 27, 2022 13:30 to 14:00 Meet & Gree tTeam B(est) - Holmenkollstafett  location ORIGO-Moterom-12p-Headon-Video organizer Martin Albert-Hoff event shown as Busy"},{"title":"Forbered OKR argumenter\\nfrom 10:10 to 13:00","label":"event from Friday, April 29, 2022 10:10 to 13:00 Forbered OKR argumenter  event shown as Busy"},{"title":"Show & Tell + Stripete\\nSmuget\\nfrom 14:00 to 16:00","label":"event from Wednesday, April 27, 2022 14:00 to 16:00 Show & Tell + Stripete  location Smuget organizer Marianne Olsson event shown as Busy"},{"title":"OKR kick-off Q2 2022\\nmeet.google.com/zhj-vsag-ivn\\nfrom 13:00 to 14:00","label":"event from Friday, April 29, 2022 13:00 to 14:00 OKR kick-off Q2 2022  location meet.google.com/zhj-vsag-ivn organizer Dan Christian Fosse event shown as Busy"},{"title":"Retro Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:00 to 10:00","label":"event from Monday, May 02, 2022 09:00 to 10:00 Retro Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski recurring event shown as Busy"},{"title":"Prep\\nORIGO-Moterom-30p-Smuget\\nfrom 10:00 to 12:00","label":"event from Tuesday, May 03, 2022 10:00 to 12:00 Prep  location ORIGO-Moterom-30p-Smuget organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Tekna kurs\\nfrom Wednesday, May 04, 2022 to Thursday, May 05, 2022","label":"all day event from Wednesday, May 04, 2022 to Thursday, May 05, 2022 Tekna kurs  event shown as Busy"},{"title":"Fredagsdemo\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:05 to 09:55","label":"event from Friday, May 06, 2022 09:05 to 09:55 Fredagsdemo  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Planning Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 10:00 to 11:00","label":"event from Monday, May 02, 2022 10:00 to 11:00 Planning Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski recurring event shown as Busy"},{"title":"Workshop - innspill til retningsvalg for Kjøremiljø\\nORIGO-Moterom-30p-Smuget\\nfrom 12:00 to 15:30","label":"event from Tuesday, May 03, 2022 12:00 to 15:30 Workshop - innspill til retningsvalg for Kjøremiljø  location ORIGO-Moterom-30p-Smuget organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Avbrutt: Avbrutt: Origo FK\\nValle\\nfrom 15:30 to 17:30","label":"event from Wednesday, May 04, 2022 15:30 to 17:30 Avbrutt: Avbrutt: Origo FK  location Valle organizer Ola Granholt event shown as Free"},{"title":"Månedlig fot i bakken - Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8; ORIGO-Moterom-Narnia-4p-Video; https://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 10:00 to 11:00","label":"event from Friday, May 06, 2022 10:00 to 11:00 Månedlig fot i bakken - Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8; ORIGO-Moterom-Narnia-4p-Video; https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Borte\\nfrom 11:00 to 13:00","label":"event from Monday, May 09, 2022 11:00 to 13:00 Borte  event shown as Busy"},{"title":"Avbrutt: Avbrutt: Origo Fotball\\nValle\\nfrom 15:30 to 17:00","label":"event from Tuesday, May 10, 2022 15:30 to 17:00 Avbrutt: Avbrutt: Origo Fotball  location Valle organizer Ola Granholt event shown as Free"},{"title":"Teknisk prat for å dele innsikt (åpen by)\\nORIGO-Moterom-04p-Galtvort-Video; meet.google.com/ufc-rfop-gvk\\nfrom 09:00 to 10:00","label":"event from Thursday, May 12, 2022 09:00 to 10:00 Teknisk prat for å dele innsikt (åpen by)  location ORIGO-Moterom-04p-Galtvort-Video; meet.google.com/ufc-rfop-gvk organizer Endre Midtgård Meckelborg event shown as Busy"},{"title":"Fredagsdemo\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:05 to 09:55","label":"event from Friday, May 13, 2022 09:05 to 09:55 Fredagsdemo  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski recurring event shown as Busy"},{"title":"Holmenkollstafetten\\nOslo\\nfrom 15:00 to 19:00","label":"event from Saturday, May 14, 2022 15:00 to 19:00 Holmenkollstafetten  location Oslo organizer Ola Granholt event shown as Busy"},{"title":"Teknisk prat for å dele innstikt (tilgang til barnehage)\\nORIGO-Moterom-04p-Narnia-Video; meet.google.com/ufc-rfop-gvk\\nfrom 13:00 to 14:00","label":"event from Thursday, May 12, 2022 13:00 to 14:00 Teknisk prat for å dele innstikt (tilgang til barnehage)  location ORIGO-Moterom-04p-Narnia-Video; meet.google.com/ufc-rfop-gvk organizer Endre Midtgård Meckelborg event shown as Busy"},{"title":"Teknisk prat for å dele innsikt (bo hjemme lenger)\\nORIGO-Moterom-04p-Narnia-Video; meet.google.com/ufc-rfop-gvk\\nfrom 10:00 to 11:00","label":"event from Friday, May 13, 2022 10:00 to 11:00 Teknisk prat for å dele innsikt (bo hjemme lenger)  location ORIGO-Moterom-04p-Narnia-Video; meet.google.com/ufc-rfop-gvk organizer Endre Midtgård Meckelborg event shown as Busy"},{"title":"VÅRFEST :-)\\nGlasmagasinet og Åpen Scene  (badstugata 2)\\nfrom 19:00 to 23:59","label":"event from Saturday, May 14, 2022 19:00 to 23:59 VÅRFEST :-)  location Glasmagasinet og Åpen Scene  (badstugata 2) organizer Vedrana Dzonlez event shown as Busy"},{"title":"Startnummerutdeling\\nGM (barnehagerommet)\\nfrom 16:00 to 16:30","label":"event from Thursday, May 12, 2022 16:00 to 16:30 Startnummerutdeling  location GM (barnehagerommet) organizer Ola Granholt event shown as Busy"},{"title":"Sjekk dok description\\nfrom 08:30 to 08:31","label":"event from Monday, May 16, 2022 08:30 to 08:31 Sjekk dok description  event shown as Busy"},{"title":"Samtale rundt migrering \\nORIGO-Moterom-08p-Mono-Video; https://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 12:00 to 13:00","label":"event from Wednesday, May 18, 2022 12:00 to 13:00 Samtale rundt migrering   location ORIGO-Moterom-08p-Mono-Video; https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Kjøremiljø på ledermøte\\nORIGO-Moterom-10p-Spasibar-Video\\nfrom 12:00 to 13:00","label":"event from Thursday, May 19, 2022 12:00 to 13:00 Kjøremiljø på ledermøte  location ORIGO-Moterom-10p-Spasibar-Video organizer Andreas Jacobsen event shown as Busy"},{"title":"Forbered til samtale med Astri i morra\\nfrom 08:00 to 09:00","label":"event from Friday, May 20, 2022 08:00 to 09:00 Forbered til samtale med Astri i morra  event shown as Busy"},{"title":"Retro Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8; ORIGO-Moterom-08p-Azeroth-Video\\nfrom 09:00 to 10:00","label":"event from Monday, May 16, 2022 09:00 to 10:00 Retro Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8; ORIGO-Moterom-08p-Azeroth-Video organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Teknisk prat for å dele innsikt (min side)\\nORIGO-Moterom-04p-Narnia-Video; meet.google.com/ufc-rfop-gvk\\nfrom 14:00 to 15:00","label":"event from Wednesday, May 18, 2022 14:00 to 15:00 Teknisk prat for å dele innsikt (min side)  location ORIGO-Moterom-04p-Narnia-Video; meet.google.com/ufc-rfop-gvk organizer Endre Midtgård Meckelborg event shown as Busy"},{"title":"Debrief: presentasjon for ledergruppen\\nStillerom\\nfrom 13:15 to 13:45","label":"event from Thursday, May 19, 2022 13:15 to 13:45 Debrief: presentasjon for ledergruppen  location Stillerom organizer Frank Dahle event shown as Busy"},{"title":"TLG\\nORIGO-Moterom-10p-Spasibar-Video\\nfrom 09:30 to 11:00","label":"event from Friday, May 20, 2022 09:30 to 11:00 TLG  location ORIGO-Moterom-10p-Spasibar-Video organizer Andreas Jacobsen event shown as Busy"},{"title":"Planning Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8; ORIGO-Moterom-08p-Azeroth-Video\\nfrom 10:00 to 11:00","label":"event from Monday, May 16, 2022 10:00 to 11:00 Planning Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8; ORIGO-Moterom-08p-Azeroth-Video organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Prøvegjennomgang pres til ledermøte\\nORIGO-Moterom-08p-Mordor-Video\\nfrom 15:00 to 15:35","label":"event from Wednesday, May 18, 2022 15:00 to 15:35 Prøvegjennomgang pres til ledermøte  location ORIGO-Moterom-08p-Mordor-Video organizer Andreas Jacobsen event shown as Busy"},{"title":"Superbrukerforum\\nORIGO-Moterom-12p-The Eniac Six-Video; https://origo.whereby.com/kj%C3%B8remilj%C3%B8; https://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 13:00 to 14:30","label":"event from Tuesday, May 24, 2022 13:00 to 14:30 Superbrukerforum  location ORIGO-Moterom-12p-The Eniac Six-Video; https://origo.whereby.com/kj%C3%B8remilj%C3%B8; https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Allmøte for Oslo Origo\\nORIGO-Moterom-30p-Smuget\\nfrom 09:00 to 10:00","label":"event from Wednesday, May 25, 2022 09:00 to 10:00 Allmøte for Oslo Origo  location ORIGO-Moterom-30p-Smuget organizer Therese Bergwitz-Larsen event shown as Busy"},{"title":"Fredagsdemo\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:05 to 09:55","label":"event from Friday, May 27, 2022 09:05 to 09:55 Fredagsdemo  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski recurring event shown as Busy"},{"title":"Kort prat\\nStillerom? Video?\\nfrom 14:35 to 14:50","label":"event from Tuesday, May 24, 2022 14:35 to 14:50 Kort prat  location Stillerom? Video? organizer Andreas Jacobsen event shown as Busy"},{"title":"Avdelingsmøte\\nORIGO-Moterom-12p-Headon-Video\\nfrom 10:00 to 10:50","label":"event from Wednesday, May 25, 2022 10:00 to 10:50 Avdelingsmøte  location ORIGO-Moterom-12p-Headon-Video organizer Andreas Jacobsen event shown as Busy"},{"title":"AWS GameDay\\nSmuget\\nfrom 11:30 to 16:00","label":"event from Wednesday, May 25, 2022 11:30 to 16:00 AWS GameDay  location Smuget organizer Fredrik Vraalsen event shown as Busy"},{"title":"Retro Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:00 to 10:00","label":"event from Monday, May 30, 2022 09:00 to 10:00 Retro Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"Origo AWS samarbeid\\nhttps://meet.google.com/fir-ghft-ruz\\nfrom 13:00 to 13:30","label":"event from Tuesday, May 31, 2022 13:00 to 13:30 Origo AWS samarbeid  location https://meet.google.com/fir-ghft-ruz organizer Fredrik Vraalsen event shown as Busy"},{"title":"Planning Kjøremiljø\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 10:00 to 11:00","label":"event from Monday, May 30, 2022 10:00 to 11:00 Planning Kjøremiljø  location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski event shown as Busy"},{"title":"AWS-synk\\nfrom 09:45 to 11:00","label":"event from Wednesday, June 01, 2022 09:45 to 11:00 AWS-synk  organizer Fredrik Vraalsen event shown as Busy"},{"title":"Fredagsdemo\\nhttps://origo.whereby.com/kj%C3%B8remilj%C3%B8\\nfrom 09:05 to 09:55","label":"event from Friday, June 03, 2022 09:05 to 09:55 Fredagsdemo bGb location https://origo.whereby.com/kj%C3%B8remilj%C3%B8 organizer Nikolai Adam Czajkowski recurring event shown as Busy"}]
    `
    handleCalendarEvents(text2)
} else {
    main()
}


function log(msg) {
    console.log(msg)
}

function main() {
    let port = -1
    if (testing) {
        port = SERVER_PORT_TEST
    } else {
        port = SERVER_PORT
    }
    const wss = new WebSocketServer({ port: port });

    log("Listening for connections...")

    wss.on('connection', function connection(ws) {
        log("Client connected.")

        ws.on('message', function message(text) {
            handleCalendarEvents(text + "")
        });
    });
}

function handleCalendarEvents(calendarEventsRaw) {
    console.log("--- RAW JSON ---")
    console.log(calendarEventsRaw)

    let calendarData = JSON.parse(calendarEventsRaw)

    console.log("--- FORMATTED JSON ---")
    console.log(calendarData);

    let alarms = createAlarms(calendarData)
    let alarmsFiltered = filterAlarms(alarms)
    if (alarmsFiltered.length > 12) {
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        runCmd(`notify-send -i face-glasses "outlook exporter: High number of events"`)
        return
    }

    let alarmsDeDuplicated = removeDuplicates(alarmsFiltered)
    setAlarms(alarmsDeDuplicated)
}

function filterAlarms(alarmsInput) {
    let alarmsOutput = []

    for (const alarm of alarmsInput) {
        // Don't create alarms if today is not same day as event
        let aDate = alarm.time.toLocaleDateString()
        let nowDate = new Date().toLocaleDateString()
        if (aDate != nowDate) {
            continue
        }

        // Don't create alarms for past events
        if (alarm.time < new Date()) {
            continue
        }

        alarmsOutput.push(alarm)
    }

    return alarmsOutput
}

function removeDuplicates(alarms) {
    let epochToAlarm = {}
    let deDuplicated = []

    for (const alarm of alarms) {
        epochToAlarm[alarm.hash()] = alarm
    }

    for (const [key, alarm] of Object.entries(epochToAlarm)) {
        deDuplicated.push(alarm)
    }

    return deDuplicated
}

function setAlarms(alarms) {
    cleanOldAlarms()

    for (const a of alarms) {
        alert(a.meetingTitle, toAtTime(a.time))
    }
}

function cleanOldAlarms() {
    runCmd("$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/atclean.sh")
}

// at means the linux tool "at" (see "man at")
// example output: 23:45
function toAtTime(d) {
    return fillZeroes(d.getHours()) + ":" + fillZeroes(d.getMinutes())
}

function fillZeroes(hours) {
    return ("0" + hours).slice(-2);
}

function alert(message, atTime) {
    log("Creating alert for " + atTime + " - " + message)

    let atTimeUrlEncoded = encodeURIComponent(atTime)
    let messageUrlEncoded = encodeURIComponent(message)
    runCmd(`$YK_GIT_DIR/yngvark/outlook-365-web-calendar-exporter/server/alert.sh "${atTime}" "${atTimeUrlEncoded}" "${messageUrlEncoded}"`)
}

function escape(msg) {
    let r = /([a-zA-Z]+)/

    let match = msg.match(r)
    if (match == null) {
        return "ESCAPE-ERROR"
    }

    let escaped = match[1]
    // noinspection UnnecessaryLocalVariableJS
    let shortened = escaped.substring(0, 15)

    return shortened
}

function runCmd(cmd) {
    if (testing) {
        return
    }

    log("Running command: " + cmd)

    execSync(cmd, (error, stdout, stderr) => {
        if (error) {
            log(`error: ${error.message}`);
            return;
        }

        if (stderr) {
            if (stderr.includes("commands will be executed using /bin/sh")) {
                return
            }

            log(`stderr: ${stderr}`);
            return;
        }

        if (stdout.length > 0) {
            log(`stdout: ${stdout}`);
        }
    });
}