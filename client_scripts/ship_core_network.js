// 接收服务器同步的飞船核心数据
NetworkEvents.dataReceived("ship_core_info", event => {
    let data = event.data
    if (!global.shipCoreInfo) {
        global.shipCoreInfo = { energy: 0, distance: -1, connected: false, pos: null, lastUpdate: 0 }
    }
    global.shipCoreInfo.energy = data.energy
    global.shipCoreInfo.distance = data.distance
    global.shipCoreInfo.connected = data.connected
    global.shipCoreInfo.maxRange = data.maxRange
    global.shipCoreInfo.pos = { x: data.x, y: data.y, z: data.z }
    global.shipCoreInfo.lastUpdate = Date.now()
})
