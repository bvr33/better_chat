
import { events } from "bdsx/event";

console.log('[plugin:BetterChat] allocated');

events.serverOpen.on(()=>{
    console.log('[plugin:BetterChat] launching');
});

events.serverClose.on(()=>{
    console.log('[plugin:BetterChat] closed');
});

