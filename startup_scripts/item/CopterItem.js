function CopterItem() { }

/** @returns {boolean} */
CopterItem.use =
    function (
        /** @type {Internal.Level} */ level,
        /** @type {Internal.Player} */ player,
        /** @type {Internal.InteractionHand} */ hand
    ) {
        if (level.clientSide) return true
        let { server, block } = player
        let itemInHand = player.getItemInHand(hand)

        server.runCommandSilent(`execute at @a[name=${player}] run effect give @a[name=${player}] minecraft:slow_falling 10 0 false`)
        server.runCommandSilent(`execute at @a[name=${player}] run particle cloud ${block.x} ${block.y} ${block.z} 1 1 1 0.25 200 normal`)
        player.addItemCooldown(itemInHand, 100)
        player.damageHeldItem(hand, 1)
        player.addMotion(0, 1.5, 0)
        player.hurtMarked = true

        try {
            server.runCommandSilent(`execute as ${player} at @s run playsound alloyed:bronze_bell player @a[distance=..20] ~ ~ ~ 1 1 1`)
            global.playsound(server, block, "protection_pixel:reactoroff", 1, 1)
        } catch (e) {
            console.error(e)
        }

        return true
    }