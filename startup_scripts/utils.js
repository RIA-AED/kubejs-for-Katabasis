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