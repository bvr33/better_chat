import { ServerPlayer } from "bdsx/bds/player";
import { CustomForm, FormDropdown, FormInput, FormLabel, FormSlider, FormToggle, SimpleForm } from "bdsx/bds/form";
import { mainSettings } from "./mainSettings";
import { antiSpamSettings } from "./antiSpamSettings";
import { roomsSettings } from "./roomsSettings";
import { motdSettings } from "./motdSettings";

export const mainmenu = ( commandUser: ServerPlayer ) => {

    const f = new SimpleForm( 'BetterChat Settings',
        '',
        [
            {
                text: 'AntiSpam',
                image: {
                    type: 'path',
                    data: ''
                }
            },
            {
                text: 'Rooms',
                image: {
                    type: 'path',
                    data: ''
                }
            },
            {
                text: 'Main',
                image: {
                    type: 'path',
                    data: ''
                }
            },
        ],
    )
    f.sendTo( commandUser.getNetworkIdentifier(), ( { response } ) => {
        switch( response )
        {
            case 0:
                antiSpamSettings( commandUser )
                break;
            case 1:
                roomsSettings( commandUser )
                break;
            case 2:
                mainSettings( commandUser )
                break
            case 3:
                motdSettings( commandUser )
                break
        }
    } )
}