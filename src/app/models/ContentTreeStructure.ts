import { Application } from "./Application";

export default interface ContentTreeStructure{
    application : Application;
    content : Map<number, ContentTreeStructure>;
}