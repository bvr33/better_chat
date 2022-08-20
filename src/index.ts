
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { TextPacket } from "bdsx/bds/packets";
import { events } from "bdsx/event";
import { langs, Plugin } from "./utils/plugin";
import { TextFormat } from "bdsx/util";

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

events.packetSend(MinecraftPacketIds.Text).on((packet: TextPacket, ni: NetworkIdentifier) => {
    if (packet.name !== "") {
        let name = packet.name;
        packet.name = "";
        let message = `${TextFormat.DARK_RED}[${TextFormat.YELLOW + TextFormat.BOLD}RANK${TextFormat.RESET + TextFormat.DARK_RED}] ${TextFormat.GOLD}${name} ${TextFormat.DARK_RED}> ${TextFormat.WHITE}${packet.message}`;
        packet.message = message;
    }
})