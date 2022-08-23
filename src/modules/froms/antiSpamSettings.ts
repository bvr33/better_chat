import { CustomForm, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from "../..";
import { Configs } from "../../utils/configuration";

export const antiSpamSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'AntiSpam Settings' )
    f.addComponent( new FormToggle( 'enable', plugin.config.antiSpam.enable ) )

    f.sendTo( commandUser.getNetworkIdentifier(), ( { response } ) => {
        plugin.config.antiSpam.enable = response[0]

        plugin.updateConfig( Configs.antiSpam )
    } )
}