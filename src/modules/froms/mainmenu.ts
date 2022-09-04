import { ServerPlayer } from "bdsx/bds/player"
import { CustomForm, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle, SimpleForm } from "bdsx/bds/form"
import { chatSettings } from "./chatSettings"
import { antiSpamSettings } from "./antiSpamSettings"
import { roomsSettings } from "./roomsSettings"

export const mainmenu = ( commandUser: ServerPlayer ) => {

    const f = new SimpleForm( 'BetterChat Settings',
        '',
        [
            {
                text: 'antispam',
                image: {
                    type: 'path',
                    data: ''
                }
            },
            {
                text: 'rooms',
                image: {
                    type: 'path',
                    data: ''
                }
            },
            {
                text: 'chat',
                image: {
                    type: 'path',
                    data: ''
                }
            },
        ],
    )
    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            switch( response ) {
                case 0:
                    antiSpamSettings( commandUser )
                    break
                case 1:
                    roomsSettings( commandUser )
                    break
                case 2:
                    chatSettings( commandUser )
                    break
            }
        } )
}