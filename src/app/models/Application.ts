import { AppType } from "./AppType";

export interface Application{
    id : number;
    displayName : string;
    name : string;
    icon : string;
    type : AppType;
    canDelete : boolean;
    extension : string,
    defaultWidth : number;
    defaultHeight : number;
    resizeable : boolean;
}