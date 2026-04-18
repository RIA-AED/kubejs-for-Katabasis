ServerEvents.loaded(event => {
    event.server.scheduleRepeatingInTicks(global.config.ItemClean.item_clean_interval_tick, function (callback) {
        event.server.tell("即将清理掉落物！")
        event.server.scheduleInTicks(global.config.ItemClean.item_clean_waitfortick, function (callback) {
            event.server.runCommandSilent(`kill @e[type=item]`)
            event.server.tell("掉落物清理完成")
        })
    })
})