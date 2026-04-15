function FillerProjectileEntity() { }

FillerProjectileEntity.item =
    function (
    /** @type {Internal.ProjectileItemBuilder} */ builder,
    /** @type {number} */ type
    ) {
        builder
            .use((level, player, hand) => this.use(level, player, hand))
            .canThrow(true)
            .projectileVelocity(1.5)
            .displayName(type == 1 ? "发泡手榴弹(填补型)" : "发泡手榴弹(扩展型)")
    }

/** @returns {boolean} */
FillerProjectileEntity.use =
    function (
        /** @type {Internal.Level} */ level,
        /** @type {Internal.Player} */ player,
        /** @type {Internal.InteractionHand} */ hand
    ) {
        let itemInHand = player.getItemInHand(hand)
        player.getCooldowns().addCooldown(itemInHand, 60)

        return true
    }

FillerProjectileEntity.onHitBlock =
    function (
        /** @type {Internal.ContextUtils$ProjectileBlockHitContext} */ context,
        /** @type {number} */ type
    ) {
        let { result, entity } = context
        let { blockPos, direction } = result
        let { level, server } = entity
        if (level.clientSide) return

        let placeBlockId = `kubejs:filler_block_${type}`
        let controller = level.getBlock(blockPos).offset(direction)
        controller.set(placeBlockId)
        let data = controller.entity.persistentData
        data.xList = [0]
        data.yList = [0]
        data.zList = [0]
        data.front = 0
        data.filledCount = 0

        try {
            global.fillingBlock(controller, server, type)
        } catch (error) {
            console.error(`填充方块时发生异常 [Type: ${type}]: ${error}`)
        }
    }