import ContentTreeStructure from "./ContentTreeStructure";

export default interface DeletedItem {
    id : number;
    treeNodeRef : ContentTreeStructure;
    parentNodeRef : ContentTreeStructure;
}