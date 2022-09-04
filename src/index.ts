
import { events } from "bdsx/event"
import { TextFormat } from "bdsx/util"
import { Plugin } from './utils/plugin'
import './commands'
import './modules/eventsCapture'

export enum langs {
    PL = "PL_pl"
}

export interface Language {
}
export interface Configuration {
    language: langs,
    antiSpam: {
        enabled: boolean,
        mute: boolean,
        seconds: number,
        limit: number
    },
    rooms: {
        enabled: boolean,
        messagePrefix: string,
        playerJoinRoom: string,
        playerLeaveRoom: string,
    },
    betterChat: {
        enabled: boolean,
        logToConsole: boolean,
        cooldown: number,
        messageSeparator: string,
        maxMessageLength: number,
    },
    messageHistory: {
        enabled: boolean,
        limit: number,
    },
    soundOnMention: {
        enabled: boolean,
        sound: {
            name: string,
            pitch: number
        },
    },
    soundOnJoin: {
        enabled: true,
        sound: {
            name: string,
            pitch: number
        },
    },
    eventsMessage: {
        join: string,
        left: string,
        sleep: {
            chat: string
            actionbar: string,
        }
    }
}

export const plugin = new Plugin(
    'Better chat',
    {
        language: langs.PL,
        antiSpam: {
            enabled: true,
            mute: true,
            seconds: 10,
            limit: 3
        },
        rooms: {
            enabled: true,
            messagePrefix: '[Room]',
            playerJoinRoom: '(+)',
            playerLeaveRoom: '(-)',
        },
        betterChat: {
            enabled: true,
            logToConsole: false,
            cooldown: 5,
            messageSeparator: `${TextFormat.DARK_AQUA}> `,
            maxMessageLength: 30,
        },
        messageHistory: {
            enabled: false,
            limit: 10,
        },
        soundOnMention: {
            enabled: true,
            sound: {
                name: 'random.orb',
                pitch: 1
            },
        },
        soundOnJoin: {
            enabled: true,
            sound: {
                name: 'random.toast',
                pitch: 0.7
            },
        },
        eventsMessage: {
            join: `${TextFormat.GRAY} [${TextFormat.GREEN} + ${TextFormat.GRAY}]`,
            left: `${TextFormat.GRAY} [${TextFormat.RED} - ${TextFormat.GRAY}]`,
            sleep: {
                chat: 'is sleeping..',
                actionbar: 'players slepping',
            }
        },
    },
    {
    }
)

events.serverOpen.on(
    () => {
        plugin.log( `launching` )
    }
)

events.serverClose.on(
    () => {
        plugin.log( `closed` )
    }
);

