function shipCore(blockEntity) {
    blockEntity.enableSync();
    blockEntity.serverTick(startUpConfig.SHIP_CORE.ENERGY_RECOVERY_DELAY, Math.floor(Math.random() * startUpConfig.SHIP_CORE.ENERGY_RECOVERY_DELAY), entity => {
        try {
            let level = entity.level
            let server = level.server
            let data = server.persistentData
            let entityData = entity.data
            let config = startUpConfig.SHIP_CORE

            if (!entityData.energy) entityData.energy = 0
            if (!data.base_core_pos){
                entityData.isPowered = false
                entityData.distance = -1
                entityData.energy = entityData.energy ?? 0
                entity.setChanged()
                return;
            }

            let baseCorePos = new BlockPos(
                data.base_core_pos.x,
                data.base_core_pos.y,
                data.base_core_pos.z
            )
            let shipPos = entity.blockPos

            let baseShip = VSHelper.getShipByBlockPos(level, baseCorePos)
            let ship = VSHelper.getShipByBlockPos(level, shipPos)

            if (!baseShip || !ship) return

            let baseWorldPos = VSHelper.shipPosToWorldPos(baseShip, [
                baseCorePos.x, baseCorePos.y, baseCorePos.z
            ])
            let worldPos = VSHelper.shipPosToWorldPos(ship, [
                shipPos.x, shipPos.y, shipPos.z
            ])

            if (!baseWorldPos || !worldPos) return
            entityData.distance = getDistance(worldPos, baseWorldPos)
            if (isInRange(worldPos, baseWorldPos, config.MAX_CHARGE_RANGE)) {
                entityData.isPowered = true
                if (entityData.energy < config.MAX_ENERGY){
                    entityData.energy += config.ENERGY_RECOVERY_RATE
                    entityData.energy = Math.min(entityData.energy, config.MAX_ENERGY)
                }
            } else {
                entityData.isPowered = false
            }
        } catch (e) {
            console.log(e)
            entity.data.isPowered = false
            entity.data.distance = -1
            if (!entity.data.energy){
                entity.data.energy = 0
            }
        } finally {
            entity.setChanged()
        }
    })
}