import { Message, MessageAction } from 'message';

chrome.runtime.onMessage.addListener((message: Message) => {
    if (message.action === MessageAction.UPDATE_TIMER) {
        console.log(message);
    }
});
