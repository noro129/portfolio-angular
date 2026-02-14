export default interface FolderContentStructure{
    id : number;
    name : string;
    icon : string;
    isFolder : boolean;
    isFile : boolean;
    content : Map<string, FolderContentStructure> | undefined
}