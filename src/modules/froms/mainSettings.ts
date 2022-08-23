import { CustomForm, FormInput, FormLabel, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { plugin } from "../..";

export const mainSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'Main Settings' )
    f.addComponent( new FormToggle( 'enable', plugin.config.main.enable ) )
    f.addComponent( new FormToggle( 'log chat to console', plugin.config.main.logToConsole ) )
    f.addComponent( new FormInput( 'message Spectator [nickname <SEPARATOR> message', '<SEPARATOR>', plugin.config.main.messageSeparator ) )
    f.addComponent( new FormLabel( "Event Messages" ) )
    f.addComponent( new FormInput( 'Join Message', 'Join Message', plugin.config.main.eventsMessage.join ) )
    f.addComponent( new FormInput( 'Left Message', 'Left Message', plugin.config.main.eventsMessage.left ) )

    f.sendTo( commandUser.getNetworkIdentifier(), ( { response } ) => {
        plugin.log( typeof ( response[ 4 ] ) )
    } )
}
