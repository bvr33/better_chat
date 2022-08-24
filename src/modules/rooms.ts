import { ServerPlayer } from "bdsx/bds/player";
import { bedrockServer } from "bdsx/launcher";
import { generate } from "generate-password";


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
class RoomsHandler {
    private rooms: Room[] = []

    findByXuid( xuid: string ): { room: Room; index: number } | null {
        const room: Room | undefined = this.rooms.find( ( value: Room ) => value.owner.xuid == xuid || value.members.find( ( value: RoomMember ) => value.xuid == xuid ) );
        if( !room ) return null;
        const index: number = this.rooms.findIndex( ( value: Room ) => value.owner.xuid == xuid || value.members.find( ( value: RoomMember ) => value.xuid == xuid ) );
        return {
            room: room,
            index: index
        }
    }

    /**
     * @param code Room's access code
     * @returns Room and index
     */
    findByCode( code: string ): { room: Room; index: number } | null {
        const room: Room | undefined = this.rooms.find( ( value: Room ) => value.code?.toLowerCase() == code.toLowerCase() );
        if( !room ) return null;
        const index: number = this.rooms.findIndex( ( value: Room ) => value.code == code );
        return {
            room: room,
            index: index
        }
    }

    createRoom( xuid: string, access: 'private' | 'public' = 'public', callback: ( room: Room | null, code?: string ) => void ) {
        if( this.findByXuid( xuid ) != null ) return callback( null );
        const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( xuid )!;
        let code: string | undefined;
        if( access == 'public' )
        {
            this.rooms.push( {
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
                length: 5,
                lowercase: false,
                uppercase: true,
                numbers: true,
                symbols: false
            } );
            this.rooms.push( {
                access: 'private',
                code: code,
                owner: {
                    username: player.getName(),
                    xuid: xuid
                },
                members: []
            } );
        }
        callback( this.findByXuid( xuid )?.room!, code );
    }

    joinRoom( options: { xuid: string; ownerXuid?: string; code?: string }, callback: ( room: Room | undefined, owner: ServerPlayer | null, err: boolean ) => void ) {
        const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( options.xuid )!;
        const room = this.findByXuid( options.ownerXuid! ) || this.findByCode( options.code! );
        if( room == null ) return callback( undefined, null, false );
        const owner: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( room?.room.owner.xuid! );
        if( room?.room.owner.xuid == options.xuid || room?.room.members.find( ( value: RoomMember ) => value.xuid == options.xuid ) )
            return callback( room.room, owner, true );

        if( this.findByXuid( options.xuid ) != null ) this.leaveRoom( options.xuid, () => { } );
        this.rooms[room?.index!].members.push( {
            username: player.getName(),
            xuid: options.xuid
        } );
        callback( room?.room, owner, false );
    }

    leaveRoom( xuid: string, callback: ( room: Room | null ) => void ) {
        const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( xuid );
        const room = this.findByXuid( xuid );
        if( room == null ) return callback( null );

        if( room?.room.owner.xuid == xuid )
        {
            if( room.room.members.length == 0 ) return this.dissolve( xuid );
            const member: RoomMember = room.room.members[0];
            this.rooms[room.index].owner = member;
            this.rooms[room.index].members.splice( 0, 1 );
            return ( <ServerPlayer> bedrockServer.level.getPlayerByXuid( member.xuid ) ).sendMessage( '§eYou are the new owner of this room' );
        }
        room?.room.members.forEach( ( value: RoomMember, index: number ) => {
            const member: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( value.xuid );
            //member.sendMessage( setPlaceholders( config.playerLeaveRoom, player ) );
            if( value.xuid != xuid ) return;
            this.rooms[room.index].members.splice( index, 1 );
        } );
        callback( room?.room );
    }

    dissolve( xuid: string ) {
        const player: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( xuid );
        const room = this.findByXuid( xuid );
        if( room == null ) return player?.sendMessage( '§cYou\'re not in a room' );
        if( room.room.owner.xuid != xuid ) return player?.sendMessage( '§cYou need to be the owner to dissolve the room' );
        this.rooms.splice( room?.index!, 1 );
        player?.sendMessage( '§eRoom dissolved' );
    }

    getMentions( text: string ): string[] {
        const regex: RegExp = /@"([^"]*)|@([^]*)/g;
        const resultado: string[] = [];
        let grupo: RegExpExecArray | null;

        while( ( grupo = regex.exec( text ) ) !== null )
        {
            resultado.push( grupo[1] || grupo[2] );
        }
        return resultado;
    }

}
export const roomsHandler = new RoomsHandler()