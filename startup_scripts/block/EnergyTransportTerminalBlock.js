// Startup Side
let $UUID = Java.loadClass("java.util.UUID")
let $Boolean = Java.loadClass("java.lang.Boolean")

function EnergyTransportTerminalBlock() {}

EnergyTransportTerminalBlock.rightClick =
    function (
    /** @type {Internal.BlockRightClickedEventJS} */ event
    ) {
        let { block, player, level, hand } = event
        if (level.clientSide) return
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

        let modeName = newMode == 1 ? "§6广播" : "§b接收"
        player.displayClientMessage(`§7终端模式已切换为: ${modeName}`, true)
        player.swing()
    }

EnergyTransportTerminalBlock.blockEntity =
    function (
    /** @type {Internal.BlockEntityInfo} */ info
    ) {
        info.attachCapability(
            CapabilityBuilder.ENERGY.customBlockEntity()
                .canExtract(() => true)
                .canReceive(() => true)
                .extractEnergy((be, amount, simulate) => {
                    return EnergyTransportTerminalBlock.extractEnergy(be, amount, simulate)
                })
                .receiveEnergy((be, amount, simulate) => {
                    return EnergyTransportTerminalBlock.receiveEnergy(be, amount, simulate)
                })
                .getEnergyStored(be => {
                    return be.persistentData.getInt("energy")
                })
                .getMaxEnergyStored(() => global.config.EnergyTransportTerminal.maxStoredEnergy)
        )
            .tick(20, 0, (/** @type {Internal.BlockEntityJS} */ be) => {
                let { blockPos, level } = be
                if (level.clientSide) return

                let localPosLong = blockPos.asLong()
                let realPosLong = localPosLong
                let ship = VSHelper.getShipByBlockPos(level, blockPos)

                if (ship != null) {
                    let vec = VSHelper.shipPosToWorldPos(ship, Vec3d.atCenterOf(blockPos))
                    realPosLong = BlockPos.containing(vec.x(), vec.y(), vec.z()).asLong()
                }

                let uuid = null
                if (!be.persistentData.contains("pid")) {
                    let foundData = global.terminals.find(obj => {
                        return obj.pos == realPosLong
                    })

                    if (foundData != null) {
                        uuid = foundData.uuid
                    } else {
                        uuid = $UUID.randomUUID()
                        global.terminals.push({
                            uuid: uuid,
                            pos: realPosLong,
                            shipPos: localPosLong
                        })
                    }

                    be.persistentData.putUUID("pid", uuid)
                    be.setChanged()
                    return
                }

                uuid = be.persistentData.getUUID("pid")
                let foundData = global.terminals.find(obj => {
                    return obj.uuid.toString() == uuid.toString()
                })

                if (foundData != null) {
                    if (foundData.pos != realPosLong) foundData.pos = realPosLong
                    if (foundData.shipPos != localPosLong) foundData.shipPos = localPosLong
                } else {
                    global.terminals.push({
                        uuid: uuid,
                        pos: realPosLong,
                        shipPos: localPosLong
                    })
                }

                let mode = be.persistentData.getInt("mode")
                if (mode == 0) {
                    let currentEnergy = be.persistentData.getInt("energy")
                    let maxEnergy = global.config.EnergyTransportTerminal.maxStoredEnergy

                    if (currentEnergy < maxEnergy) {
                        EnergyTransportTerminalBlock.chargeFromNetwork(be, realPosLong)
                    }
                }
            }
            )
    }

EnergyTransportTerminalBlock.defaultState =
    function (
    /** @type {Internal.BlockStateModifyCallbackJS} */ state
    ) {
        state.set(BlockProperties.POWERED, false)
    }

EnergyTransportTerminalBlock.chargeFromNetwork =
    function (
        /** @type {Internal.BlockEntityJS} */ selfBe,
        /** @type {number} */ selfWorldPosLong
    ) {
        let level = selfBe.level
        let selfUuid = selfBe.persistentData.getUUID("pid").toString()
        let selfPos = BlockPos.of(selfWorldPosLong)

        let spaceNeeded = global.config.EnergyTransportTerminal.maxStoredEnergy - selfBe.persistentData.getInt("energy")
        if (spaceNeeded <= 0) return

        for (let target of global.terminals) {
            if (target.uuid.toString() == selfUuid) continue
            let targetPos = BlockPos.of(target.pos)
            let dist = targetPos.distToCenterSqr(selfPos.x, selfPos.y, selfPos.z)
            if (dist > Math.pow(global.config.EnergyTransportTerminal.maxDistance, 2)) continue

            let targetLocalPos = BlockPos.of(target.shipPos)
            if (!level.isLoaded(targetLocalPos)) continue

            let targetBe = level.getBlockEntity(targetLocalPos)

            if (targetBe && targetBe.type == selfBe.type) {
                let targetMode = targetBe.persistentData.getInt("mode")
                if (targetMode != 1) continue

                let targetEnergy = targetBe.persistentData.getInt("energy")
                if (targetEnergy > 0) {
                    let transferAmount = Math.min(global.config.EnergyTransportTerminal.energyPerRequest, spaceNeeded, targetEnergy)

                    EnergyTransportTerminalBlock.extractEnergy(targetBe, transferAmount, false)
                    EnergyTransportTerminalBlock.receiveEnergy(selfBe, transferAmount, false)

                    targetBe.setChanged()
                    selfBe.setChanged()

                    spaceNeeded -= transferAmount
                    if (spaceNeeded <= 0) break
                }
            }
        }
    }

/** @returns {number} */
EnergyTransportTerminalBlock.extractEnergy =
    function (
        /** @type {Internal.BlockEntityJS} */ be,
        /** @type {number} */ amount,
        /** @type {boolean} */ simulate
    ) {
        let energy = be.persistentData.getInt("energy")
        let extracted = Math.min(energy, amount)
        if (!simulate) {
            be.persistentData.putInt("energy", energy - extracted)
        }
        return extracted
    }

/** @returns {number} */
EnergyTransportTerminalBlock.receiveEnergy =
    function (
        /** @type {Internal.BlockEntityJS} */ be,
        /** @type {number} */ amount,
        /** @type {boolean} */ simulate
    ) {
        let energy = be.persistentData.getInt("energy")
        let received = Math.min(global.config.EnergyTransportTerminal.maxStoredEnergy - energy, amount)
        if (!simulate) {
            be.persistentData.putInt("energy", energy + received)
        }
        return received
    }