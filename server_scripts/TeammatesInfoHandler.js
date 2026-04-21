PlayerEvents.tick(event => {
    /** @type {{player:Internal.ServerPlayer,server:Internal.MinecraftServer,level:Internal.ServerLevel}} */
    let { player, server, level } = event
    if (server.tickCount % 20 != 0) return

    let players = level.players

    let teamData = []
    players.forEach(other => {
        if (other.uuid != player.uuid) {
            let isMate = other.team == player.team 
            teamData.push({
                name: other.name.string,
                uuid: other.uuid.toString(),
                isMate: isMate,
                x: other.x,
                y: other.y,
                z: other.z
            })
        }
    })

    player.sendData("sync_teammates", { teammates: teamData })
})