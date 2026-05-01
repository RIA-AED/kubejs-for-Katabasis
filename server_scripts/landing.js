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
        entity.persistentData.posX = event.block.pos.x
        entity.persistentData.posY = event.block.pos.y
        entity.persistentData.posZ = event.block.pos.z
        entity.potionEffects.add("minecraft:resistance", 1000, 4, true, false)
        let freezeTime = 20
        let spawned = false
        if (event.player.offHandItem.id == "create:cardboard" && !event.player.mainHandItem.isEmpty()) {
            entity.tags.add("item")
            spawned = true
        }
        if (spawned == false && event.player.offHandItem.id != "create:cardboard" && event.player.mainHandItem.id == "kubejs:cdu_drop") {
            entity.tags.add("cdu")
            spawned = true
        }
        if (spawned == false && event.player.offHandItem.id != "create:cardboard" && event.player.mainHandItem.id == "kubejs:return_drop") {
            entity.tags.add("return")
            spawned = true
        }
        if (spawned == false && event.player.offHandItem.id != "create:cardboard" && event.player.mainHandItem.id == "kubejs:light_drop") {
            entity.tags.add("light")
            spawned = true
        }
        if (spawned == false && event.player.offHandItem.id != "create:cardboard" && event.player.mainHandItem.id == "kubejs:cannon_drop") {
            entity.tags.add("cannon")
            spawned = true
        }
        if (spawned == false && event.player.offHandItem.id != "create:cardboard" && event.player.mainHandItem.id == "kubejs:leveller_drop") {
            entity.tags.add("leveller")
            spawned = true
        }
        if (spawned == false && event.player.offHandItem.id != "create:cardboard" && event.player.mainHandItem.id == "kubejs:guard_drop") {
            entity.tags.add("guard")
            spawned = true
        }
        if (spawned == false) {
            entity.tags.add("player")
            event.player.sendData('cam_control', { status: "first" })
            event.player.startRiding(entity, true)
            freezeTime = playerLandingPodInit(event.player, event.level, event.server)
            event.server.scheduleInTicks(freezeTime, function (callback) {
                event.player.sendData('cam_control', { status: "third_back" })
            })
        }
        event.server.scheduleInTicks(freezeTime, function (callback) {
            entity.noGravity = false
        })
        entity.noGravity = true
        entity.spawn()
        entity.setCustomName("")
        entity.mergeNbt("{CustomNameVisible:0b}")


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
        timer += 2
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
        try {
            if (entity.noGravity) {
                let block = level.getBlock(entity.persistentData.posX, entity.persistentData.posY, entity.persistentData.posZ)
                //server.tell(entity.persistentData.posX)
                let ship = VSHelper.getShipByBlockPos(level, block.pos)
                if (ship != null) {
                    let pos = VSHelper.shipBlockPosToWorldVec3(ship, block.pos)
                    if (getDistance(entity.block.pos.x, entity.block.pos.y, entity.block.pos.z, pos.x(), pos.y(), pos.z()) > 1.5)
                        entity.teleportTo(pos.x(), pos.y() - 0.5, pos.z())
                }
            }
        } catch (e) {
            server.tell(e)
        }

        if (entity.tags.contains("player")) {
            if (entity.passengers.empty) {
                entity.tags.add("dead")
                server.runCommandSilent("execute as @e[tag=dead] at @s run tp @s ~ -200 ~")
                return
            }
            else {
                entity.getPassengers().forEach(it => {
                    if (it.type == "minecraft:player") {
                        let name = it.name.getString()
                        server.runCommandSilent(`effect give ${name} minecraft:resistance 4 4 true`)
                    }
                })
            }
        }

        if (entity.noGravity == false && entity.block.y < 256) {
            if (entity.persistentData.isFinalFalling == false) {
                try {
                    for (let offset = 1; offset <= global.config.LandingPod.podFinalFallingHeight; offset++) {
                        if (entity.block.offset(0, -offset, 0) != "minecraft:air") {
                            entity.persistentData.isFinalFalling = true
                            entity.persistentData.putString('state', 'landing')
                            entity.triggerAnimation('main', 'landing')
                            entity.potionEffects.add("minecraft:slow_falling", 1000, 2, true, false)
                            entity.playSound("createbigcannons:lava_fluid_release", 1, 1)
                            //server.runCommandSilent(`execute as @e[type=]playsound createbigcannons:lava_fluid_release ambient @a ${entity.x} ${entity.y} ${entity.z} 1 0.7 1`)
                            break
                        }
                        if (entity.onGround() || entity.isInWater()) {
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

                if (entity.onGround() || entity.isInWater()) {
                    entity.persistentData.putString('state', 'break')
                    entity.mergeNbt("{CustomNameVisible:0b}")
                    entity.setCustomNameVisible(false)
                    entity.setCustomName("")
                    entity.triggerAnimation('main', 'break')  // 触发刷新，控制器会重新评估并执行 
                    entity.getPassengers().forEach(it => {
                        it.unRide()
                        if (it.type == "minecraft:player") {
                            it.sendData('cam_control', { status: "first" })
                            // server.scheduleInTicks(2, function (callback) {
                            //     it.sendData('cam_control', { status: "normal" })
                            // })
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

                    if (entity.tags.contains("cdu")) {
                        entity.block.set("spore:cdu")
                        entity.block.mergeEntityData({ "fuel": 12000 })
                    }
                    if (entity.tags.contains("cannon")) {
                        entity.block.offset(0, -1, 0).set("createbigcannons:cannon_mount")
                        entity.block.offset(0, -1, 1).set("minecraft:lever", { "face": "wall", "facing": "south" })
                        entity.block.offset(0, -1, -1).set("minecraft:lever", { "face": "wall", "facing": "north", "powered": true })
                        entity.block.set("minecraft:hopper")
                        entity.block.inventory.insertItem(Item.of('createbigcannons:autocannon_cartridge', 64, '{Projectile:{Count:1b,id:"createbigcannons:flak_autocannon_round",tag:{Fuze:{Count:1b,id:"createbigcannons:impact_fuze"},Tracer:1b}}}'), false)
                        entity.block.offset(0, 1, -1).set("createbigcannons:steel_autocannon_breech", { "facing": "south", "handle": true })
                        entity.block.offset(0, 1, -1).mergeEntityData({ "Connections": ["south"] })
                        entity.block.offset(0, 1, 0).set("createbigcannons:steel_autocannon_recoil_spring", { "facing": "south" })
                        entity.block.offset(0, 1, 0).mergeEntityData({ "Connections": ["south", "north"] })
                        entity.block.offset(0, 1, 1).set("createbigcannons:steel_autocannon_barrel", { "facing": "south" })
                        entity.block.offset(0, 1, 1).mergeEntityData({ "Connections": ["south", "north"] })
                        entity.block.offset(0, 1, 2).set("createbigcannons:steel_autocannon_barrel", { "facing": "south" })
                        entity.block.offset(0, 1, 2).mergeEntityData({ "Connections": ["south", "north"] })
                        entity.block.offset(0, 1, 3).set("createbigcannons:steel_autocannon_barrel", { "facing": "south" })
                        entity.block.offset(0, 1, 3).mergeEntityData({ "Connections": ["north"] })
                    }
                    if (entity.tags.contains("fill")) {
                        entity.block.set("kubejs:filler_block_2")
                        try {
                            playsound(server, entity.block, "protection_pixel:reactoroff", 1, 1.5)
                            entity.block.entity.persistentData.xList = [0]
                            entity.block.entity.persistentData.yList = [0]
                            entity.block.entity.persistentData.zList = [0]
                            entity.block.entity.persistentData.front = 0
                            entity.block.entity.persistentData.filledCount = 0
                            filling_block_2(entity.block, server)
                        }
                        catch (e) {
                            server.tell(e)
                        }
                    }
                    if (entity.tags.contains("light")) {
                        let count = 0
                        let maxCount = 120
                        let xRange = 60
                        let yRange = 30
                        let zRange = 60
                        while (count < maxCount) {
                            let block = entity.block.offset(randint(-1 * xRange, xRange), 10 + randint(0, yRange), randint(-1 * zRange, zRange))
                            if (canReplace(block)) {
                                block.set("kubejs:light_spark")
                                count++
                            }
                        }
                    }
                    if (entity.tags.contains("return")) {
                        entity.block.set("kubejs:return_block")
                    }
                    if (entity.tags.contains("leveller")) {
                        SporePlusApi.placeSupplyRack(level, entity.block, Item.of('pointblank:cr_leveller', '{GeckoLibID:62L,aim:0b,ammo:1,ammox:{},fmid:[I;1185645641,-1632421030,-1154921073,429101538],lid:-6968655897147236967L,mid:5058018963645678663L,sa:{scope:"/"},seed:990201902015293984L}'), '4x pointblank:warhammer')
                    }
                    if (entity.tags.contains("guard")) {
                        SporePlusApi.placeSupplyRack(level, entity.block, Item.of('pointblank:x_guard_1', '{GeckoLibID:71L,aim:0b,ammo:10,ammox:{},fmid:[I;2133113564,78526763,-1253530715,594025078],lid:-7683552585953384301L,mid:3696545583663632311L,sa:{scope:"/"},seed:-4728271792698087507L}'), '20x pointblank:blackglass')
                    }

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
