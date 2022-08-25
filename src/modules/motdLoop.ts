import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { serverProperties } from "bdsx/serverproperties";
import { plugin } from "..";

let loop: NodeJS.Timeout
let messageIndex: number = 0
let messagesCount: number

export const motdLoop = {

    start: (): void => {
        if( !plugin.config.motd.useDefault )
        {
            motdLoop.updateMessage()

            loop = setInterval(
                () => {
                    let message: string
                    if( messagesCount > 1 )
                    {
                        if( messageIndex >= messagesCount ) messageIndex = 0
                        else messageIndex++
                    } else messageIndex = 0

                    message = plugin.config.motd.values[messageIndex]

                    if( plugin.config.motd.useDefault )
                    {
                        bedrockServer.serverInstance.setMotd( serverProperties["server-name"]! );
                        motdLoop.stop()
                        return
                    }
                    bedrockServer.serverInstance.setMotd( message );

                },
                1000 * plugin.config.motd.interval
            )
        }
    },

    stop: (): void => {
        clearInterval( loop )
    },

    updateMessage: (): void => {
        plugin.updateConfig()
        messagesCount = plugin.config.motd.values.length - 1
    }

}

events.serverOpen.on(
    async () => {
        motdLoop.start()
    }
)