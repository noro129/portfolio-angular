export default interface ContentTreeStructure{
    id : number;
    name : string;
    icon : string;
    isFolder : boolean;
    isFile : boolean;
    content : Map<number, ContentTreeStructure> | undefined
}