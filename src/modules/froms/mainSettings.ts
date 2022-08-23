import { CustomForm, FormInput, FormLabel, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from "../..";
import { Configs } from "../../utils/configuration";

export const mainSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'Main Settings' )
    /*0*/ f.addComponent( new FormToggle( 'enable', plugin.config.main.enable ) )
    /*1*/ f.addComponent( new FormToggle( 'log chat to console', plugin.config.main.logToConsole ) )
    /*2*/ f.addComponent( new FormLabel( "Message Separator" ) )
    /*3*/ f.addComponent( new FormInput( '[nickname <SEPARATOR> message', '<SEPARATOR>', plugin.config.main.messageSeparator ) )
    /*4*/ f.addComponent( new FormLabel( "Event Messages" ) )
    /*5*/ f.addComponent( new FormInput( 'Join Message', 'Join Message', plugin.config.main.eventsMessage.join ) )
    /*6*/ f.addComponent( new FormInput( 'Left Message', 'Left Message', plugin.config.main.eventsMessage.left ) )

    f.sendTo( commandUser.getNetworkIdentifier(), ( { response } ) => {
        plugin.config.main.enable = response[0]
        plugin.config.main.logToConsole = response[1]
        plugin.config.main.messageSeparator = response[3]
        plugin.config.main.eventsMessage.join = response[5]
        plugin.config.main.eventsMessage.left = response[6]
        plugin.updateConfig(Configs.main)
    } )
}
