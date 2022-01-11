// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./jquery-3.6.0.js", "./foreground.js"]
        })
            .then(() => {
                console.log("Injected outlook exporter script");
            })
            .catch(err => console.log(err));
    }
});
