import { MessageAction } from 'message';

chrome.tabs.query(
    {
        active: true,
        currentWindow: true
    },
    (tabs: chrome.tabs.Tab[]) => {
        console.log(tabs);
    }
);

let timer = 0;
setInterval(() => {
    timer++;
    console.log(timer);
}, 1000);

// Send timer to popup to display.
chrome.runtime.sendMessage({
    action: MessageAction.UPDATE_TIMER,
    payload: {
        timer: 'Loading'
    }
});
