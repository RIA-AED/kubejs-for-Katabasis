PlayerEvents.respawned(event => {
    const player = event.player
    player.persistentData.weakness = true;
    player.potionEffects.add("minecraft:weakness", -1, 0, false, false)
})

PlayerEvents.tick(event => {
    const player = event.player
    const hasWeakness = player.persistentData.weakness
    if (hasWeakness) {
        if (!player.hasEffect("minecraft:weakness")) {
            player.potionEffects.add("minecraft:weakness", -1, 0, false, false)
        }
    } else {
        if (player.hasEffect("minecraft:weakness")) {
            player.potionEffects.remove("minecraft:weakness")
        }
    }
})

BlockEvents.rightClicked("kubejs:base_core", event => {
    const player = event.player
    player.persistentData.weakness = false;
})

BlockEvents.rightClicked("kubejs:ship_core", event => {
    const { player, block } = event
    let energy = block.persistentData.energy ?? 0
    if (energy > 0) {
        energy--
        player.persistentData.weakness = false
        player.tell(`能量剩余: ${energy - 1}`)
    } else {
        player.tell("能量不足")
    }
    block.persistentData.energy = energy
})

BlockEvents.placed("kubejs:base_core", event => {
    if (event.server.persistentData.base_core){
        event.player.tell("世界内已存在 base_core 了")
        event.cancel()
    } else {
        event.server.persistentData.base_core = true
        event.server.persistentData.base_core_pos = {
            x: event.block.x,
            y: event.block.y,
            z: event.block.z,
            dim: event.level.dimension
        }
    }
})

BlockEvents.broken("kubejs:base_core", event => {
    if (event.server.persistentData.base_core){
        event.server.persistentData.base_core = false
        event.server.persistentData.base_core_pos = null
    }
})
