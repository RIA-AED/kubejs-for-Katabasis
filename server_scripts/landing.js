BlockEvents.rightClicked("kubejs:drop_controller", event => {
    if (event.hand != "MAIN_HAND") return
    try {
        let ship = VSHelper.getShipByBlockPos(event.level, event.block.pos)
        if (ship == null) {
            event.player.tell("你需要在飞艇上使用此方块")
            return
        }
        let pos = VSHelper.shipBlockPosToWorldVec3(ship, event.block.pos)

        let entity = event.level.createEntity("kubejs:landing_pod")
        entity.setPos(pos.x(), pos.y(), pos.z())
        entity.spawn()
        entity.
        event.player.startRiding(entity, true)
        entity.potionEffects.add("minecraft:resistance", 1000, 4, true, false)

    } catch (e) {
        event.player.tell(e)
    }
})

EntityEvents.hurt("kubejs:landing_pod", event => {
    if (event.source.getType() != "fall") return
    event.entity.persistentData.putString('state', 'break')
    event.entity.triggerAnimation('main', 'break')  // 触发刷新，控制器会重新评估并执行 
    event.entity.getPassengers().forEach(it => {
        it.unRide()
    })
    event.server.scheduleInTicks(40, function (callback) {
        event.entity.tags.add("dead")
        event.server.runCommandSilent("execute as @e[tag=dead] at @s run tp @s ~ -200 ~")
    })
    event.cancel()
})