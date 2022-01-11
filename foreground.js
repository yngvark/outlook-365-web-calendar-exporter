console.log("YK FOREGROUND");

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState != 'loading')
                fn();
        });
    }
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm("div[aria-label*='event from']").then((elm) => {
// waitForElm(".root-268").then((elm) => {
    console.log('Element is aalmost ready');

    setTimeout(function() {

        console.log(elm.textContent);


        let calendarDataInput = document.querySelectorAll("div[aria-label*='event from']")

        let calendarData = []

        for (let i = 0; i < calendarDataInput.length; i++) {
            let title = calendarDataInput[i].getAttribute("title")
            let label  = calendarDataInput[i].getAttribute("aria-label")

            let entry = {
                title: title,
                label: label,
            }

            calendarData.push(entry)
        }


        console.log("Connecting...")
        ws = new WebSocket("ws://localhost:8080");
        console.log("Connected!")

        ws.onopen = function (event) {
            console.log("Sending", calendarData)
            ws.send(JSON.stringify(calendarData))
        }
    }, 3000);
});


// // test
window.ready(function() {

    setTimeout(function() {
        console.log("HEEHY")

        console.log( "ready!" );
        let calendarData = document.querySelectorAll("div[aria-label*='event from']")
        console.log("cal data ACTUAL", calendarData)

    }, 500)

    // ws.onopen = function(event) {
    //     ws.send("hello")
    // }
});