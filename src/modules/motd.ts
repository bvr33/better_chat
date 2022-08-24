import { events } from "bdsx/event";
import { bedrockServer } from "bdsx/launcher";
import { serverProperties } from "bdsx/serverproperties";
import { plugin } from "..";


export class MOTDLoop {

    private loop: NodeJS.Timeout
    private messageIndex: number = 0
    private messagesCount: number

    constructor () {
        events.serverOpen.on(
            async () => {
                this.start()
            }
        )
    }


    public start = () => {
        if( !plugin.config.motd.useDefault )
        {
            this.updateMessage()

            this.loop = setInterval(
                () => {
                    let message: string
                    if( this.messagesCount > 1 )
                    {
                        if( this.messageIndex >= this.messagesCount ) this.messageIndex = 0
                        else this.messageIndex++
                    } else this.messageIndex = 0

                    message = plugin.config.motd.values[this.messageIndex]

                    if( plugin.config.motd.useDefault )
                    {
                        bedrockServer.serverInstance.setMotd( serverProperties["server-name"]! );
                        this.stop()
                        return
                    }
                    bedrockServer.serverInstance.setMotd( message );

                },
                1000 * plugin.config.motd.interval

            )

        }

    }

    public stop = () => {
        clearInterval( this.loop )
    }

    public updateMessage = () => {
        plugin.updateConfig()
        this.messagesCount = plugin.config.motd.values.length - 1
    }

}
export const motdLoop = new MOTDLoop()