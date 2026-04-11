// Server Side
function EnergyTransportTerminalBlock() {}

global.terminals = []

EnergyTransportTerminalBlock.broken =
    function (
        /** @type {Internal.BlockBrokenEventJS} */ event
    ) {
        let { level, block } = event
        let be = level.getBlockEntity(block.pos)
        if (be == null || !be.persistentData.contains("pid")) return

        let uuid = be.persistentData.getUUID("pid")
        let uuidStr = uuid.toString()

        global.terminals = global.terminals.filter(obj => obj.uuid.toString() != uuidStr)
    }

EnergyTransportTerminalBlock.findAllTerminal =
    function (
        /** @type {Internal.ItemClickedEventJS} */ event
    ) {
        let { player } = event

        for (let obj of global.terminals) {
            console.log("uuid: " + obj.uuid + " pos: " + BlockPos.of(obj.pos) + " shipPos: " + BlockPos.of(obj.shipPos))
        }
    }

BlockEvents.broken("kubejs:energy_transport_terminal", event => EnergyTransportTerminalBlock.broken(event))

// 测试用
ItemEvents.rightClicked("stick", event => EnergyTransportTerminalBlock.findAllTerminal(event))
// 测试用