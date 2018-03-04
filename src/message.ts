export interface Message {
    action: MessageAction;
    payload: any;
}

export enum MessageAction {
    UPDATE_TIMER = 'UpdateTimer',
    GET_TIMER = 'GetTimer'
}
