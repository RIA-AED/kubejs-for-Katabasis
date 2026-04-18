

let $itemClass = Java.loadClass("net.minecraft.world.entity.item.ItemEntity")
LevelEvents.tick(event => {
    let block = event.level.getBlock(0, 0, 0)
    let items = event.level.getEntitiesOfClass($itemClass, AABB.ofBlock(block.pos).inflate(10000))
    if (items.size() >= 500) {
        event.server.tell("掉落物超过阈值！即将进行清理")
        event.server.scheduleInTicks(60, function (callback) {
            event.server.runCommandSilent(`kill @e[type=item]`)
            event.server.tell("掉落物清理完成")
        })
    }
})