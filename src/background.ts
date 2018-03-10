import ChromePromise from 'chrome-promise';
import { MessageAction, Message } from 'message';
import * as moment from 'moment';

const chromep = new ChromePromise();

// A global Timer that tracks how long the current tab has been active (in seconds).
let timer = 0;
let timerId: NodeJS.Timer | null = null;
let currentHostname: string;

(async () => {
    try {
        startTimer();
        const url = await getActiveTabURL();
        if (!url) return;
        currentHostname = extractHostname(url);

        listenToTabStatusChange();
        listenToRuntimeMessages();
        listenToIdleTimer();
    } catch (error) {
        console.error(error);
    }
})();

function startTimer() {
    timerId = setInterval(() => {
        timer++;
    }, 1000);
}

function listenToIdleTimer() {
    chrome.idle.setDetectionInterval(15); //second

    chrome.idle.onStateChanged.addListener((newState: string) => {
        if (newState != 'active' && timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            startTimer();
        }
    });
}

function listenToTabStatusChange() {
    chrome.tabs.onActivated.addListener(async (): Promise<void> => {
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
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab): Promise<void> => {
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
                if (hostname === currentHostname) return; // tab isn't changed
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

// update timer in chromePromise
async function save(): Promise<void> {
    // Filter invalid hostnames such as newtab, extensions.
    if (currentHostname.indexOf('.') === -1) {
        timer = 0;
        return;
    }
    const date = moment().format('LL');
    const sitemon = await chromep.storage.sync.get();

    sitemon[date] = sitemon[date] || {};

    let newTotalTime = sitemon[date][currentHostname] || 0;
    newTotalTime += timer;

    sitemon[date][currentHostname] = newTotalTime;

    await chromep.storage.sync.set(sitemon);
    // Reset timer for every successful save.
    timer = 0;
}

function afterSave(hostname: string): void {
    currentHostname = hostname;
}

function listenToRuntimeMessages(): void {
    chrome.runtime.onMessage.addListener(async (message: Message) => {
        if (message.action === MessageAction.SAVE_TIMER) {
            await save();
            chrome.runtime.sendMessage({
                action: MessageAction.TIMER_SAVED
            });
        }
    });
}
