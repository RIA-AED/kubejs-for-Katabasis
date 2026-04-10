let $Boolean = Java.loadClass("java.lang.Boolean")

global.terminals = []
global.terminalInfo = {
    //连接距离(欧几里得距离)
    distance: 5,
    //每一次请求的FE
    energyPerRequest: 1000,
    //方块存储的最大FE
    maxStoredEnergy: 10000
}

//测试用
// ItemEvents.rightClicked("stick", event => {
//     let { player } = event

//     for (let obj of global.terminals) {
//         console.log("uuid: " + obj.uuid + " pos: " + BlockPos.of(obj.pos) + " shipPos: " + BlockPos.of(obj.shipPos))
//     }
// })
//测试用

BlockEvents.broken("kubejs:energy_transport_terminal", event => {
    let { level, block } = event
    let be = level.getBlockEntity(block.pos)
    if (be == null || !be.persistentData.contains("pid")) return

    let uuid = be.persistentData.getUUID("pid")
    let uuidStr = uuid.toString()

    global.terminals = global.terminals.filter(obj => obj.uuid.toString() != uuidStr)
})

BlockEvents.rightClicked("kubejs:energy_transport_terminal", event => {
    let { block, player, level, hand } = event
    if (hand != "MAIN_HAND") return
    let item = player.getItemInHand(hand)
    if (item.id != "create:wrench") return

    let be = block.entity
    let bs = block.blockState
    if (be == null) return
    
    let newMode = be.persistentData.getInt("mode") == 0 ? 1 : 0
    be.persistentData.putInt("mode", newMode)
    be.setChanged()

    let newState = bs.setValue(BlockProperties.POWERED, $Boolean.valueOf(newMode == 1))
    level.setBlock(block.pos, newState, 3)
    
    let modeName = newMode == 1 ? "§6输出" : "§b输入"
    player.displayClientMessage(`§7终端模式已切换为: ${modeName}`, true)
    player.swing()
})

BlockEvents.placed("kubejs:energy_transport_terminal",event=>{
    event.block.set("kubejs:energy_transport_terminal",{"powered":"false"})
})