import { CustomForm, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form"
import { ServerPlayer } from "bdsx/bds/player"
import { TextFormat } from "bdsx/util"
import { plugin } from "../.."
import { mainmenu } from "./mainmenu"

export const chatSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'Chat Settings' )
    /*  >> 0  */    f.addComponent( new FormToggle( 'Chat Format', plugin.config.betterChat.enabled ) )
    /*  >> 1  */    f.addComponent( new FormToggle( 'log chat to console', plugin.config.betterChat.logToConsole ) )
    /*  >> 2  */    f.addComponent( ( new FormSlider( "Message cooldown", 1, 30, 1, plugin.config.betterChat.cooldown ) ) )
    /*  >> 3  */    f.addComponent( ( new FormSlider( "Max Message Lenght", 0, 100, 1, plugin.config.betterChat.maxMessageLength ) ) )
    /*   4    */    f.addComponent( new FormLabel( `Message Separoator` ) )
    /*  >> 5  */    f.addComponent( ( new FormInput( "<NICK> [SEPARATOR] <MESSAGE>", 'Separator', plugin.config.betterChat.messageSeparator ) ) )
    /*   6    */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   7    */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Message History` ) )
    /*  >> 8  */    f.addComponent( new FormToggle( 'Enabled', plugin.config.messageHistory.enabled ) )
    /*  >> 9  */    f.addComponent( ( new FormSlider( "Limit", 5, 50, 1, plugin.config.messageHistory.limit ) ) )
    /*   10   */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   11   */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Sound On Mention` ) )
    /*  >> 12 */    f.addComponent( new FormToggle( 'Enabled', plugin.config.soundOnMention.enabled ) )
    /*  >> 13 */    f.addComponent( ( new FormInput( "Sound", "Sound", plugin.config.soundOnMention.sound.name ) ) )
    /*  >> 14 */    f.addComponent( ( new FormSlider( "Pitch", 0.1, 3, 0.1, plugin.config.soundOnMention.sound.pitch ) ) )
    /*   15   */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   16   */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Sound On Join` ) )
    /*  >> 17 */    f.addComponent( new FormToggle( 'Enabled', plugin.config.soundOnJoin.enabled ) )
    /*  >> 18 */    f.addComponent( ( new FormInput( "Sound", "Sound", plugin.config.soundOnJoin.sound.name ) ) )
    /*  >> 19 */    f.addComponent( ( new FormSlider( "Pitch", 0.1, 3, 0.1, plugin.config.soundOnJoin.sound.pitch ) ) )
    /*   20   */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   21   */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Player events message` ) )
    /*  >> 22 */    f.addComponent( ( new FormInput( "Join", "message <PLAYER>", plugin.config.eventsMessage.join ) ) )
    /*  >> 23 */    f.addComponent( ( new FormInput( "Left", "message <PLAYER>", plugin.config.eventsMessage.left ) ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        async ( { response } ) => {
            plugin.config.betterChat.enabled = response[0]
            plugin.config.betterChat.logToConsole = response[1]
            plugin.config.betterChat.cooldown = response[2]
            plugin.config.betterChat.maxMessageLength = response[3]
            plugin.config.betterChat.messageSeparator = response[5]
            plugin.config.messageHistory.enabled = response[8]
            plugin.config.messageHistory.limit = response[9]
            plugin.config.soundOnMention.enabled = response[12]
            plugin.config.soundOnMention.sound.name = response[13]
            plugin.config.soundOnMention.sound.pitch = response[14]
            plugin.config.soundOnJoin.enabled = response[17]
            plugin.config.soundOnJoin.sound.name = response[18]
            plugin.config.soundOnJoin.sound.pitch = response[19]
            plugin.config.eventsMessage.join = response[22]
            plugin.config.eventsMessage.left = response[23]
            plugin.updateConfig()
            mainmenu( commandUser )
        }
    )
}
