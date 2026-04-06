let max_fill_1 = 200
let max_fill_2 = 100
let batch_fill = 10

BlockEvents.placed("kubejs:filler_block_1", event => {
    let block = event.block

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

    block.entity.persistentData.xList = [0]
    block.entity.persistentData.yList = [0]
    block.entity.persistentData.zList = [0]
    block.entity.persistentData.front = 0
    block.entity.persistentData.filledCount = 0
    filling_block_2(block, event.server)
    //event.player.tell(xList)
})

BlockEvents.rightClicked(event => {
    if (event.block.hasTag("replaceable")) event.player.tell(11)
})

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
                if (placeable == false && (nowBlock == "minecraft:air" || nowBlock.hasTag("replaceable"))) {
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
            if (nowBlock.offset(0, 1, 0) == "minecraft:air" || nowBlock.offset(0, 1, 0).hasTag("replaceable")) {
                xList.push(nowX + 0)
                yList.push(nowY + 1)
                zList.push(nowZ + 0)
            }
            if (nowBlock.offset(1, 0, 0) == "minecraft:air" || nowBlock.offset(1, 0, 0).hasTag("replaceable")) {
                xList.push(nowX + 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (nowBlock.offset(0, 0, 1) == "minecraft:air" || nowBlock.offset(0, 0, 1).hasTag("replaceable")) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ + 1)
            }
            if (nowBlock.offset(0, -1, 0) == "minecraft:air" || nowBlock.offset(0, -1, 0).hasTag("replaceable")) {
                xList.push(nowX + 0)
                yList.push(nowY - 1)
                zList.push(nowZ + 0)
            }
            if (nowBlock.offset(-1, 0, 0) == "minecraft:air" || nowBlock.offset(-1, 0, 0).hasTag("replaceable")) {
                xList.push(nowX - 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (nowBlock.offset(0, 0, -1) == "minecraft:air" || nowBlock.offset(0, 0, -1).hasTag("replaceable")) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ - 1)
            }
            //event.player.tell(xList)
        }
        if (block.entity.persistentData.filledCount % batch_fill == 0) {
            server.scheduleInTicks(1, function (callback) {
                filling_block_1(block, server)
            })
        } else {
            filling_block_1(block, server)
        }

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
            if (placeable == false && (nowBlock == "minecraft:air" || nowBlock.hasTag("replaceable"))) {
                nowBlock.set("kubejs:filling_block")
                block.entity.persistentData.filledCount += 1
                placeable = true
            }

        }
        catch (e) {
            //event.player.tell(e)
        }
        if (placeable) {
            if (nowBlock.offset(1, 0, 0) == "minecraft:air" || nowBlock.offset(1, 0, 0).hasTag("replaceable")) {
                xList.push(nowX + 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (nowBlock.offset(0, 0, 1) == "minecraft:air" || nowBlock.offset(0, 0, 1).hasTag("replaceable")) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ + 1)
            }
            if (nowBlock.offset(-1, 0, 0) == "minecraft:air" || nowBlock.offset(-1, 0, 0).hasTag("replaceable")) {
                xList.push(nowX - 1)
                yList.push(nowY + 0)
                zList.push(nowZ + 0)
            }
            if (nowBlock.offset(0, 0, -1) == "minecraft:air" || nowBlock.offset(0, 0, -1).hasTag("replaceable")) {
                xList.push(nowX + 0)
                yList.push(nowY + 0)
                zList.push(nowZ - 1)
            }
            //event.player.tell(xList)
        }
        if (block.entity.persistentData.filledCount % batch_fill == 0) {
            server.scheduleInTicks(1, function (callback) {
                filling_block_2(block, server)
            })
        } else {
            filling_block_2(block, server)
        }

    }
}


/**
 * 检测目标位置有几面有方块
 * @param {Internal.BlockContainerJS} block
 */
function getFacesAir(block) {
    let r = 0
    if (block.offset(0, 1, 0) == "minecraft:air" || block.offset(0, 1, 0).hasTag("replaceable")) r++
    if (block.offset(1, 0, 0) == "minecraft:air" || block.offset(1, 0, 0).hasTag("replaceable")) r++
    if (block.offset(0, 0, 1) == "minecraft:air" || block.offset(0, 0, 1).hasTag("replaceable")) r++
    if (block.offset(0, -1, 0) == "minecraft:air" || block.offset(0, -1, 0).hasTag("replaceable")) r++
    if (block.offset(-1, 0, 0) == "minecraft:air" || block.offset(-1, 0, 0).hasTag("replaceable")) r++
    if (block.offset(0, 0, -1) == "minecraft:air" || block.offset(0, 0, -1).hasTag("replaceable")) r++
    return r
}