function isInRange(a, b, range) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const dz = a.z - b.z
    return dx*dx + dy*dy + dz*dz <= range*range
}
