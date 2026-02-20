import { Application } from "./Application";

export interface OpenInstance {
    id : string;
    application : Application;
    hidden : boolean;
    positionX : number;
    positionY : number;
    positionZ : number;
    windowWidth : number;
    windowHeight : number;
    focusedOn : boolean;
}