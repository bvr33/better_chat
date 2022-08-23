import { langs } from "./language"

export interface Configuration {
    antiSpam: antiSpamConfig
    rooms: roomsConfig
    main: mainConfig
}
export interface antiSpamConfig {
    enable: boolean
}

export interface roomsConfig {
    enable: boolean,
}

export interface mainConfig {
    language: langs
    enable: boolean,
    messageSeparator: string
    logToConsole: boolean
    eventsMessage: {
        join: string,
        left: string
    }

}