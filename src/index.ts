
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { TextPacket } from "bdsx/bds/packets";
import { events } from "bdsx/event";
import { langs, Plugin } from "./utils/plugin";
import { TextFormat } from "bdsx/util";
import { CANCEL } from "bdsx/common";
import { PlayerJoinEvent, PlayerLeftEvent } from "bdsx/event_impl/entityevent";
import { ServerPlayer } from "bdsx/bds/player";
import { bedrockServer } from "bdsx/launcher";
import { Color } from "colors";
import { getTime } from "./utils/helpers";

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

//cancel vanilla message
events.packetSend(MinecraftPacketIds.Text).on((packet: TextPacket, netId: NetworkIdentifier) => {
    if (packet.type !== TextPacket.Types.Translate) return;

    if (/join|left|bed/.exec(packet.message)) return CANCEL;
});

//chat format
events.packetSend(MinecraftPacketIds.Text).on((packet: TextPacket, ni: NetworkIdentifier) => {
    if (packet.name !== "") {
        let name = packet.name;
        packet.name = "";
        let message = `${TextFormat.DARK_RED}[${TextFormat.YELLOW + TextFormat.BOLD}RANK${TextFormat.RESET + TextFormat.DARK_RED}] ${TextFormat.GOLD}${name} ${TextFormat.DARK_RED}> ${TextFormat.WHITE}${packet.message}`;
        packet.message = message;
    }
})

//join message
events.playerJoin.on((ev: PlayerJoinEvent) => {
    const player: ServerPlayer = ev.player;
    const player_name: string = player.getName();
    const pos = player.getPosition();

    const players = bedrockServer.level.getPlayers();
    players.forEach((v: ServerPlayer) => {
        v.sendMessage(`${TextFormat.GRAY}[${TextFormat.GREEN}+${TextFormat.GRAY}] ${TextFormat.GOLD}${player_name}`);
    });

    console.log(`[${getTime()}]`.gray, 'Player connected:'.green, player.getName().yellow, 'Coords:'.green, `${Math.floor(pos.x)} ${Math.floor(pos.y)} ${Math.floor(pos.z)}`.yellow);
    player.playSound('random.pop');
})

//left message
events.playerLeft.on((ev: PlayerLeftEvent) => {
    const player: ServerPlayer = ev.player;
    const player_name: string = player.getName();
    const pos = player.getPosition();

    const players = bedrockServer.level.getPlayers();
    players.forEach((v: ServerPlayer) => {
        v.sendMessage(`${TextFormat.GRAY}[${TextFormat.RED}-${TextFormat.GRAY}] ${TextFormat.GOLD}${player_name}`);
    });

    console.log(`[${getTime()}]`.gray, 'Player'.green, ' disconected:'.red, player.getName().yellow, 'Coords:'.green, `${Math.floor(pos.x)} ${Math.floor(pos.y)} ${Math.floor(pos.z)}`.yellow);
})

// Clean console:
events.serverLog.on((log: string, color: Color) => {
    log = log.replace('NO LOG FILE! - ', '').replace(/\[([^]+)\]/, `[${getTime()}]`.grey);
    if (/[a-z]/.exec(log[0])) log = log[0].toUpperCase() + log.slice(1);

    if (!/Player (connected|disconnected)|Running AutoCompaction/.exec(log))
        console.log(color(log));

    return CANCEL;
});