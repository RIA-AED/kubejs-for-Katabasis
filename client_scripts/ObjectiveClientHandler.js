global.currentObjectiveData = {
    active: false,
    name: "",
    status: "",
    percent: 0,
    isCooldown: false,
    targetPos: null
}

NetworkEvents.dataReceived("sync_objective", event => {
    global.currentObjectiveData = event.data
})

ItemEvents.rightClicked("iron_ingot", event => {
    let { player } = event

    Object.entries(global.currentObjectiveData).forEach(([key, value]) => {
        player.tell(`${key}: ${value}`)
    })
})