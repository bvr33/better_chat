import { CustomForm, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { TextFormat } from "bdsx/util";
import { plugin } from "../..";

export const antiSpamSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'AntiSpam Settings' )
    /*  >> 0  */    f.addComponent( new FormToggle( 'enabled', plugin.config.antiSpam.enabled ) )
    /*  >> 1  */    f.addComponent( new FormToggle( 'mute', plugin.config.antiSpam.mute ) )
    /*  >> 2  */    f.addComponent( ( new FormSlider( "mute time (seconds)", 1, 60, 1, plugin.config.antiSpam.seconds ) ) )
    /*  >> 3  */    f.addComponent( ( new FormSlider( "message limit", 1, 10, 1, plugin.config.antiSpam.limit ) ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {
            plugin.config.antiSpam.enabled = response[0]
            plugin.config.antiSpam.mute = response[1]
            plugin.config.antiSpam.seconds = response[2]
            plugin.config.antiSpam.limit = response[3]

            plugin.updateConfig()
        }
    )
}