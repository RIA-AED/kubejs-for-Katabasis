BlockEvents.rightClicked("kubejs:return_block", event => {
    if (event.hand != "MAIN_HAND") return
    if (!event.player.persistentData.contains("shipPosX")) {
        event.player.setStatusMessage("请先设置回传位置！")
        return
    }
    let nowAge = parseInt(event.block.properties.age)
    if (nowAge == 4) {
        event.block.set("minecraft:air")
        event.player.setStatusMessage("回传方块能量已耗尽！")
        return
    }


    let block = event.level.getBlock(event.player.persistentData.shipPosX, event.player.persistentData.shipPosY, event.player.persistentData.shipPosZ)


    if (block.id != "kubejs:ship_core") {
        event.player.setStatusMessage("你标定的飞艇核心已不存在或移动位置")
        return
    }

    let teleported = false
    for (let x = -2; x <= 2; x++) {
        if (teleported) break
        for (let y = 0; y <= 3; y++) {
            if (teleported) break
            for (let z = -2; z <= 2; z++) {
                if (block.offset(x, y, z).id != "minecraft:air" || block.offset(x, y + 1, z).id != "minecraft:air") continue
                let ship = VSHelper.getShipByBlockPos(event.level, block.offset(x, y, z).pos)
                if (ship == null) {
                    event.player.setStatusMessage("你选定的回传方块不在飞艇上！")
                    return
                }
                let pos = VSHelper.shipBlockPosToWorldVec3(ship, block.offset(x, y, z).pos)
                event.player.teleportTo(pos.x(), pos.y(), pos.z())
                event.player.setStatusMessage("已返回飞艇！")
                teleported = true
                break
            }
        }
    }
    event.server.scheduleInTicks(1, () => {
        let name = event.player.name.getString()
        event.server.runCommandSilent(`execute as ${name} at @s run particle minecraft:portal ~ ~ ~ 0.25 0.5 0.25 1 200 force`)
        playsound(event.server, event.player.block, "minecraft:entity.enderman.teleport", 1, 1)
    })

    if (!teleported) event.player.setStatusMessage("飞船核心附近被方块占满！")
    
    nowAge += 1
    event.block.set("kubejs:return_block", { "age": `${nowAge}` })
})

BlockEvents.rightClicked("kubejs:ship_core", event => {
    if (event.hand != "MAIN_HAND") return
    event.player.persistentData.shipPosX = event.block.pos.x
    event.player.persistentData.shipPosY = event.block.pos.y
    event.player.persistentData.shipPosZ = event.block.pos.z
    event.player.setStatusMessage("回传位置已记录！")
})