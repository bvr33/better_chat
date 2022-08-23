import { ServerPlayer } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { PlayerJoinEvent, PlayerLeftEvent } from "bdsx/event_impl/entityevent";
import { bedrockServer } from "bdsx/launcher";
import { TextFormat } from "bdsx/util";
import { plugin } from "..";
import { getTime } from "../utils/helpers";


//Join Message
events.playerJoin.on((ev: PlayerJoinEvent) => {
    const player: ServerPlayer = ev.player;
    const player_name: string = player.getName();
    const pos = player.getPosition();

    const players = bedrockServer.level.getPlayers();
    players.forEach((v: ServerPlayer) => {
        v.sendMessage(`${plugin.config.eventsMessage.join} ${TextFormat.GOLD}${player_name}`);
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
        v.sendMessage(`${plugin.config.eventsMessage.left} ${TextFormat.GOLD}${player_name}`);
    });

    console.log(`[${getTime()}]`.gray, 'Player'.green, ' disconected:'.red, player.getName().yellow, 'Coords:'.green, `${Math.floor(pos.x)} ${Math.floor(pos.y)} ${Math.floor(pos.z)}`.yellow);
})