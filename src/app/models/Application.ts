import { AppType } from "./AppType";

export interface Application{
    id : number;
    name : string;
    icon : string;
    type : AppType;
    systemApp : boolean;
    xPosition : number;
    yPosition : number;
    defaultWidth : number;
    defaultHeight : number;
}