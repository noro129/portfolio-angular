export default interface ContextMenuItem {
    label : string;
    icon : string;
    action : () => void;
    disabled : boolean;
}