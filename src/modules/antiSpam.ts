import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { Packet } from "bdsx/bds/packet";
import { TextPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { CANCEL } from "bdsx/common";
import { bedrockServer } from "bdsx/launcher";
import { TextFormat } from "bdsx/util";
import { plugin } from "..";
import { getMentions, sendMessageToAll } from "../utils/helpers";
import { roomsHandler, Room } from "./rooms";

class AntiSpam {
    private history: { author: string; content: string }[] = [];
    private addresses = new Map<string, string>();
    private spamList = new Map<string, string[]>();
    private muteList = new Map<string, NodeJS.Timeout>()
    private cooldown = new Map<string, NodeJS.Timeout>()

    public registerPlayer( player: ServerPlayer ) {
        const address: string = player.getNetworkIdentifier().getAddress().split( '|' )[0];
        const xuid: string = player.getXuid();
        // Save address:
        this.addresses.set( xuid, address );

        // Anti-Spam stuff:
        this.spamList.set( player.getXuid(), [] );
    }

    public check( packet: TextPacket, netId: NetworkIdentifier ) {
        const player: ServerPlayer = <ServerPlayer> netId.getActor();
        const xuid: string = player.getXuid();
        const room: Room | undefined = roomsHandler.findByXuid( xuid )?.room;

        // AntiSpam stuff:
        if( this.muteList.has( xuid ) )
        {
            // @ts-ignore
            const left: number = Math.ceil( ( this.mute.get( xuid )?._idleStart + this.mute.get( xuid )?._idleTimeout ) / 1000 - process.uptime() );
            player.sendMessage( `§cYou are muted. Wait §6${left} §cmore seconds to speak again` );
            return CANCEL;
        }
        // Cooldown:
        if( this.cooldown.has( xuid ) && room?.access != 'private' )
        {
            // @ts-ignore
            const left: number = Math.ceil( ( this.cooldown.get( xuid )?._idleStart + this.cooldown.get( xuid )?._idleTimeout ) / 1000 - process.uptime() );
            player.sendMessage( `§cYou are sending chats too faster!. Wait §6${left} §cmore seconds to speak again` );
            return CANCEL;
        };
        // Max-Length:
        if( plugin.config.betterChat.maxMessageLength !== 0 && packet.message.length > plugin.config.betterChat.maxMessageLength && room?.access != 'private' )
        {
            player.sendMessage( `§cYour message is too long (§6${plugin.config.betterChat.maxMessageLength} §ccaracter limit)` );
            return CANCEL;
        };

        // Anti-Spam:
        if( plugin.config.antiSpam.enabled && plugin.config.antiSpam.limit > 0 && room?.access != 'private' )
        {
            let messages: string[] = this.spamList.get( xuid )!;
            messages.push( packet.message );

            if( messages.length >= plugin.config.antiSpam.limit )
            {

                if( messages.every( ( value: string ) => value == packet.message ) && messages.length >= plugin.config.antiSpam.limit )
                {
                    if( !plugin.config.antiSpam.mute ) player.sendMessage( `§cYou can't send the same message §6${plugin.config.antiSpam.limit} §ctimes` );
                    else
                    {
                        player.sendMessage( `§cYou has been muted for spamming. You will be able to talk in §6${plugin.config.antiSpam.seconds} §cseconds` );
                        this.muteList.set( xuid, setTimeout( () => this.muteList.delete( xuid ), 1000 * plugin.config.antiSpam.seconds ) );
                        sendMessageToAll( `${TextFormat.GOLD}${player.getName()} ${TextFormat.AQUA}has been muted for spamming` );
                        messages = [];
                    }
                    messages.shift();
                    this.spamList.set( xuid, messages );
                    return CANCEL;
                }
                messages.shift();
            }
            this.spamList.set( xuid, messages );
        };

        // Sound on @mention:
        if( plugin.config.soundOnMention.enabled )
        {
            bedrockServer.level.getPlayers().forEach( ( value: ServerPlayer ) => {
                if( getMentions( packet.message ).includes( value.getName() ) && ( room == roomsHandler.findByXuid( value.getXuid() )?.room || !room ) )
                    value.playSound( plugin.config.soundOnMention.sound );
            } );
        };

        // Message history:
        if( plugin.config.messageHistory.enabled && plugin.config.messageHistory.limit <= 0 && !room )
        {
            if( this.history.length >= plugin.config.messageHistory.limit ) this.history.shift();
            this.history.push( {
                author: player.getName(),
                content: packet.message
            } );
        };

    }
}
export const antiSpam = new AntiSpam()