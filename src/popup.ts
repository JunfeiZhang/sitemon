import ChromePromise from 'chrome-promise';
import { Message, MessageAction } from 'message';
import * as $ from 'jquery';
import * as moment from 'moment';

const chromep = new ChromePromise();

(async () => {
    listenToRuntimeMessages();
    sendSaveTimerMessage();
})();

function listenToRuntimeMessages(): void {
    chrome.runtime.onMessage.addListener(async (message: Message) => {
        if (message.action === MessageAction.TIMER_SAVED) {
            const sitemon = await chromep.storage.sync.get();
            display(sitemon);
        }
    });
}

function sendSaveTimerMessage(): void {
    chrome.runtime.sendMessage({
        action: MessageAction.SAVE_TIMER
    });
}

function display(sitemon: any): void {
    const date = moment().format('LL');
    const list = sitemon[date];
    const sortedList = list
        ? Object.keys(list).sort(function(a, b) {
              return list[b] - list[a];
          })
        : [];
    displayHeader(sortedList.length);
    displaySiteDetails(list, sortedList);
}

function displayHeader(total: number): void {
    const date = moment().format('LL');
    $('#date').text(date);
    $('#total').text(total);
}

function displaySiteDetails(list: any, sortedList: string[]): void {
    const $siteDetails = $('#site-details');
    for (let i = 0; i < sortedList.length; i++) {
        const item = sortedList[i];
        const duration = formatDuration(list[item]);
        const li = $('<li/>').appendTo($siteDetails);
        $('<h2/>')
            .addClass('rank')
            .text(i + 1)
            .appendTo(li);

        $('<div/>')
            .addClass('vertical-divider')
            .appendTo(li);

        const content = $('<div/>')
            .addClass('content')
            .appendTo(li);

        $('<p/>')
            .addClass('hostname')
            .text(item)
            .appendTo(content);

        $('<p/>')
            .addClass('duration')
            .text(duration)
            .appendTo(content);
    }
}

function formatDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
    duration = duration % 3600;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${hours}H ${minutes}M ${seconds}S`;
}
