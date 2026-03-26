LootJS.modifiers((event) => {
    event.addLootTableModifier('katabasis:chests/abc').pool((pool) => {
        pool.rolls([6,10])
        pool.randomChance(1).addLoot([
                Item.of('32x minecraft:oak_log').withChance(12.5),
                Item.of('32x minecraft:spruce_log').withChance(12.5),
                Item.of('32x minecraft:birch_log').withChance(12.5),
                Item.of('32x minecraft:jungle_log').withChance(12.5),
                Item.of('32x minecraft:acacia_log').withChance(12.5),
                Item.of('32x minecraft:mangrove_log').withChance(12.5),
                Item.of('32x minecraft:dark_oak_log').withChance(12.5),
                Item.of('32x minecraft:cherry_log').withChance(12.5),
            ])
    })
})