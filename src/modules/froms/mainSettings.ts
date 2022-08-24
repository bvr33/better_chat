import { CustomForm, FormInput, FormLabel, FormSlider, FormToggle } from "bdsx/bds/form";
import { ServerPlayer } from "bdsx/bds/player";
import { TextFormat } from "bdsx/util";
import { plugin } from "../..";

export const mainSettings = ( commandUser: ServerPlayer ): void => {
    const f = new CustomForm( 'Main Settings' )
    /*  >> 0  */    f.addComponent( new FormToggle( 'Chat Format', plugin.config.betterChat.enabled ) )
    /*  >> 1  */    f.addComponent( new FormToggle( 'log chat to console', plugin.config.betterChat.logToConsole ) )
    /*  >> 2  */    f.addComponent( ( new FormSlider( "Message cooldown", 1, 30, 1, plugin.config.betterChat.cooldown ) ) )
    /*  >> 3  */    f.addComponent( ( new FormSlider( "Max Message Lenght", 10, 100, 1, plugin.config.betterChat.maxMessageLength ) ) )
    /*   4    */    f.addComponent( new FormLabel( `Message Separoator` ) )
    /*  >> 5  */    f.addComponent( ( new FormInput( "<NICK> [SEPARATOR] <MESSAGE>", 'Separator', plugin.config.betterChat.messageSeparator ) ) )
    /*   6    */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   7    */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Message History` ) )
    /*  >> 8  */    f.addComponent( new FormToggle( 'Enabled', plugin.config.messageHistory.enabled ) )
    /*  >> 9  */    f.addComponent( ( new FormSlider( "Limit", 5, 50, 1, plugin.config.messageHistory.limit ) ) )
    /*   10   */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   11   */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Sound On Mention` ) )
    /*  >> 12 */    f.addComponent( new FormToggle( 'Enabled', plugin.config.soundOnMention.enabled ) )
    /*  >> 13 */    f.addComponent( ( new FormInput( "Sound", "Sound", plugin.config.soundOnMention.sound ) ) )
    /*   14   */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   15   */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Sound On Join` ) )
    /*  >> 16 */    f.addComponent( new FormToggle( 'Enabled', plugin.config.soundOnJoin.enabled ) )
    /*  >> 17 */    f.addComponent( ( new FormInput( "Sound", "Sound", plugin.config.soundOnJoin.sound ) ) )
    /*   18   */    f.addComponent( new FormLabel( `${TextFormat.WHITE}---------------` ) )
    /*   19   */    f.addComponent( new FormLabel( `${TextFormat.AQUA}Player events message` ) )
    /*  >> 20 */    f.addComponent( ( new FormInput( "Join", "message <PLAYER>", plugin.config.eventsMessage.join ) ) )
    /*  >> 21 */    f.addComponent( ( new FormInput( "Left", "message <PLAYER>", plugin.config.eventsMessage.left ) ) )

    f.sendTo( commandUser.getNetworkIdentifier(),
        ( { response } ) => {
            plugin.config.betterChat.enabled = response[0]
            plugin.config.betterChat.logToConsole = response[1]
            plugin.config.betterChat.cooldown = response[2]
            plugin.config.betterChat.maxMessageLength = response[3]
            plugin.config.betterChat.messageSeparator = response[5]
            plugin.config.messageHistory.enabled = response[8]
            plugin.config.messageHistory.limit = response[9]
            plugin.config.soundOnMention.enabled = response[12]
            plugin.config.soundOnMention.sound = response[13]
            plugin.config.soundOnJoin.enabled = response[16]
            plugin.config.soundOnJoin.sound = response[17]
            plugin.config.eventsMessage.join = response[20]
            plugin.config.eventsMessage.left = response[21]
            plugin.updateConfig()
        }
    )
}
