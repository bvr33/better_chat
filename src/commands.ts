
import { events } from "bdsx/event";
import { command } from 'bdsx/command'
import { CommandPermissionLevel } from "bdsx/bds/command";
import { mainmenu } from "./modules/froms/mainmenu";
import { ServerPlayer } from 'bdsx/bds/player';
import { roomsHandler, Room, RoomMember } from './modules/rooms';
import { bedrockServer } from 'bdsx/launcher';
import { CxxString } from 'bdsx/nativetype';
import { FormButton, SimpleForm } from 'bdsx/bds/form';
import { NetworkIdentifier } from 'bdsx/bds/networkidentifier';
import { roomsSettings } from './modules/froms/roomsSettings';
import { chatSettings } from './modules/froms/chatSettings';
import { antiSpamSettings } from './modules/froms/antiSpamSettings';
import { motdSettings } from './modules/froms/motdSettings';
import { plugin } from ".";

events.serverOpen.on(
    async () => {

        const adminCmd = command.register( 'bchat',
            'better chat settings form',
            CommandPermissionLevel.Operator
        )

        adminCmd.overload(
            async ( param, origin, _output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const commandUser = <ServerPlayer> origin.getEntity();

                switch( param.option )
                {
                    case undefined:
                        mainmenu( commandUser )
                        break;
                    case 'chat':
                        chatSettings( commandUser )
                        break;
                    case 'antispam':
                        antiSpamSettings( commandUser )
                        break;
                    case 'motd':
                        motdSettings( commandUser )
                        break;
                    case 'rooms':
                        roomsSettings( commandUser )
                        break;
                }
            },
            {
                option: [command.enum( 'settings', 'chat', 'antispam', 'motd', 'rooms' ), true],
            }
        );


        const cmd = command.register( 'room',
            'chat rooms',
            CommandPermissionLevel.Normal
        )

        // bchat room create
        cmd.overload(
            async ( param, origin, _output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const player: ServerPlayer = <ServerPlayer> origin.getEntity();
                const xuid: string = player.getXuid();
                roomsHandler.create( xuid, param.access,
                    ( room: Room, code: string ) => {
                        if( room == null ) return player.sendMessage( '§cYou already are in a room' );
                        player.sendMessage( '§aThe room has been created' );
                        if( code ) player.sendMessage( 'Access code: ' + code );
                    }
                );

            },
            {
                create: command.enum( 'create', 'create' ),
                access: [command.enum( 'AccessType', 'private', 'public' ), true]
            }
        );

        // bchat room dissolve
        cmd.overload(
            async ( _param, origin, _output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const player: ServerPlayer = <ServerPlayer> origin.getEntity();
                const xuid: string = player.getXuid();

                roomsHandler.dissolve( xuid );
            },
            {
                dissolve: command.enum( 'dissolve', 'dissolve' )
            }
        );



        // bchat room join
        cmd.overload(
            async ( param, origin, _output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const player: ServerPlayer = <ServerPlayer> origin.getEntity();
                const netId: NetworkIdentifier = player.getNetworkIdentifier();
                const xuid: string = player.getXuid();
                if( param.code )
                {
                    roomsHandler.join( { xuid: xuid, code: param.code },
                        ( room: Room | null | undefined, owner: ServerPlayer | null, err: boolean ) => {
                            if( !room ) return player.sendMessage( '§cRoom not found' );
                            if( err ) return player.sendMessage( '§cYou already are in that room' );
                            player.sendMessage( '§aYou joined the room' );
                            owner?.sendMessage( `${plugin.config.rooms.messagePrefix} ${player} Join` );
                            room.members.forEach(
                                ( value: RoomMember ) => {
                                    const member: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( value.xuid );
                                    member.sendMessage( `${plugin.config.rooms.messagePrefix} ${player} Join` );
                                }
                            );
                        }
                    );
                    return;
                }
                const form: SimpleForm = new SimpleForm();
                form.setTitle( 'Public Rooms' );
                form.setContent( 'Choose a chat room to join in:' );
                roomsHandler.rooms.forEach(
                    ( value: Room ) => {
                        if( value.access == 'public' ) form.addButton( new FormButton( value.owner.username + '\'s room' ) )
                    }
                );
                if( roomsHandler.rooms.filter( ( value: Room ) => value.access == 'public' ).length == 0 ) form.setContent( 'There are no rooms to join in' );

                form.sendTo( netId,
                    async ( data ) => {
                        if( data.response == null ) return;
                        const room: Room | undefined = roomsHandler.rooms.find( ( value: Room ) => value.owner.username == form.getButton( data.response )?.text.split( '\'' )[0] );

                        roomsHandler.join( { xuid: xuid, ownerXuid: room?.owner.xuid },
                            ( room: Room | null | undefined, owner: ServerPlayer | null, err: boolean ) => {
                                if( !room ) return player.sendMessage( '§cRoom not found' );
                                if( err ) return player.sendMessage( '§cYou already are in that room' );
                                player.sendMessage( '§aYou joined the room' );
                                owner?.sendMessage( `${plugin.config.rooms.messagePrefix} ${player} Join` );
                                room.members.forEach(
                                    ( value: RoomMember ) => {
                                        const member: ServerPlayer = <ServerPlayer> bedrockServer.level.getPlayerByXuid( value.xuid );
                                        member.sendMessage( `${plugin.config.rooms.messagePrefix} ${player} Join` );
                                    }
                                );
                            }
                        );
                    }
                );
            },
            {
                join: command.enum( 'join', 'join' ),
                code: [CxxString, true]
            }
        );



        cmd.overload(
            async ( _param, origin, _output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const player: ServerPlayer = <ServerPlayer> origin.getEntity();
                const xuid: string = player.getXuid();

                roomsHandler.leave( xuid, ( room: Room | null ) => {
                    if( room == null ) return player.sendMessage( '§cYou\'re not in a room' );
                    player.sendMessage( '§eYou\'re not in this room anymore' );
                } );
            },
            {
                leave: command.enum( 'leave', 'leave' )
            }
        );
    }
);