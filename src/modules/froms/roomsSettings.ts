import { CustomForm, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from "../..";

export const roomsSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'Rooms Settings' )
    /*  >> 0  */    f.addComponent( new FormToggle( 'Enabled', plugin.config.rooms.enabled ) )
    /*  >> 1  */    f.addComponent( ( new FormInput( "Message prefix", 'prefix', plugin.config.rooms.messagePrefix ) ) )
    /*  >> 2  */    f.addComponent( ( new FormInput( "Join message", 'message', plugin.config.rooms.playerJoinRoom ) ) )
    /*  >> 3  */    f.addComponent( ( new FormInput( "left message", 'message', plugin.config.rooms.playerLeaveRoom ) ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {
            plugin.config.rooms.enabled = response[0]
            plugin.config.rooms.messagePrefix = response[1]
            plugin.config.rooms.playerJoinRoom = response[2]
            plugin.config.rooms.playerLeaveRoom = response[3]
            plugin.updateConfig()
        }
    )
}