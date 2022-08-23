import { ServerPlayer } from "bdsx/bds/player";
import { CustomForm, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle, SimpleForm } from "bdsx/bds/form";
import { mainSettings } from "./mainSettings";
import { antiSpamSettings } from "./antiSpamSettings";
import { roomsSettings } from "./roomsSettings";

export const mainmenu = ( commandUser: ServerPlayer ) => {

    const f = new SimpleForm( 'BetterChat menu',
        '',
        [
            {
                text: 'AntiSpam Settings',
                image: {
                    type: 'path',
                    data: ''
                }
            },
            {
                text: 'Rooms Settings',
                image: {
                    type: 'path',
                    data: ''
                }
            },
            {
                text: 'Main Settings',
                image: {
                    type: 'path',
                    data: ''
                }
            },
        ],
    )
    f.sendTo( commandUser.getNetworkIdentifier(), ( { response } ) => {
        switch ( response ) {
            case 1:
                antiSpamSettings( commandUser )
                break;
            case 2:
                roomsSettings( commandUser )
                break;
            case 3:
                mainSettings( commandUser )
                break
        }
    } )
}