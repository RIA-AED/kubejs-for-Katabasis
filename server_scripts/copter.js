ItemEvents.rightClicked("kubejs:copter", event => {
    let server = event.server
    let player = event.player.name.getString()
    let block = event.player.block
    server.runCommandSilent(`execute at @a[name=${player}] run effect give @a[name=${player}] minecraft:slow_falling 8 0 false`)
    server.runCommandSilent(`execute at @a[name=${player}] run particle cloud ${block.x} ${block.y} ${block.z} 1 1 1 0.25 200 normal`)
})