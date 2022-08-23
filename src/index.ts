
import { events } from "bdsx/event";
import { langs, Plugin } from "./utils/plugin";
import './modules/chat'
import './modules/messages'
import './modules/preventVanilla'

const plugin = new Plugin(
    {
        language: langs.PL,
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
