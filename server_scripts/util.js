ServerEvents.loaded(event => {
    event.server.scheduleInTicks(20, function (callback) {
        event.server.tell("早上好中国现在我有CDU")
    })
})

/** 
 * 生成范围内随机整数（左闭右闭）
 * @param {Number} min
 * @param {Number} max
*/
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 发声
 * @param {Internal.MinecraftServer} server
 * @param {Internal.BlockContainerJS} block
 * @param {String} soundId
 * @param {Number} maxVolum
 * @param {Number} pitch
 */
function playsound(server, block, soundId, maxVolum, pitch) {
    server.runCommandSilent(`execute positioned ${block.x} ${block.y} ${block.z} run playsound ${soundId} block @a[distance=..20] ${block.x} ${block.y} ${block.z} ${maxVolum} ${pitch} ${maxVolum / 2}`)
}

/**
 * 发声（仅限单玩家）
 * @param {Internal.MinecraftServer} server
 * @param {Internal.BlockContainerJS} block
 * @param {String} targetPlayerName
 * @param {String} soundId
 * @param {Number} maxVolum
 * @param {Number} pitch
 */
function playsoundForPlayer(server, block, targetPlayerName, soundId, maxVolum, pitch) {
    server.runCommandSilent(`execute positioned ${block.x} ${block.y} ${block.z} run playsound ${soundId} block ${targetPlayerName} ${block.x} ${block.y} ${block.z} ${maxVolum} ${pitch} ${maxVolum / 2}`)
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

global.playsound = (server, block, soundId, maxVolum, pitch) => playsound(server, block, soundId, maxVolum, pitch)