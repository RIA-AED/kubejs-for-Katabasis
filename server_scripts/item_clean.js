ServerEvents.loaded(event => {
    event.server.scheduleRepeatingInTicks(global.config.ItemClean.item_clean_interval_tick, function (callback) {
        event.server.tell("掉落物超过阈值！即将进行清理")
        event.server.scheduleInTicks(global.config.ItemClean.item_clean_waitfortick, function (callback) {
            event.server.runCommandSilent(`kill @e[type=item]`)
            event.server.tell("掉落物清理完成")
        })
    })
})