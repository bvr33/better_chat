import { NetworkIdentifier } from "bdsx/bds/networkidentifier"
import { MinecraftPacketIds } from "bdsx/bds/packetids"
import { TextPacket } from "bdsx/bds/packets"
import { ServerPlayer } from "bdsx/bds/player"
import { CANCEL } from "bdsx/common"
import { events } from "bdsx/event"
import { bedrockServer } from "bdsx/launcher"
import { TextFormat } from "bdsx/util"
import { plugin } from "../.."
import { createMessage, getMentions, sendMessageToAll } from "../../utils/helpers"
import { findRoomByXuid, Room, RoomMember } from "../rooms"
//chat
export const history: { author: string; content: string }[] = []
//chat
export const cooldown = new Map<string, NodeJS.Timeout>()
//antispam
export const mute = new Map<string, NodeJS.Timeout>()
// antiSpam
export const spam = new Map<string, string[]>()
// not used
export const addresses = new Map<string, string>()


events.packetSend( MinecraftPacketIds.Text ).on(
    ( packet: TextPacket, ni: NetworkIdentifier ) => {

        // chat format
        if( packet.name !== "" ) {
            const name = packet.name
            packet.name = ""
            const message = createMessage( name, packet.message )
            packet.message = message
        }

    }
)


events.packetBefore( MinecraftPacketIds.Text ).on(
    ( packet: TextPacket, ni: NetworkIdentifier ) => {
        const player: ServerPlayer = <ServerPlayer> ni.getActor()
        const xuid: string = player.getXuid()
        const room: Room | undefined = findRoomByXuid( xuid )?.room

        // AntiSpam stuff:
        if( mute.has( xuid ) ) {
            // @ts-ignore
            const left: number = Math.ceil( ( mute.get( xuid )?._idleStart + mute.get( xuid )?._idleTimeout ) / 1000 - process.uptime() )
            player.sendMessage( `${TextFormat.RED}You are muted. Wait ${TextFormat.GOLD}${left} §cmore seconds to speak again` )
            return CANCEL
        };


        // Public room and normal chat:
        if( room?.access != 'private' ) {

            //chat Cooldown:
            if( cooldown.has( xuid ) ) {
                // @ts-ignore
                const left: number = Math.ceil( ( cooldown.get( xuid )?._idleStart + cooldown.get( xuid )?._idleTimeout ) / 1000 - process.uptime() )
                player.sendMessage( `${TextFormat.RED}You are sending chats too faster!. Wait ${TextFormat.GOLD}${left} ${TextFormat.RED}more seconds to speak again` )
                return CANCEL
            };


            // chat message Max-Length:
            if( plugin.config.betterChat.maxMessageLength !== 0 && packet.message.length > plugin.config.betterChat.maxMessageLength
            ) {
                player.sendMessage( `${TextFormat.RED}Your message is too long (${TextFormat.GOLD}${plugin.config.betterChat.maxMessageLength} ${TextFormat.RED}Character limit)` )
                return CANCEL
            };

            // Anti-Spam:
            if( plugin.config.antiSpam.enabled && plugin.config.antiSpam.limit > 0 ) {
                let messages: string[] = spam.get( xuid )!
                messages.push( packet.message )

                if( messages.length >= plugin.config.antiSpam.limit ) {

                    if( messages.every( ( value: string ) => value == packet.message ) && messages.length >= plugin.config.antiSpam.limit ) {
                        if( !plugin.config.antiSpam.mute ) player.sendMessage( `${TextFormat.RED}You can't send the same message ${TextFormat.GOLD}${plugin.config.antiSpam.limit} ${TextFormat.RED}times` )
                        else {
                            player.sendMessage( `${TextFormat.RED}You has been muted for spamming. You will be able to talk in ${TextFormat.GOLD}${plugin.config.antiSpam.seconds} ${TextFormat.RED}seconds` )
                            mute.set( xuid, setTimeout( () => mute.delete( xuid ), 1000 * plugin.config.antiSpam.seconds ) )
                            sendMessageToAll( `${TextFormat.GOLD}${player.getName()} ${TextFormat.YELLOW}has been muted for spamming` )
                            messages = []
                        }
                        messages.shift()
                        spam.set( xuid, messages )
                        return CANCEL
                    }
                    messages.shift()
                }
                spam.set( xuid, messages )
            };


            // Cooldown between messages:
            if( plugin.config.betterChat.cooldown != 0 && room?.access == 'public' ) cooldown.set( xuid, setTimeout( () => cooldown.delete( xuid ), 1000 * plugin.config.betterChat.cooldown ) )
        }


        // Sound on @mention:
        if( plugin.config.soundOnMention.enabled ) {
            bedrockServer.level.getPlayers().forEach( ( value: ServerPlayer ) => {
                if( getMentions( packet.message ).includes( value.getName() ) && ( room == findRoomByXuid( value.getXuid() )?.room || !room ) )
                    value.playSound( plugin.config.soundOnMention.sound.name, undefined, undefined, plugin.config.soundOnMention.sound.pitch )
            } )
        };


        // Message history:
        if( plugin.config.messageHistory.enabled && plugin.config.messageHistory.limit <= 0 && !room ) {
            if( history.length >= plugin.config.messageHistory.limit ) history.shift()
            history.push( {
                author: player.getName(),
                content: packet.message
            } )
        };


        // Room message:
        if( room ) {
            const chat: string = `${plugin.config.rooms.messagePrefix}${createMessage( packet.name, packet.message )}`
            const owner: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( room.owner.xuid )
            owner.sendMessage( chat )
            room.members.forEach(
                ( value: RoomMember ) => {
                    const member: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( value.xuid )
                    member.sendMessage( chat )
                }
            )
            return CANCEL
        }

        // Log chats in console:
        if( plugin.config.betterChat.logToConsole ) console.log( '[CHAT]'.grey, `${player.getName()}`.green, '>'.gray, packet.message.replace( /§[0-z]/g, '' ).yellow )

    }
)
