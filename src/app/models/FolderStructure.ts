export interface FolderStructure{
    "name" : string;
    "isFolder" : boolean;
    "subContent" : FolderStructure[];
}