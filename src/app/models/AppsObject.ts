import { AppType } from "./AppType";

export interface AppsObject {
  id : number;
  name : string;
  icon : string;
  type : AppType;
  systemApp : boolean;
  focused : boolean;
  defaultHeight : number;
  defaultWidth : number;
  resizeable : boolean;
}