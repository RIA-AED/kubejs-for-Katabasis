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
        entity.setPos(pos.x(), pos.y() - 0.5, pos.z())
        entity.mergeNbt("{CustomNameVisible:0b}")
        let freezeTime = 40
        if (event.player.mainHandItem.isEmpty()) {
            event.player.sendData('cam_control', { status: "first" })
            event.player.startRiding(entity, true)
            entity.potionEffects.add("minecraft:resistance", 1000, 4, true, false)
            freezeTime = playerLandingPodInit(event.player, event.level, event.server)

        }
        entity.noGravity = true
        entity.spawn()
        event.server.scheduleInTicks(freezeTime, function (callback) {
            entity.noGravity = false
            event.player.sendData('cam_control', { status: "third_back" })
        })






    } catch (e) {
        event.player.tell(e)
    }
})
/** 
 * 玩家降落仓初始函数
 * @param {Internal.Player} player
 * @param {Internal.Level} level
 * @param {Internal.MinecraftServer} server
*/
function playerLandingPodInit(player, level, server) {
    let timer = 0
    pod_log.log1.forEach(item => {
        server.scheduleInTicks(timer, function (callback) {
            player.setStatusMessage(item)
        })
        timer += 1
    });
    server.scheduleInTicks(timer, function (callback) {
        server.runCommandSilent(`title ${player.name.getString()} title [{"text":"RIA","color":"red","bold":true},{"text":" OS","color":"white","bold":true}]`)
    })
    pod_log.log2.forEach(item => {
        server.scheduleInTicks(timer, function (callback) {
            player.setStatusMessage(item)
        })
        timer += randint(3, 6)
    });
    server.scheduleInTicks(timer, function (callback) {
        server.runCommandSilent(`title ${player.name.getString()} subtitle [{"text":"${pod_log.subtitles[randint(0, pod_log.subtitles.length - 1)]}","color":"white"}]`)
    })
    return timer
}

EntityEvents.hurt("kubejs:landing_pod", event => {
    if (event.source.getType() != "fall") return
    event.cancel()
})

EntityEvents.spawned("kubejs:landing_pod", event => {
    landingPodTick(event.entity, event.level, event.server)
})

/** 
 * 降落仓tick函数
 * @param {Internal.LivingEntity} entity
 * @param {Internal.Level} level
 * @param {Internal.MinecraftServer} server
*/
function landingPodTick(entity, level, server) {
    server.scheduleInTicks(1, function (callback) {
        if (!entity) return
        if (!entity.persistentData.contains("isFinalFalling")) {
            entity.persistentData.isFinalFalling = false
        }

        if (entity.block.y < 256) {
            if (entity.persistentData.isFinalFalling == false) {
                try {
                    for (let offset = 1; offset <= 20; offset++) {
                        if (entity.block.offset(0, -offset, 0) != "minecraft:air") {
                            entity.persistentData.isFinalFalling = true
                            entity.persistentData.putString('state', 'landing')
                            entity.triggerAnimation('main', 'landing')
                            entity.potionEffects.add("minecraft:slow_falling", 1000, 2, true, false)
                            entity.playSound("createbigcannons:lava_fluid_release", 1, 1)
                            //server.runCommandSilent(`execute as @e[type=]playsound createbigcannons:lava_fluid_release ambient @a ${entity.x} ${entity.y} ${entity.z} 1 0.7 1`)
                            break
                        }
                    }
                } catch (e) {
                    server.tell(e)
                }

            } else {
                let maxM = 0.2

                let clampedX = Math.max(-maxM, Math.min(maxM, entity.motionX))
                let clampedZ = Math.max(-maxM, Math.min(maxM, entity.motionZ))

                entity.setMotion(clampedX, -0.3, clampedZ)

                level.spawnParticles(
                    'createbigcannons:smoke',
                    true,
                    entity.x, entity.y - 2, entity.z,
                    0.3, 0, 0.3,
                    3, 0.05
                )
                level.spawnParticles(
                    'minecraft:campfire_cosy_smoke',
                    true,
                    entity.x, entity.y - 2, entity.z,
                    0.3, 0, 0.3,
                    3, 0.05
                )


                if (entity.onGround()) {
                    entity.persistentData.putString('state', 'break')
                    entity.mergeNbt("{CustomNameVisible:0b}")
                    entity.setCustomNameVisible(false)
                    entity.setCustomName("")
                    entity.triggerAnimation('main', 'break')  // 触发刷新，控制器会重新评估并执行 
                    entity.getPassengers().forEach(it => {
                        it.unRide()
                        if (it.type == "minecraft:player") {
                            it.sendData('cam_control', { status: "first" })
                            server.scheduleInTicks(2, function (callback) {
                                it.sendData('cam_control', { status: "normal" })
                            })
                        }
                    })
                    let explosion = entity.block.createExplosion()
                    level.spawnParticles(
                        'createbigcannons:fluid_cloud',
                        true,
                        entity.x, entity.y - 0.5, entity.z,
                        0, 0, 0,
                        1, 2
                    )
                    explosion.strength(0.1)
                    explosion.explode()
                    entity.mergeNbt("{CustomNameVisible:0b}")
                    server.scheduleInTicks(40, function (callback) {
                        entity.tags.add("dead")
                        server.runCommandSilent("execute as @e[tag=dead] at @s run tp @s ~ -200 ~")
                    })
                    return
                }
            }
        }
        landingPodTick(entity, level, server)
    })
}
