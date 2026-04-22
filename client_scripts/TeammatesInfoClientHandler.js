global.teammatesData = {}

NetworkEvents.dataReceived("sync_teammates", event => {
    let { teammates } = event.data
    let { level } = Client

    let now = Date.now()

    teammates.forEach(data => {
        let p = level.getPlayerByUUID(UUID.fromString(data.uuid))
        if (p == null)
            global.teammatesData[data.name] = {
                x: data.x,
                y: data.y,
                z: data.z,
                isMate: data.isMate,
                lastUpdate: now,
                isLocal: false
            }
    })
})

ClientEvents.tick(event => {
    let { player, level } = event
    if (!player || !level) return

    let now = Date.now()
    let localPlayers = level.players

    // 1. 用本地实体数据覆盖/更新缓存
    localPlayers.forEach(lp => {
        if (lp.uuid == player.uuid) return

        let name = lp.name.string
        // 如果缓存里已经有这个人的队伍信息，或者我们想实时维护
        global.teammatesData[name] = {
            x: lp.x,
            y: lp.y,
            z: lp.z,
            // 只有当本地能获取到 team 时才更新 isMate，否则保留服务端的判断
            isMate: lp.team == player.team,
            lastUpdate: now,
            isLocal: true, // 标记为本地实体，渲染时可以做平滑插值
            actualEntity: lp // 直接存入实体引用方便渲染获取 eyeHeight
        }
    })

    // 2. 清理过期数据（例如超过 10 秒没收到服务端消息也没在本地看到的人）
    for (let name in global.teammatesData) {
        if (now - global.teammatesData[name].lastUpdate > 10000) {
            delete global.teammatesData[name]
        }
    }
})