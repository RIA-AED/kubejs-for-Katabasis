/**
 * 提供含有权重的指定物品标签中的所有物品
 * @param  {String} tag 物品标签名
 * @param  {Number} chance 物品出现的概率权重
 * @return {Internal.Item[]} 含有指定物品标签中所有物品的数组，每个物品都有一个概率权重
 */
function itemsOfTag(tag, chance) {
    return Ingredient.of(tag).itemIds.map(id =>
        Item.of(id).withChance(chance)
    )
}

/**
 * 提供含有权重的指定物品正则表达式中的所有物品
 * @param  {RegExp} regExp 物品正则表达式
 * @param  {Number} chance 物品出现的概率权重
 * @return {Internal.Item[]} 含有指定物品正则表达式中所有物品的数组，每个物品都有一个概率权重
 */
function itemsOfRegex(regExp, chance) {
    return Ingredient.all.itemIds
        .filter(id => regExp.test(id))
        .map(id => Item.of(id).withChance(chance))
}

LootJS.modifiers((event) => {
    event.addLootTableModifier('katabasis:chests/abc').pool((pool) => {
        pool.rolls([1,27])
        pool.randomChance(0.5).addWeightedLoot(
            itemsOfRegex(/:[a-zA-Z0-9]+_log$/, 12.5)
        ).limitCount([16,48])
    })
})