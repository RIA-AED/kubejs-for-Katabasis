/**
 * 提供含有权重的指定物品标签中的所有物品
 * @param  {String} tag 物品标签名
 * @param  {Number} chance 物品出现的概率权重
 * @return {*[]} 含有指定物品标签中所有物品的数组，每个物品都有一个概率权重
 */

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