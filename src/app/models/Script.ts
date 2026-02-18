export default interface Script{
    name : string;
    script_code : string[];
    version : string;
    author : string;
    permission : "rwx" | "rw-" | "r-x";
}