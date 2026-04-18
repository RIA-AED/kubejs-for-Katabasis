

let $itemClass = Java.loadClass("net.minecraft.world.entity.item.ItemEntity")
LevelEvents.tick(event => {
    let block = event.level.getBlock(0, 0, 0)
    let items = event.level.getEntitiesOfClass($itemClass, AABB.ofBlock(block.pos).inflate(global.config.ItemClean.item_clean_size))
    if (items.size() >= global.config.ItemClean.max_item_size) {
        event.server.tell("掉落物超过阈值！即将进行清理")
        event.server.scheduleInTicks(global.config.ItemClean.item_clean_waitfortick, function (callback) {
            event.server.runCommandSilent(`kill @e[type=item]`)
            event.server.tell("掉落物清理完成")
        })
    }
})