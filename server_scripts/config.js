let config = {
    "SHIP_CORE": {
        "ENERGY_COST": 1,
        "MAX_CHARGE_RANGE": 30
    },
    // 能量传输终端设置
    "EnergyTransportTerminal": {
        "maxStoredEnergy": 10000,
        "energyPerRequest": 10000,
        "maxDistance": 5
    },
    "LandingPod": {
        "podFinalFallingHeight": 20
    },
    "ItemClean": {
        "max_item_size": 500,
        "item_clean_waitfortick": 60,
        "item_clean_size": 10000
    }
}

global.config = config

PlayerEvents.loggedIn(event => {
    let player = event.player
    player.sendData("serverShipCfg", config.SHIP_CORE)
})
