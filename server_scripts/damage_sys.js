
let armorTypeDivide = [40, 100]

let damageTypeDivide = [4.5, 9]

let midDamageList = ["pointblank:st_rasword"]

let midArmorList = ["spore:sieger"]

let damageMatrix = [
    [1, 0.7, 0],
    [1, 1, 0.5],
    [1, 1, 1]
]

EntityEvents.hurt(event => {
    let armorLevel = 0
    let damageLevel = 0
    if (event.entity.maxHealth >= armorTypeDivide[0]) armorLevel = 1
    if (event.entity.maxHealth >= armorTypeDivide[1]) armorLevel = 2
    if (event.damage >= damageTypeDivide[0]) damageLevel = 1
    if (event.damage >= damageTypeDivide[1]) damageLevel = 2

    if (event.entity.tags.contains("lightArmor")) armorLevel = 0
    if (event.entity.tags.contains("midArmor")) armorLevel = 1
    if (event.entity.tags.contains("heavyArmor")) armorLevel = 2

    if (event.entity.hasEffect("spore:corrosion")) armorLevel -= 1
    if (armorLevel < 0) armorLevel = 0

    let player = event.getSource().getPlayer()
    if (player) {
        midDamageList.forEach(it => {
            if (it == player.mainHandItem.id) {
                //event.server.tell(player.mainHandItem.id)
                damageLevel = 1
            }
        })
    }

    let factor = damageMatrix[damageLevel][armorLevel]

    //if (player) event.server.tell(factor)

    if (factor < 1 && factor != 0) {
        event.entity.heal(event.damage * (1 - factor))

        if (player) {
            playsound(event.server, player.block, "minecraft:block.bone_block.break", 2, 1)
        }
    }
    if (factor == 0) {
        event.entity.heal(event.damage)
        let player = event.getSource().getPlayer()
        if (player) {
            playsound(event.server, player.block, "minecraft:block.anvil.land", 0.5, 2)
        }
    }
})


midArmorList.forEach(it => {
    EntityEvents.spawned(it, event => {
        event.entity.addTag("midArmor")
    })
})
