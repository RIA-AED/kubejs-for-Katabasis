ItemEvents.rightClicked("kubejs:copter", event => {
    let player = event.player.name.getString()
    let handitem = event.player.mainHandItem
    if (event.player.cooldowns.isOnCooldown(handitem.id)) return
    let pos = event.player.block
    event.server.runCommandSilent(`execute at @a[name=${player}] run effect give @a[name=${player}] minecraft:slow_falling 10 0 false`)
    event.server.runCommandSilent(`execute at @a[name=${player}] run particle cloud ${pos.x} ${pos.y} ${pos.z} 1 1 1 0.25 200 normal`)
    event.player.addItemCooldown(event.player.mainHandItem.id, 100)
    event.player.damageHeldItem(MAIN_HAND, 1)
    try {
        event.server.runCommandSilent(`execute as ${player} at @s run playsound alloyed:bronze_bell player @a[distance=..20] ~ ~ ~ 1 1 1`)
        playsound(event.server, pos, "protection_pixel:reactoroff", 1, 1)
    } catch (e) {
        event.player.tell(e)
    }

})