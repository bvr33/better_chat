import { Certificate, ConnectionRequest } from "bdsx/bds/connreq";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { LoginPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { PlayerJoinEvent, PlayerLeftEvent } from "bdsx/event_impl/entityevent";
import { bedrockServer } from "bdsx/launcher";
import { TextFormat } from "bdsx/util";
import { plugin } from "../..";
import { getTime } from "../../utils/helpers";
import { antiSpam } from "../antiSpam";


events.playerJoin.on( ( ev: PlayerJoinEvent ) => {
    const player: ServerPlayer = ev.player;
    const player_name: string = player.getName();
    const address: string = player.getNetworkIdentifier().getAddress().split( '|' )[0];
    const pos = player.getPosition();

    antiSpam.registerPlayer( player )
    
    const players = bedrockServer.level.getPlayers();
    players.forEach( ( v: ServerPlayer ) => {
        v.sendMessage( `${plugin.config.main.eventsMessage.join} ${TextFormat.GOLD}${player_name}` );
    } );

    console.log( `[${getTime()}]`.gray, 'Player connected:'.green, player.getName().yellow, 'Coords:'.green, `${Math.floor( pos.x )} ${Math.floor( pos.y )} ${Math.floor( pos.z )}`.yellow );
    if( plugin.config.soundOnJoin.enable )
    {
        player.playSound( plugin.config.soundOnJoin.sound, pos, 1, 0, );
    }

} )

//Join Message
events.packetAfter( MinecraftPacketIds.Login ).on( ( packet: LoginPacket, netId: NetworkIdentifier ) => {
    const address: string = netId.getAddress().split( '|' )[0];
    const connreq: ConnectionRequest | null = packet.connreq;
    if( connreq == null ) return;

    const cert: Certificate = connreq.getCertificate();
    const xuid: string = cert.getXuid();
    const name = cert.getId();

    // Console connecting message:
    console.log(
        `[${getTime()}]`.grey,
        'Player connecting:'.green, name.yellow,
        'Ip:'.green, address.yellow,
        'Xuid:'.green, xuid.yellow
    );
} );



//left message
events.playerLeft.on( ( ev: PlayerLeftEvent ) => {
    const player: ServerPlayer = ev.player;
    const player_name: string = player.getName();
    const pos = player.getPosition();

    const players = bedrockServer.level.getPlayers();
    players.forEach( ( v: ServerPlayer ) => {
        v.sendMessage( `${plugin.config.main.eventsMessage.left} ${TextFormat.GOLD}${player_name}` );
    } );

    console.log( `[${getTime()}]`.gray, 'Player'.green, ' disconected:'.red, player.getName().yellow, 'Coords:'.green, `${Math.floor( pos.x )} ${Math.floor( pos.y )} ${Math.floor( pos.z )}`.yellow );
} )


