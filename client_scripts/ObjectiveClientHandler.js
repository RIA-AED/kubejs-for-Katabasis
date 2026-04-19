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