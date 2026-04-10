function shipCore(blockEntity) {
    blockEntity.serverTick(startUpConfig.SHIP_CORE.ENERGY_RECOVERY_DELAY, Math.floor(Math.random() * startUpConfig.SHIP_CORE.ENERGY_RECOVERY_DELAY), entity => {
        const level = entity.level
        const server = level.server
        const data = server.persistentData
        const entityData = entity.persistentData
        const config = startUpConfig.SHIP_CORE

        if (!entityData.energy) entityData.energy = 0

        if (!data.base_core_pos || entityData.energy >= config.MAX_ENERGY) return

        const baseCorePos = new BlockPos(
            data.base_core_pos.x,
            data.base_core_pos.y,
            data.base_core_pos.z
        )
        const shipPos = entity.blockPos

        const baseShip = VSHelper.getShipByBlockPos(level, baseCorePos)
        const ship = VSHelper.getShipByBlockPos(level, shipPos)

        if (!baseShip || !ship) return

        const baseWorldPos = VSHelper.shipPosToWorldPos(baseShip, [
            baseCorePos.x, baseCorePos.y, baseCorePos.z
        ])
        const worldPos = VSHelper.shipPosToWorldPos(ship, [
            shipPos.x, shipPos.y, shipPos.z
        ])

        if (!baseWorldPos || !worldPos) return

        if (isInRange(worldPos, baseWorldPos, config.MAX_CHARGE_RANGE)) {
            entityData.energy += config.ENERGY_RECOVERY_RATE
            entityData.energy = Math.min(entityData.energy, config.MAX_ENERGY)
        }
    })
}