PlayerEvents.respawned(event => {
    const player = event.player
    RespawnWeaknessApi.applyWeakened(player)
})

BlockEvents.rightClicked("kubejs:base_core", event => {
    const player = event.player
    if (RespawnWeaknessApi.isWeakened(player)) {
        RespawnWeaknessApi.recoverPlayer(player)
    }
})

BlockEvents.rightClicked("kubejs:ship_core", event => {
    const { player, block, level } = event
    if (event.level.isClientSide() || !RespawnWeaknessApi.isWeakened(player)) return
    let blockEntity = level.getBlockEntity(block.pos)
    let energy = blockEntity.data.energy ?? 0
    if (energy >= config.SHIP_CORE.ENERGY_COST) {
        energy -= config.SHIP_CORE.ENERGY_COST
        RespawnWeaknessApi.recoverPlayer(player)
    } else {
        player.setStatusMessage("能量不足")
    }

    blockEntity.data.energy = energy
    blockEntity.setChanged()
})

BlockEvents.placed("kubejs:base_core", event => {
    let base = event.server.persistentData.base_core_pos
    if (base && !base.x && !base.y && !base.z && event.level.getBlock(new BlockPos(base.x, base.y, base.z)).id === "kubejs:base_core") {
        event.player.tell("世界内已存在 base_core 了")
        event.cancel()
    } else if (!VSHelper.isBlockInShipyard(event.level, event.block.pos)) {
        event.player.tell("该位置不是船舶")
        event.cancel()
    } else {
        event.server.persistentData.base_core = true
        event.server.persistentData.base_core_pos = {
            x: event.block.x,
            y: event.block.y,
            z: event.block.z,
        }
        event.player.tell("注册了" + event.server.persistentData.base_core_pos)
    }
})

BlockEvents.broken("kubejs:base_core", event => {
    if (event.server.persistentData.base_core){
        event.server.persistentData.base_core = false
        event.player.tell("移除了" + event.server.persistentData.base_core_pos)
        event.server.persistentData.remove("base_core_pos")
    }
})

BlockEvents.placed("kubejs:ship_core", event => {
    let blockEntity = event.level.getBlockEntity(event.block.pos)
    blockEntity.data.energy = 0
})