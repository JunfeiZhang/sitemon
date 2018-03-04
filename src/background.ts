import ChromePromise from 'chrome-promise';
import { MessageAction, Message } from 'message';
import * as moment from 'moment';

const chromep = new ChromePromise();

// A global Timer that tracks how long the current tab has been active (in seconds).
let timer = 0;
setInterval(() => {
    timer++;
}, 1000);

let currentHostname: string;

(async () => {
    try {
        const url = await getActiveTabURL();
        if (!url) return;
        currentHostname = extractHostname(url);

        listenToTabStatusChange();
    } catch (error) {
        console.error(error);
    }
})();

function listenToTabStatusChange() {
    chrome.tabs.onActivated.addListener(async (): Promise<void> => {
        console.log('ACTIVE TAB CHANGED...');
        const url = await getActiveTabURL();
        if (!url) return;
        const hostname = extractHostname(url);
        await save();
        afterSave(hostname);
    });

    // Note: a tab can be updated without being currently active.
    // For example: when you are listening to YouTube music on one tab
    // and reading a post on another tab, when YouTube plays next music,
    // the YouTube tab is still considered as updated.
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab): Promise<
        void
    > => {
        if (
            tabId &&
            changeInfo.status &&
            changeInfo.status === 'complete' &&
            tab.status &&
            tab.status === 'complete' &&
            tab.url
        ) {
            // Only care active tab that gets updated.
            const updatedTabs = await chromep.tabs.query({
                active: true
            });
            if (updatedTabs.length > 0) {
                const url = updatedTabs[0].url;
                if (!url) return;
                const hostname = extractHostname(url);
                if (hostname === currentHostname) return;
                console.log('TAB UPDATED...');
                await save();
                afterSave(hostname);
            }
        }
    });
}

async function getActiveTabURL(): Promise<string | undefined> {
    const tabs = await chromep.tabs.query({
        active: true,
        currentWindow: true
    });
    if (tabs.length === 0) return undefined;
    return tabs[0].url;
}

function extractHostname(url: string): string {
    return new URL(url).hostname;
}

async function save(): Promise<void> {
    console.log('SAVING...');
    const now = moment().format('L');
    const sitemon = await chromep.storage.sync.get();

    sitemon[now] = sitemon[now] || {};

    let newTime = sitemon[now][currentHostname] || 0;
    newTime += timer;

    sitemon[now][currentHostname] = newTime;

    await chromep.storage.sync.set(sitemon);
    console.log('SAVED HOSTNAME', currentHostname);
    console.log(sitemon);
}

function afterSave(hostname: string): void {
    timer = 0;
    currentHostname = hostname;
}

chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.action === MessageAction.GET_TIMER) {
        // Send timer to popup to display.
        chrome.runtime.sendMessage({
            action: MessageAction.UPDATE_TIMER,
            payload: {
                timer: timer
            }
        });
    }
});
