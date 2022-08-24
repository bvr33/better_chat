import { CustomForm, FormButton, FormInput, FormLabel, FormSlider, FormToggle, SimpleForm } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { TextFormat } from "bdsx/util";
import { plugin } from "../..";

export const motdSettings = ( commandUser: ServerPlayer ) => {
    const f = new SimpleForm( 'Motd Settings' )
    f.addButton( new FormButton( 'Add Message' ) )
    f.addButton( new FormButton( 'Delete Message' ) )
    f.addButton( new FormButton( 'Settings' ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            switch( response )
            {
                case 0:
                    addMotd( commandUser )
                    break;
                case 1:
                    delMotd( commandUser )
                    break;
                case 2:
                    settings( commandUser )
                    break;
            }
        }
    )
}

const addMotd = ( commandUser: ServerPlayer ) => {
    const f = new CustomForm( 'Add MOTD' )
    f.addComponent( new FormInput( 'add MOTD', 'MOTD', '' ) )
    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            plugin.config.motd.values.push( response[0] )
            plugin.updateConfig()
            motdSettings( commandUser )
        }
    )
}
const delMotd = ( commandUser: ServerPlayer ) => {
    const f = new CustomForm( `Delete MOTD` )
    plugin.config.motd.values.forEach( ( value: string, idx: number ) => {
        f.addComponent( new FormLabel( value ) )
        f.addComponent( new FormToggle( 'Remove', false ) )
        f.addComponent( new FormLabel( `${TextFormat.WHITE}--------------` ) )
    } )


    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            const filteredResponse: boolean[] = response.filter( ( value: boolean | null ) => value != null )
            filteredResponse.forEach( ( v, i ) => {
                if( v ) plugin.config.motd.values.splice( i, 1 )
            } )
            plugin.updateConfig()
            motdSettings( commandUser )
        }
    );
}
const settings = ( commandUser: ServerPlayer ) => {
    const f = new CustomForm( 'MOTD Settings' )
    /*  >> 0  */    f.addComponent( new FormToggle( 'Use Default?', plugin.config.motd.useDefault ) )
    /*  >> 1  */    f.addComponent( ( new FormSlider( "interval (seconds)", 5, 100, 1, plugin.config.motd.interval ) ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            plugin.config.motd.useDefault = response[0]
            plugin.config.motd.interval = response[1]
            plugin.updateConfig()
            motdSettings( commandUser )
        }
    )
}