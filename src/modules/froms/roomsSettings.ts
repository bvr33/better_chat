import { CustomForm, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from "../..";

export const roomsSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'Rooms Settings' )
    f.addComponent( new FormToggle( 'enable', plugin.config.rooms.enable ) )

    f.sendTo( commandUser.getNetworkIdentifier(), ( { response } ) => {
        plugin.config.rooms.enable = response[ 0 ]

        plugin.updateConfig()
    } )
}