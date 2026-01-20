import { NotifType } from "./NotifType";

export interface Notification {
    id : string;
    message : string;
    type : NotifType;
}