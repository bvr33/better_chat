
import { events } from "bdsx/event";
import { TextFormat } from "bdsx/util";
import { Plugin } from './utils/plugin';
import './commands'
import './modules/eventsCapture'
import './modules/motdLoop'

export enum langs {
    PL = "PL_pl"
}

export interface Language {
    name: string
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
        sound: string,
    },
    soundOnJoin: {
        enabled: true,
        sound: string,
    },
    eventsMessage: {
        join: string,
        left: string,
        sleep: {
            chat: string
            actionbar: string,
        }
    },
    motd: {
        values: string[],
        interval: number,
        useDefault: boolean,
    }
}

export const plugin = new Plugin(
    {
        language: langs.PL,
        antiSpam: {
            enabled: true,
            mute: true,
            seconds: 20,
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
            enabled: true,
            limit: 10,
        },
        soundOnMention: {
            enabled: true,
            sound: 'random.orb',
        },
        soundOnJoin: {
            enabled: true,
            sound: 'random.orb',
        },
        eventsMessage: {
            join: `${TextFormat.GRAY} [${TextFormat.GREEN} + ${TextFormat.GRAY}]`,
            left: `${TextFormat.GRAY} [${TextFormat.RED} - ${TextFormat.GRAY}]`,
            sleep: {
                chat: 'is sleeping..',
                actionbar: 'players slepping',
            }
        },
        motd: {
            values: [
                `${TextFormat.YELLOW}SERVER NAME`,
                `${TextFormat.RED}SERVER NAME`,
                `${TextFormat.BLUE}SERVER NAME`
            ],
            interval: 10,
            useDefault: false,
        }
    },
    {
        name: 'Better chat',
    }
)

events.serverOpen.on(
    () => {
        plugin.log( `launching` );
    }
);

events.serverClose.on(
    () => {
        plugin.log( `closed` );
    }
);

