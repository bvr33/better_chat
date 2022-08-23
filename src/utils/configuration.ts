import { langs } from "./language"

export interface Configuration {
    language: langs
    enableRooms:boolean,
    logToConsole:boolean
    messageSeparator:String
    eventsMessage:{
        join:string,
        left:string
    }
}