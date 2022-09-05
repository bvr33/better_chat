import { CustomForm, FormSlider, FormToggle } from "bdsx/bds/form"
import { ServerPlayer } from "bdsx/bds/player"
import { plugin } from "../.."
import { mainmenu } from "./mainmenu"

export const antiSpamSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'AntiSpam Settings' )
    /*  >> 0  */    f.addComponent( new FormToggle( 'enabled', plugin.config.antiSpam.enabled ) )
    /*  >> 1  */    f.addComponent( new FormToggle( 'mute', plugin.config.antiSpam.mute ) )
    /*  >> 2  */    f.addComponent( ( new FormSlider( "mute time (seconds)", 1, 60, 1, plugin.config.antiSpam.seconds ) ) )
    /*  >> 3  */    f.addComponent( ( new FormSlider( "message limit", 1, 10, 1, plugin.config.antiSpam.limit ) ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            plugin.config.antiSpam.enabled = response[0]
            plugin.config.antiSpam.mute = response[1]
            plugin.config.antiSpam.seconds = response[2]
            plugin.config.antiSpam.limit = response[3]
            plugin.updateConfig()
            mainmenu( commandUser )
        }
    )
}