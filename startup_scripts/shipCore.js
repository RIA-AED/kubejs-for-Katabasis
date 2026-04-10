global.shipCore = function (blockEntity) {
    blockEntity.serverTick(20, Math.floor(Math.random() * 20), entity => {
        const level = entity.level
        const server = level.server
        const data = server.persistentData
        const entityData = entity.persistentData

        if (!entityData.energy) entityData.energy = 0

        if (!data.base_core_pos || entityData.energy >= 100) return

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

        if (isInRange(worldPos, baseWorldPos, 30)) {
            entityData.energy++
        }
    })
}