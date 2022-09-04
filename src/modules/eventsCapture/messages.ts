import { Certificate, ConnectionRequest } from "bdsx/bds/connreq"
import { NetworkIdentifier } from "bdsx/bds/networkidentifier"
import { MinecraftPacketIds } from "bdsx/bds/packetids"
import { LoginPacket } from "bdsx/bds/packets"
import { Player, ServerPlayer } from "bdsx/bds/player"
import { events } from "bdsx/event"
import { PlayerJoinEvent, PlayerLeftEvent, PlayerSleepInBedEvent } from "bdsx/event_impl/entityevent"
import { bedrockServer } from "bdsx/launcher"
import { TextFormat } from "bdsx/util"
import { plugin } from "../.."
import { getTime, sendActionbar, sendMessageToAll, sleepCount } from "../../utils/helpers"
import { addresses, spam } from "./chat"


//Join Message
events.playerJoin.on(
    async ( ev: PlayerJoinEvent ) => {
        const player: ServerPlayer = ev.player
        const player_name: string = player.getName()
        const address: string = player.getNetworkIdentifier().getAddress().split( '|' )[0]
        const xuid: string = player.getXuid()
        const pos = player.getPosition()

        // Save address:
        addresses.set( xuid, address )

        // Anti-Spam stuff:
        spam.set( xuid, [] )

        if( !plugin.config.betterChat.enabled ) return

        const players = bedrockServer.level.getPlayers()
        players.forEach(
            ( v: ServerPlayer ) => {
                v.sendMessage( `${plugin.config.eventsMessage.join} ${TextFormat.GOLD}${player_name}` )
            }
        )

        console.log( `[${getTime()}]`.gray, 'Player connected:'.green, player.getName().yellow, 'Coords:'.green, `${Math.floor( pos.x )} ${Math.floor( pos.y )} ${Math.floor( pos.z )}`.yellow )
        if( plugin.config.soundOnJoin.enabled ) {
            player.playSound( plugin.config.soundOnJoin.sound.name, undefined, undefined, plugin.config.soundOnJoin.sound.pitch )
        }
    }
)

//Login Message
events.packetAfter( MinecraftPacketIds.Login ).on( ( packet: LoginPacket, netId: NetworkIdentifier ) => {
    const address: string = netId.getAddress().split( '|' )[0]
    const connreq: ConnectionRequest | null = packet.connreq
    if( connreq == null ) return

    const cert: Certificate = connreq.getCertificate()
    const xuid: string = cert.getXuid()
    const name = cert.getId()

    // Console connecting message:
    console.log(
        `[${getTime()}]`.grey,
        'Player connecting:'.green, name.yellow,
        'Ip:'.green, address.yellow,
        'Xuid:'.green, xuid.yellow
    )
} )

//left message
events.playerLeft.on(
    ( ev: PlayerLeftEvent ) => {
        const player: ServerPlayer = ev.player
        const player_name: string = player.getName()
        const pos = player.getPosition()
        const xuid: string = player.getXuid()

        // Save address:
        addresses.delete( xuid )

        // Anti-Spam stuff:
        spam.delete( xuid )

        if( !plugin.config.betterChat.enabled ) return

        const players = bedrockServer.level.getPlayers()
        players.forEach(
            ( v: ServerPlayer ) => {
                v.sendMessage( `${plugin.config.eventsMessage.left} ${TextFormat.GOLD}${player_name}` )
            }
        )

        console.log( `[${getTime()}]`.gray,
            'Player'.green, ' disconected:'.red, player.getName().yellow,
            'Coords:'.green, `${Math.floor( pos.x )} ${Math.floor( pos.y )} ${Math.floor( pos.z )}`.yellow
        )
    }
)

// Sleep message:
events.playerSleepInBed.on(
    async ( event: PlayerSleepInBedEvent ) => {
        if( !plugin.config.betterChat.enabled ) return

        const player: Player = event.player

        setTimeout(
            () => {
                if( !player.isSleeping() ) return
                sendMessageToAll( `${player.getName()} ${plugin.config.eventsMessage.sleep.chat}` )

                // Sleep actionbar message:
                const interval: NodeJS.Timeout = setInterval(
                    () => {
                        if( sleepCount() == 0 ) return clearInterval( interval )
                        if( plugin.config.eventsMessage.sleep.actionbar.trim().length != 0 )
                            sendActionbar( `${sleepCount()} ${plugin.config.eventsMessage.sleep.actionbar}` )
                    },
                    500
                )
            },
            100
        )
    }
)
