
import './modules/eventsCapture'
import { events } from "bdsx/event";
import { TextFormat } from "bdsx/util";
import { command } from 'bdsx/command'
import { CommandPermissionLevel } from "bdsx/bds/command";
import { mainmenu } from "./modules/froms/mainmenu";
import { Plugin } from './utils/plugin';
import { ServerPlayer } from 'bdsx/bds/player';
import { roomsHandler, Room, RoomMember } from './modules/rooms';
import { bedrockServer } from 'bdsx/launcher';
import { serverProperties } from 'bdsx/serverproperties';
import { CxxString } from 'bdsx/nativetype';
import { Form, FormButton, SimpleForm } from 'bdsx/bds/form';
import { NetworkIdentifier } from 'bdsx/bds/networkidentifier';


export enum langs {
    PL = "PL_pl"
}

export interface Language {
    name: string
    messages: {}
    menuEntries: {}
    settings: {},
    texts: {}
}
export interface Configuration {
    language: langs,
    antiSpam: {
        enabled: boolean,
        mute: boolean,
        seconds: number,
        limit: number
    },
    rooms: {
        enabled: boolean,
        messagePrefix: string,
        playerJoinRoom: string,
        playerLeaveRoom: string,
    },
    betterChat: {
        enabled: boolean,
        logToConsole: boolean,
        cooldown: number,
        messageSeparator: string,
        maxMessageLength: number,
    },
    messageHistory: {
        enabled: boolean,
        limit: number,
    },
    soundOnMention: {
        enabled: boolean,
        sound: string,
    },
    soundOnJoin: {
        enabled: true,
        sound: string,
    },
    eventsMessage: {
        join: string,
        left: string,
        sleep: {
            chat: string
            actionbar: string,
        }
    },
    motd: {
        values: string[],
        interval: number,
        useDefault: boolean,
    }
}

export const plugin = new Plugin(
    {
        language: langs.PL,
        antiSpam: {
            enabled: true,
            mute: true,
            seconds: 15,
            limit: 3
        },
        rooms: {
            enabled: true,
            messagePrefix: '[Room]',
            playerJoinRoom: 'player join',
            playerLeaveRoom: 'player left',
        },
        betterChat: {
            enabled: true,
            logToConsole: false,
            cooldown: 5,
            messageSeparator: `${TextFormat.DARK_AQUA}> `,
            maxMessageLength: 30,
        },
        messageHistory: {
            enabled: true,
            limit: 10,
        },
        soundOnMention: {
            enabled: true,
            sound: 'random.orb',
        },
        soundOnJoin: {
            enabled: true,
            sound: 'random.orb',
        },
        eventsMessage: {
            join: `${TextFormat.GRAY} [${TextFormat.GREEN} + ${TextFormat.GRAY}]`,
            left: `${TextFormat.GRAY} [${TextFormat.RED} - ${TextFormat.GRAY}]`,
            sleep: {
                chat: 'Player',
                actionbar: 'players',
            }
        },
        motd: {
            values: [
                `${TextFormat.OBFUSCATED + 'xxx'}${TextFormat.RESET + TextFormat.RED}BQ${TextFormat.OBFUSCATED + 'xxx' + TextFormat.RESET} `
            ],
            interval: 2,
            useDefault: false,
        }
    },
    {
        name: 'Better chat',
        messages: {},
        settings: {},
        menuEntries: {},
        texts: {}

    }
)

events.serverOpen.on(
    () => {
        plugin.log( `launching` );
    }
);

events.serverClose.on(
    () => {
        plugin.log( `closed` );
    }
);

events.serverOpen.on(
    async () => {

        const cmdAdm = command.register( 'bchat',
            'better chat settings form',
            CommandPermissionLevel.Operator
        )

        cmdAdm.overload(
            async ( _param, origin, _output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const commandUser = <ServerPlayer> origin.getEntity();

                mainmenu( commandUser )
            },
            {}
        );


        const cmd = command.register( 'chat',
            'better chat settings form',
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
                room: command.enum( 'action', 'room' ),
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
                room: command.enum( 'action', 'room' ),
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
                room: command.enum( 'action', 'room' ),
                join: command.enum( 'join', 'join' ),
                code: [CxxString, true]
            }
        );



        cmd.overload(
            async ( param, origin, output ) => {
                if( origin.isServerCommandOrigin() ) return console.log( 'This command can only be executed by players'.red );
                const player: ServerPlayer = <ServerPlayer> origin.getEntity();
                const xuid: string = player.getXuid();

                roomsHandler.leave( xuid, ( room: Room | null ) => {
                    if( room == null ) return player.sendMessage( '§cYou\'re not in a room' );
                    player.sendMessage( '§eYou\'re not in this room anymore' );
                } );
            },
            {
                room: command.enum( 'action', 'room' ),
                leave: command.enum( 'leave', 'leave' )
            }
        );

        let i: number = 0;
        const interval = setInterval(
            () => {
                if( bedrockServer.isClosed() ) return clearInterval( interval );

                if( plugin.config.motd.useDefault ) return bedrockServer.serverInstance.setMotd( serverProperties["server-name"]! );
                if( plugin.config.motd.interval == 0 ) i = 0;
                bedrockServer.serverInstance.setMotd( plugin.config.motd.values[i] );

                if( i == ( plugin.config.motd.values.length - 1 ) ) return i = 0;
                i++;
            },
            1000 * plugin.config.motd.interval
        );
    }
);