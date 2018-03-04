export interface Message {
    action: MessageAction;
    payload: any;
}

export enum MessageAction {
    UPDATE_TIMER = 'UpdateTimer',
    SAVE_TIMER = 'SaveTimer',
    TIMER_SAVED = 'TimerSaved'
}
