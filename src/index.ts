
import './modules/eventsCapture'
import { events } from "bdsx/event";
import { langs, Plugin } from "@bdsx/plugin_base";
import { TextFormat } from "bdsx/util";
import { command } from 'bdsx/command'
import { CommandPermissionLevel } from "bdsx/bds/command";
import { mainmenu } from "./modules/froms/mainmenu";


export const plugin = new Plugin(
    {
        language: langs.PL,
        antiSpam: {
            enabled: true,
            mute: true,
            seconds: 15,
            Messagelimit: 3
        },
        rooms: {
            enable: false,
            messagePrefix: '[Room]',
            playerJoinRoom: 'player join',
            playerLeaveRoom: 'player left',
        },
        betterChat: {
            enable: true,
            logToConsole: false,
            messageSeparator: `${TextFormat.DARK_AQUA}>`,
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
            join: `${TextFormat.GRAY}[${TextFormat.GREEN}+${TextFormat.GRAY}]`,
            left: `${TextFormat.GRAY}[${TextFormat.RED}-${TextFormat.GRAY}]`,
            sleep: {
                chat: 'Player',
                actionbar: 'players',
            }
        },
        motd: {
            values: [
                `${TextFormat.OBFUSCATED + 'xxx'}${TextFormat.RESET + TextFormat.RED}BQ${TextFormat.OBFUSCATED + 'xxx'}`
            ],
            interval: 2,
            useDefault: false,
        }
    },
    {
        name: 'Better chat',
        messages: {},
        settings: {},
        menuEntries: {},
        texts: {}

    }
)

events.serverOpen.on( () => {
    plugin.log( `launching` );
} );

events.serverClose.on( () => {
    plugin.log( `closed` );
} );

events.serverOpen.on(
    () => {

        const cmd = command.register( 'bchat',
            'better chat settings form',
            CommandPermissionLevel.Operator
        )
        cmd.overload( ( _param, origin, _output ) => {
            const commandUser = origin.getEntity();
            if( !commandUser?.isPlayer() )
            {
                plugin.log( 'ta komenda jest przeznaczona dla gracza' );
                return;
            }
            mainmenu( commandUser )

        },
            {}
        );

        /**
         *
         */


    }
)