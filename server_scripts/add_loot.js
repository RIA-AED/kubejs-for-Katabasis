function itemsOfTag(tag, chance) {
    let items = []
    Ingredient.of(tag).itemIds.forEach(id => {
        items.push(Item.of(id).withChance(chance))
    })
    return items;
}

LootJS.modifiers((event) => {
    event.addLootTableModifier('katabasis:chests/abc').pool((pool) => {
        pool.rolls([1,27])
        pool.randomChance(0.5).addWeightedLoot(
            itemsOfTag('#minecraft:logs', 12.5)
        ).limitCount([16,48])
    })
})