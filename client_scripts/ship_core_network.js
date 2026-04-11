PlayerEvents.tick(event => {
    let player = event.player
    let hitResult = player.rayTrace(5)
    if (!hitResult || !hitResult.block) return
    let block = hitResult.block
    if (block.id !== "kubejs:ship_core") return
    let blockEntity = block.level.getBlockEntity(block.pos)
    if (!blockEntity) return
    let energy = blockEntity.data.energy ?? 0
    let distance = blockEntity.data.distance ?? -1
    let connected = blockEntity.data.isPowered ?? false
    global.shipCoreInfo = {
        energy: energy,
        distance: distance,
        connected: connected,
        maxRange: global.config.SHIP_CORE.MAX_CHARGE_RANGE,
        lastUpdate: Date.now()
    }
})