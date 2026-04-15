/** 
 * 生成范围内随机整数（左闭右闭）
 * @param {Number} min
 * @param {Number} max
*/
function randint(max, min) {
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

global.playsound = (server, block, soundId, maxVolum, pitch) => playsound(server, block, soundId, maxVolum, pitch)