
import { events } from "bdsx/event";
import { Plugin } from "./utils/plugin";
import './modules/chat'
import './modules/messages'
import './modules/preventVanilla'
import { TextFormat } from "bdsx/util";
import { langs } from "./utils/language";

export const plugin = new Plugin(
    {
        language: langs.PL,
        enableRooms:false,
        logToConsole:false,
        messageSeparator:`${TextFormat.DARK_AQUA}>`,
        eventsMessage:{
            join:`${TextFormat.GRAY}[${TextFormat.GREEN}+${TextFormat.GRAY}]`,
            left:`${TextFormat.GRAY}[${TextFormat.RED}-${TextFormat.GRAY}]`
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
