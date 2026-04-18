NetworkEvents.dataReceived("serverShipCfg", event => {
    global.serverShipConfig = event.data
})

ClientEvents.tick(event => {
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
    let maxRange
    try {
        if (global.serverShipConfig)
            maxRange = global.serverShipConfig.MAX_CHARGE_RANGE
        else
            maxRange = global.config.SHIP_CORE.MAX_CHARGE_RANGE
    } catch (error) {
        maxRange = -1
    }
    global.shipCoreInfo = {
        energy: energy,
        distance: Math.ceil(distance*100)/100,
        connected: connected,
        maxRange: maxRange,
        lastUpdate: Date.now()
    }
})