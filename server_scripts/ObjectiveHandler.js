let $ObjectiveStatus = Java.loadClass("dev.ignis.fractionandspore.control.ObjectiveStatus")
let prePlayerObjectiveStatus = Utils.newMap()

PlayerEvents.tick(event => {
    /** @type {{player:Internal.ServerPlayer,server:Internal.MinecraftServer}} */
    let { player, server } = event
    if (server.tickCount % 5 != 0) return

    let hasObjective = ObjectiveApi.hasActiveObjective(player)
    let displayData = {
        active: false,
        name: "",
        status: null,
        percent: 0, // 进度条 0.0 - 1.0
        isCooldown: false,
        targetPos: null
    }

    if (hasObjective) {
        displayData.active = true
        displayData.name = ObjectiveApi.getCurrentObjectiveName(player)
        displayData.status = ObjectiveApi.getCurrentObjectiveStatusString(player)
        // 使用 getRemainingTimePercentage 获取动态百分比
        displayData.percent = ObjectiveApi.getCurrentObjectiveRemainingPercentage(player)
        displayData.targetPos = ObjectiveApi.getCurrentObjectivePosition(player).asLong()
    } else if (ObjectiveApi.isInCooldown(player)) {
        displayData.active = true
        displayData.isCooldown = true
        displayData.name = "任务冷却中"
        displayData.status = `${ObjectiveApi.getCooldownSeconds(player)}s`
        displayData.percent = ObjectiveApi.getCurrentObjectiveRemainingPercentage(player)
    }

    // 只要状态或进度有变化就发包
    let cacheKey = `${displayData.name}${displayData.status}${displayData.percent.toFixed(2)}`
    if (prePlayerObjectiveStatus.get(player.uuid) != cacheKey) {
        prePlayerObjectiveStatus.put(player.uuid, cacheKey)
        player.sendData('sync_objective', displayData)
    }
})