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
    // Element is almost ready, using a setTimeout to be actual ready
    setTimeout(function() {
        console.log(elm.textContent);

        // Test in browser console with: $("div[aria-label*='event from']")
        let calendarEvents = document.querySelectorAll("div[aria-label*='event from']")

        let calendarData = []

        for (const event of calendarEvents) {
            let title = event.getAttribute("title")
            let label  = event.getAttribute("aria-label")

            let entry = {
                title: title,
                label: label,
            }

            calendarData.push(entry)
        }

        console.log("Connecting...")
        let ws = new WebSocket("ws://localhost:37123");
        console.log("Connected!")

        ws.onopen = function (event) {
            console.log("Sending", calendarData)
            ws.send(JSON.stringify(calendarData))
        }
    }, 3000);
});
