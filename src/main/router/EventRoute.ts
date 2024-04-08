export default class EventRoute{
    name: any;
    callback: any;
    constructor( name , callback ){
        this.name = name;
        this.callback = callback;
    }
}
