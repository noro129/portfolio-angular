import { NotifType } from "./NotifType";

export interface Notification {
    id : number;
    message : string;
    type : NotifType;
}