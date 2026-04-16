/**
 * 检查两个位置是否在指定范围内
 * @param {Vec3d} a 第一个位置
 * @param {Vec3d} b 第二个位置
 * @param {number} range 范围
 * @returns {boolean} 是否在范围内
 */

function isInRange(a, b, range) {
    let dx = a.x() - b.x()
    let dy = a.y() - b.y()
    let dz = a.z() - b.z()
    return dx*dx + dy*dy + dz*dz <= range*range
}

function getDistance(a, b) {
    let dx = a.x() - b.x()
    let dy = a.y() - b.y()
    let dz = a.z() - b.z()
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * 检测目标位置是否可被替换（草、菌丝等）
 * @param {Internal.BlockContainerJS} block
 */
function canReplace(block) {
    if (block == "minecraft:air" || block.hasTag("replaceable") || block.hasTag("spore:removable_foliage") || block.hasTag("small_flowers" || block.hasTag("immersive_weathering:leaf_piles"))
        || block.hasTag("immersive_weathering:small_mushrooms")) {
        return true
    }
    return false
}
