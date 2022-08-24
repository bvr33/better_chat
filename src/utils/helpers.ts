import { TextPacket } from "bdsx/bds/packets";
import { ServerPlayer } from "bdsx/bds/player";
import { bedrockServer } from "bdsx/launcher";
import { TextFormat } from "bdsx/util";
import { message } from "blessed";
import { plugin } from "..";


/**
 * Get the local time in hour:minute:second format
 * @returns Local time in string
 */
export function getTime(): string {
    const date: Date = new Date();
    return fill( date.getHours() ) + ':' + fill( date.getMinutes() ) + ':' + fill( date.getSeconds() );
}

function fill( number: number ) {
    return "0".repeat( 2 - number.toString().length ) + number.toString();
}


/**
 * Send a message to all players
 * @param message Message content
 * @param author Sender (Optional)
 * @returns The amount of players that recieved the message
 */
export function sendMessageToAll( message: string, author?: string ): number {
    const players = bedrockServer.level.getPlayers();
    players.forEach( ( v: ServerPlayer ) => {
        if( author ) return v.sendChat( message, author );
        v.sendMessage( message );
    } );
    return players.length;
}

/**
 * Send an actionbar for all players
 * @param message Actionbar content
 * @returns The amount of players that recieved the actionbar
 */
export function sendActionbar( message: string ): number {
    const players = bedrockServer.level.getPlayers();
    players.forEach( ( v: ServerPlayer ) => {
        v.sendTip( message );
    } );
    return players.length;
}

/**
 * @returns The amount of sleeping players
 */
export function sleepCount(): number {
    return bedrockServer.level.getPlayers().filter( ( value: ServerPlayer ) => value.isSleeping() ).length;
}

export function getMentions( text: string ): string[] {
    const regex: RegExp = /@"([^"]*)|@([^]*)/g;
    const result: string[] = [];
    let group: RegExpExecArray | null;

    while( ( group = regex.exec( text ) ) !== null )
    {
        result.push( group[1] || group[2] );
    }
    return result;
}

export const createMessage = ( name: string, message: string ): string => {
    return `${name} ${TextFormat.RESET}${plugin.config.betterChat.messageSeparator}${TextFormat.RESET} ${message}`;
}