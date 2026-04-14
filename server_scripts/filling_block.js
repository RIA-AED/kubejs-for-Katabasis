let max_fill_1 = 200
let max_fill_2 = 100
let batch_fill = 10

BlockEvents.placed("kubejs:filler_block_1", event => {
    let block = event.block
    playsound(event.server, block, "protection_pixel:reactoroff", 1, 1.5)
    block.entity.persistentData.xList = [0]
    block.entity.persistentData.yList = [0]
    block.entity.persistentData.zList = [0]
    block.entity.persistentData.front = 0
    block.entity.persistentData.filledCount = 0
    filling_block_1(block, event.server)
    //event.player.tell(xList)
})
BlockEvents.placed("kubejs:filler_block_2", event => {
    let block = event.block
    playsound(event.server, block, "protection_pixel:reactoroff", 1, 1.5)
    block.entity.persistentData.xList = [0]
    block.entity.persistentData.yList = [0]
    block.entity.persistentData.zList = [0]
    block.entity.persistentData.front = 0
    block.entity.persistentData.filledCount = 0
    filling_block_2(block, event.server)
    //event.player.tell(xList)
})

BlockEvents.rightClicked(event => {
    if (event.block.hasTag("spore:removable_foliage")) event.player.tell(11)
})

global.fillingBlock =
    (
        /** @type {Internal.BlockContainerJS} */ block,
        /** @type {Internal.MinecraftServer} */ server,
        /** @type {number} */ type
    ) => {
        if (type == 1) filling_block_1(block, server)
        else if (type == 2) filling_block_2(block, server)
        else {
            throw new Error("Type is not either 1 or 2!")
        }
    }


/**
 * 填坑
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.MinecraftServer} server
 */
function filling_block_1(block, server) {
    if (block.entity.persistentData.front < block.entity.persistentData.xList.length && block.entity.persistentData.filledCount < max_fill_1) {
        let xList, yList, zList, nowX, nowY, nowZ, front, nowBlock, placeable, filledCount

        xList = block.entity.persistentData.xList
        yList = block.entity.persistentData.yList
        zList = block.entity.persistentData.zList
        front = block.entity.persistentData.front
        nowX = xList[front]
        nowY = yList[front]
        nowZ = zList[front]


        try {

            block.entity.persistentData.front += 1
            nowBlock = block.offset(nowX, nowY, nowZ)
            placeable = false
            if (getFacesAir(nowBlock) <= 4 || nowBlock == "kubejs:filler_block_1") {
                //event.player.tell(`pos${nowX}, ${nowY}, ${nowZ}`)
                if (nowBlock == "kubejs:filler_block_1") {
                    placeable = true
                }
                if (placeable == false && canReplace(nowBlock)) {
                    nowBlock.set("kubejs:filling_block")
                    block.entity.persistentData.filledCount += 1
                    placeable = true
                }
            }
        }
        catch (e) {
            //event.player.tell(e)
        }
        if (placeable) {
            if (canReplace(nowBlock.offset(0, 1, 0))) {
                xList.push(nowX + 0)
                yList.push(nowY + 1)
                zList.push(nowZ + 0)
            }
            if (canReplace(nowBlock.offset(1, 0, 0))) {
                xList.push(nowX + 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (canReplace(nowBlock.offset(0, 0, 1))) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ + 1)
            }
            if (canReplace(nowBlock.offset(0, -1, 0))) {
                xList.push(nowX + 0)
                yList.push(nowY - 1)
                zList.push(nowZ + 0)
            }
            if (canReplace(nowBlock.offset(-1, 0, 0))) {
                xList.push(nowX - 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (canReplace(nowBlock.offset(0, 0, -1))) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ - 1)
            }
            //event.player.tell(xList)/playsound  ambient @a -3516.12 79.00 -3989.54 1 0.3 1
        }
        if (block.entity.persistentData.filledCount % batch_fill == 0) {
            playsound(server, nowBlock, "minecraft:block.wool.place", 0.5, Math.random())
            //server.runCommandSilent(`execute positioned ${} ${nowBlock.y} ${nowBlock.z} run playsound  block @a[distance=..20] ${nowBlock.x} ${nowBlock.y} ${nowBlock.z} 0.5 ${Math.random()} 0`)
            server.scheduleInTicks(1, function (callback) {
                filling_block_1(block, server)
            })
        } else {
            filling_block_1(block, server)
        }

    } else {
        block.set("kubejs:filling_block")
    }
}

function filling_block_2(block, server) {
    if (block.entity.persistentData.front < block.entity.persistentData.xList.length && block.entity.persistentData.filledCount < max_fill_2) {
        let xList, yList, zList, nowX, nowY, nowZ, front, nowBlock, placeable, filledCount

        xList = block.entity.persistentData.xList
        yList = block.entity.persistentData.yList
        zList = block.entity.persistentData.zList
        front = block.entity.persistentData.front
        nowX = xList[front]
        nowY = yList[front]
        nowZ = zList[front]


        try {
            block.entity.persistentData.front += 1
            nowBlock = block.offset(nowX, nowY, nowZ)
            placeable = false

            if (nowBlock == "kubejs:filler_block_2") {
                placeable = true
            }
            if (placeable == false && canReplace(nowBlock)) {
                nowBlock.set("kubejs:filling_block")
                block.entity.persistentData.filledCount += 1
                placeable = true
            }

        }
        catch (e) {
            //event.player.tell(e)
        }
        if (placeable) {
            if (canReplace(nowBlock.offset(1, 0, 0))) {
                xList.push(nowX + 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (canReplace(nowBlock.offset(0, 0, 1))) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ + 1)
            }
            if (canReplace(nowBlock.offset(-1, 0, 0))) {
                xList.push(nowX - 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (canReplace(nowBlock.offset(0, 0, -1))) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ - 1)
            }
            //event.player.tell(xList)
        }
        if (block.entity.persistentData.filledCount % batch_fill == 0) {
            playsound(server, nowBlock, "minecraft:block.wool.place", 0.5, Math.random())
            server.scheduleInTicks(1, function (callback) {
                filling_block_2(block, server)
            })
        } else {
            filling_block_2(block, server)
        }

    } else {
        block.set("kubejs:filling_block")
    }
}


/**
 * 检测目标位置有几面有方块
 * @param {Internal.BlockContainerJS} block
 */
function getFacesAir(block) {
    let r = 0
    if (canReplace(block.offset(0, 1, 0))) r++
    if (canReplace(block.offset(1, 0, 0))) r++
    if (canReplace(block.offset(0, 0, 1))) r++
    if (canReplace(block.offset(0, -1, 0))) r++
    if (canReplace(block.offset(-1, 0, 0))) r++
    if (canReplace(block.offset(0, 0, -1))) r++
    return r
}

/**
 * 检测目标位置是否可被替换（草、菌丝等）
 * @param {Internal.BlockContainerJS} block
 */
function canReplace(block) {
    if (block == "minecraft:air" || block.hasTag("replaceable") || block.hasTag("spore:removable_foliage") || block.hasTag("small_flowers")
        || block.hasTag("immersive_weathering:small_mushrooms")) {
        return true
    }
    return false
}