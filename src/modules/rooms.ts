import { ServerPlayer } from "bdsx/bds/player";
import { bedrockServer } from "bdsx/launcher";
import { generate } from "generate-password";
import { plugin } from "..";


export interface Room {
    access: 'private' | 'public';
    code?: string;
    owner: RoomMember;
    members: RoomMember[];
}

export interface RoomMember {
    username: string;
    xuid: string;
}

export const rooms: Room[] = []

export function findRoomByXuid( xuid: string ): { room: Room; index: number } | null {
    const room: Room | undefined = rooms.find( ( value: Room ) => value.owner.xuid == xuid || value.members.find( ( value: RoomMember ) => value.xuid == xuid ) );
    if( !room ) return null;
    const index: number = rooms.findIndex( ( value: Room ) => value.owner.xuid == xuid || value.members.find( ( value: RoomMember ) => value.xuid == xuid ) );
    return {
        room: room,
        index: index
    }
}

/**
 * @param code Room's access code
 * @returns Room and index
 */
function findRoomByCode( code: string ): { room: Room; index: number } | null {
    const room: Room | undefined = rooms.find( ( value: Room ) => value.code?.toLowerCase() == code.toLowerCase() );
    if( !room ) return null;
    const index: number = rooms.findIndex( ( value: Room ) => value.code == code );
    return {
        room: room,
        index: index
    }
}

export function createRoom( xuid: string, access: 'private' | 'public' = 'public', callback: ( room: Room | null, code?: string ) => void ) {
    if( findRoomByXuid( xuid ) != null ) return callback( null );
    const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( xuid )!;
    let code: string | undefined;
    if( access == 'public' )
    {
        rooms.push( {
            access: 'public',
            owner: {
                username: player.getName(),
                xuid: xuid
            },
            members: []
        } );
    }
    else
    {
        code = generate( {
            length: 6,
            lowercase: false,
            uppercase: true,
            numbers: true,
            symbols: false
        } );
        rooms.push( {
            access: 'private',
            code: code,
            owner: {
                username: player.getName(),
                xuid: xuid
            },
            members: []
        } );
    }
    callback( findRoomByXuid( xuid )?.room!, code );
}

export function joinRoom( options: { xuid: string; ownerXuid?: string; code?: string }, callback: ( room: Room | undefined, owner: ServerPlayer | null, err: boolean ) => void ) {
    const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( options.xuid )!;
    const room = findRoomByXuid( options.ownerXuid! ) || findRoomByCode( options.code! );
    if( room == null ) return callback( undefined, null, false );
    const owner: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( room?.room.owner.xuid! );
    if( room?.room.owner.xuid == options.xuid || room?.room.members.find( ( value: RoomMember ) => value.xuid == options.xuid ) )
        return callback( room.room, owner, true );

    if( findRoomByXuid( options.xuid ) != null ) leaveRoom( options.xuid, () => { } );
    rooms[room?.index!].members.push( {
        username: player.getName(),
        xuid: options.xuid
    } );
    callback( room?.room, owner, false );
}

export function leaveRoom( xuid: string, callback: ( room: Room | null ) => void ) {
    const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( xuid );
    const room = findRoomByXuid( xuid );
    if( room == null ) return callback( null );

    if( room?.room.owner.xuid == xuid )
    {
        if( room.room.members.length == 0 ) return dissolveRoom( xuid );
        const member: RoomMember = room.room.members[0];
        rooms[room.index].owner = member;
        rooms[room.index].members.splice( 0, 1 );
        return ( <ServerPlayer> bedrockServer.level.getPlayerByXuid( member.xuid ) ).sendMessage( '§eYou are the new owner of this room' );
    }
    room?.room.members.forEach( ( value: RoomMember, index: number ) => {
        const member: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( value.xuid );
        member.sendMessage( `${plugin.config.rooms.messagePrefix}${plugin.config.rooms.playerLeaveRoom}${player.getName()}` );
        if( value.xuid != xuid ) return;
        rooms[room.index].members.splice( index, 1 );
    } );
    callback( room?.room );
}

export function dissolveRoom( xuid: string ) {
    const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( xuid );
    const room = findRoomByXuid( xuid );
    if( room == null ) return player?.sendMessage( '§cYou\'re not in a room' );
    if( room.room.owner.xuid != xuid ) return player?.sendMessage( '§cYou need to be the owner to dissolve the room' );
    rooms.splice( room?.index!, 1 );
    player?.sendMessage( '§eRoom dissolved' );
}
