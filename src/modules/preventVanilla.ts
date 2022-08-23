import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { TextPacket } from "bdsx/bds/packets";
import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { getTime } from "../utils/helpers";
import { Color } from 'colors';

// Clean console:
events.serverLog.on((log: string, color: Color) => {
    log = log.replace('NO LOG FILE! - ', '').replace(/\[([^]+)\]/, `[${getTime()}]`.grey);
    if (/[a-z]/.exec(log[0])) log = log[0].toUpperCase() + log.slice(1);

    if (!/Player (connected|disconnected)|Running AutoCompaction/.exec(log))
        console.log(color(log));

    return CANCEL;
});

//Cancel vanilla message
events.packetSend(MinecraftPacketIds.Text).on((packet: TextPacket, netId: NetworkIdentifier) => {
    if (packet.type !== TextPacket.Types.Translate) return;

    if (/join|left|bed/.exec(packet.message)) return CANCEL;
});