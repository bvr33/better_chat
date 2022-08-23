import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { TextPacket } from "bdsx/bds/packets";
import { events } from "bdsx/event";
import { TextFormat } from "bdsx/util";
import { plugin } from "../..";

events.packetSend(MinecraftPacketIds.Text).on((packet: TextPacket, ni: NetworkIdentifier) => {
    if (packet.name !== "") {
        let name = packet.name;
        packet.name = "";
        let message = `${name} ${TextFormat.RESET}${plugin.config.messageSeparator}${TextFormat.RESET} ${packet.message}`;
        packet.message = message;
    }
})