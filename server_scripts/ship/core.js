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
    let energy = blockEntity.persistentData.energy ?? 0
    if (energy >= config.SHIP_CORE.ENERGY_COST) {
        energy -= config.SHIP_CORE.ENERGY_COST
        RespawnWeaknessApi.recoverPlayer(player)
    } else {
        player.setStatusMessage("能量不足")
    }

    blockEntity.persistentData.energy = energy
})

BlockEvents.placed("kubejs:base_core", event => {
    let base = event.server.persistentData.base_core_pos
    if (base && event.level.getBlock(new BlockPos(base.x, base.y, base.z)).id === "kubejs:base_core") {
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
        event.server.persistentData.base_core_pos = null
    }
})

BlockEvents.placed("kubejs:ship_core", event => {
    let blockEntity = event.level.getBlockEntity(event.block.pos)
    blockEntity.persistentData.energy = 0
})

// 同步飞船核心数据到客户端
ServerEvents.tick(event => {
    if (event.server.tickCount % 5 !== 0) return // 每5tick同步一次

    let basePos = event.server.persistentData.base_core_pos
    let level = event.server.getLevel("minecraft:overworld")
    if (!level || !basePos) return

    let baseBlock = level.getBlock(new BlockPos(basePos.x, basePos.y, basePos.z))
    if (baseBlock.id !== "kubejs:base_core") return

    level.getPlayers().forEach(player => {
        let hitResult = player.rayTrace(5)
        if (!hitResult || !hitResult.block) return

        let targetBlock = hitResult.block
        if (targetBlock.id !== "kubejs:ship_core") return

        let blockEntity = level.getBlockEntity(targetBlock.pos)
        if (!blockEntity) return

        let energy = blockEntity.persistentData.energy ?? 0
        let distance = blockEntity.persistentData.distance ?? 0
        let connected = blockEntity.persistentData.isPowered ?? false

        // 发送数据到客户端
        player.sendData("ship_core_info", {
            energy: energy,
            distance: Math.floor(distance),
            connected: connected,
            maxRange: config.SHIP_CORE.MAX_CHARGE_RANGE,
            x: targetBlock.x,
            y: targetBlock.y,
            z: targetBlock.z
        })
    })
})