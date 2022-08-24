
import './modules/eventsCapture'
import { events } from "bdsx/event";
import { Plugin } from "./utils/plugin";
import { TextFormat } from "bdsx/util";
import { langs } from "./utils/language";
import { command } from 'bdsx/command'
import { CommandPermissionLevel } from "bdsx/bds/command";
import { mainmenu } from "./modules/froms/mainmenu";

export const plugin = new Plugin(
    {
        antiSpam: {
            enable: true
        },
        rooms: {
            enable: false,
        },
        main: {
            language: langs.PL,
            enable: true,
            logToConsole: false,
            messageSeparator: `${TextFormat.DARK_AQUA}>`,
            eventsMessage: {
                join: `${TextFormat.GRAY}[${TextFormat.GREEN}+${TextFormat.GRAY}]`,
                left: `${TextFormat.GRAY}[${TextFormat.RED}-${TextFormat.GRAY}]`
            }

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

events.serverOpen.on(() => {
    plugin.log(`launching`);
});

events.serverClose.on(() => {
    plugin.log(`closed`);
});

events.serverOpen.on(
    () => {

        const cmd = command.register('bchat',
            'better chat settings form',
            CommandPermissionLevel.Operator
        )
        cmd.overload((_param, origin, _output) => {
            const commandUser = origin.getEntity();
            if (!commandUser?.isPlayer()) {
                plugin.log('ta komenda jest przeznaczona dla gracza');
                return;
            }
            mainmenu(commandUser)

        },
            {}
        );

        /**
         *
         */


    }
)