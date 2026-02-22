import ContentTreeStructure from "./ContentTreeStructure";

export default interface CopyCutPaste{
    app_id : number | null;
    source : ContentTreeStructure | null;
    destination : ContentTreeStructure | null;
    type : 'cut' | 'copy' | null;
}