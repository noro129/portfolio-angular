export default interface ContentTreeStructure{
    id : number;
    name : string;
    extension : string;
    icon : string;
    isFolder : boolean;
    isFile : boolean;
    content : Map<number, ContentTreeStructure>;
}