function itemsOfTag(input) {
    let items = []
    Ingredient.of(input).itemIds.forEach(id => {
        items.push(Item.of(id))
    })
    return items;
}

LootJS.modifiers((event) => {
    event.addLootTableModifier('katabasis:chests/logs_1').pool((pool) => {//原木箱子1
        pool.rolls([12,20])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag(/^(?!.*hollow)(?!.*stripped)(?!.*rotten)(?!.*charred).*_log$/))
            .limitCount([20,44])
    })

    event.addLootTableModifier('katabasis:chests/stones_1').pool((pool) => {//石头箱子1
        pool.rolls([12,20])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:cobblestone').withChance(25),
                Item.of('minecraft:tuff').withChance(25),
                Item.of('minecraft:andesite').withChance(25),
                Item.of('minecraft:deepslate').withChance(25)
            ])
            .limitCount([1,64])
    })

    event.addLootTableModifier('katabasis:chests/locometals_1').pool((pool) => {//机车铁块箱子1
        pool.rolls([12,20])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag(/^(?!.*flat).*riveted_locometal$/))
            .limitCount([32,64])
    })

    event.addLootTableModifier('katabasis:chests/basic_food_1').pool((pool) => {//食物箱1（荤
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag('#kitchenkarrot:raw_meat'))
            .limitCount([10,30])
    })

    event.addLootTableModifier('katabasis:chests/basic_food_2').pool((pool) => {//食物箱2（素
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag('#forge:vegetables'))
            .limitCount([10,30])
    })
    event.addLootTableModifier('katabasis:chests/basic_food_2').pool((pool) => {//食物箱2（素
        pool.rolls([1,1])
            .randomChance(0.3)
            .addWeightedLoot([Item.of('minecraft:apple')])
            .limitCount([10,30])
    })

    event.addLootTableModifier('katabasis:chests/basic_food_3').pool((pool) => {//食物箱3（种子
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag('#forge:grain'))
            .limitCount([10,30])
    })
    event.addLootTableModifier('katabasis:chests/basic_food_3').pool((pool) => {//食物箱3（种子
        pool.rolls([4,8])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag('#forge:seeds'))
            .limitCount([4,12])
    })
    event.addLootTableModifier('katabasis:chests/basic_food_3').pool((pool) => {//食物箱3（种子
        pool.rolls([4,8])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag('#quark:seed_pouch_holdable'))
            .limitCount([4,12])
    })

    event.addLootTableModifier('katabasis:chests/basic_aid_1').pool((pool) => {//基础药物箱1
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:healing"}').withChance(24),//生命恢复
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:regeneration"}').withChance(24),//再生
                Item.of('tactical_aid:quickactioninjector').withChance(24),//小血针
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:night_vision"}').withChance(4),
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:leaping"}').withChance(4),
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:fire_resistance"}').withChance(4),
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:swiftness"}').withChance(4),                
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:strength"}').withChance(4),
                Item.of('minecraft:splash_potion', '{Potion:"minecraft:slow_falling"}').withChance(4),
                Item.of('minecraft:splash_potion', '{Potion:"quark:resilience"}').withChance(4)
            ])
    })

    event.addLootTableModifier('katabasis:chests/common_aid_1').pool((pool) => {//普通药物箱1
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:golden_apple').withChance(6),
                Item.of('immersive_weathering:golden_moss_clump').withChance(6),
                Item.of('tactical_aid:relief_injector').withChance(24),
                Item.of('tactical_aid:quickactioninjector_ii').withChance(24),
                Item.of('tactical_aid:painlessinjector').withChance(9),
                Item.of('tactical_aid:metabolizeinjector').withChance(18),
                Item.of('tactical_aid:adrenalineinjector').withChance(9),
                Item.of('tactical_aid:nanometre_particlesinjector').withChance(3),
                Item.of('tactical_aid:glucoseinjector').withChance(1)
            ])
    })

    event.addLootTableModifier('katabasis:chests/rare_aid_1').pool((pool) => {//稀有药物箱1
        pool.rolls([8,12])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:enchanted_golden_apple').withChance(5),
                Item.of('immersive_weathering:enchanted_golden_moss_clump').withChance(5),
                Item.of('tactical_aid:aggressivenessinjector').withChance(18),
                Item.of('tactical_aid:quickactioninjector_ii').withChance(18),
                Item.of('tactical_aid:painlessinjector').withChance(10),
                Item.of('tactical_aid:metabolizeinjector').withChance(15),
                Item.of('tactical_aid:adrenalineinjector').withChance(7),
                Item.of('tactical_aid:adrenalineinjector_ii').withChance(7),
                Item.of('tactical_aid:adrenalineinjector_iii').withChance(7),
                Item.of('tactical_aid:nanometre_particlesinjector').withChance(5),
                Item.of('tactical_aid:glucoseinjector').withChance(3)
            ])
    })

    event.addLootTableModifier('katabasis:chests/basic_gun_1').pool((pool) => {//安山武器箱
        pool.rolls([20,28])
            .randomChance(1)
            .addWeightedLoot([                
                Item.of('pointblank:dart').withChance(65),
                Item.of('pointblank:shrapnel').withChance(20),
                
                Item.of('minecraft:iron_ingot').withChance(5),
                Item.of('minecraft:copper_ingot').withChance(5),
                Item.of('minecraft:gunpowder').withChance(5)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/basic_gun_1').pool((pool) => {
        pool.rolls([1,1])
            .randomChance(0.5)
            .addWeightedLoot([                
                Item.of('pointblank:st_beca'),
                Item.of('pointblank:st_sandstorm'),
                Item.of('pointblank:st_rasword'),
                Item.of('pointblank:st_snake_strike'),
                Item.of('pointblank:st_stifle')
            ])
    })
    event.addLootTableModifier('katabasis:chests/basic_gun_1').pool((pool) => {
        pool.rolls([1,3])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag('#katabasis:firearm_accessories'))
    })
    event.addLootTableModifier('katabasis:chests/basic_gun_1').pool((pool) => {
        pool.rolls([1,2])
            .randomChance(0.05)
            .addWeightedLoot([
                Item.of('pointblank:x_protocol').withChance(33),
                Item.of('pointblank:x_brute').withChance(33),
                Item.of('pointblank:x_cross_star').withChance(34)
            ])
    })

    event.addLootTableModifier('katabasis:chests/common_gun_1').pool((pool) => {//黄铜武器箱
        pool.rolls([20,28])
            .randomChance(1)
            .addWeightedLoot([                
                Item.of('pointblank:whistle_max').withChance(30),
                Item.of('pointblank:whistle_nor').withChance(30),
                Item.of('pointblank:shrapnel').withChance(15),
                Item.of('pointblank:cased_telescoped_ammunition').withChance(5),
                Item.of('pointblank:rocket').withChance(5),

                Item.of('minecraft:iron_ingot').withChance(5),
                Item.of('minecraft:copper_ingot').withChance(5),
                Item.of('minecraft:gunpowder').withChance(4),
                Item.of('pointblank:grenade').withChance(1)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/common_gun_1').pool((pool) => {
        pool.rolls([1,1])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag(/^pointblank:cr_/))
    })
    event.addLootTableModifier('katabasis:chests/common_gun_1').pool((pool) => {
        pool.rolls([1,3])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag('#katabasis:firearm_accessories'))
    })
    event.addLootTableModifier('katabasis:chests/common_gun_1').pool((pool) => {
        pool.rolls([1,2])
            .randomChance(0.05)
            .addWeightedLoot([
                Item.of('pointblank:x_surge').withChance(33),
                Item.of('pointblank:x_dila').withChance(33),
                Item.of('pointblank:x_guard').withChance(34)
            ])
    })

    event.addLootTableModifier('katabasis:chests/rare_gun_1').pool((pool) => {//魔能武器箱
        pool.rolls([20,28])
            .randomChance(1)
            .addWeightedLoot([                
                Item.of('pointblank:hotmagiccore').withChance(80),

                Item.of('minecraft:iron_ingot').withChance(6),
                Item.of('minecraft:copper_ingot').withChance(6),
                Item.of('minecraft:gunpowder').withChance(6),
                Item.of('pointblank:grenade').withChance(2)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/rare_gun_1').pool((pool) => {
        pool.rolls([1,1])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag(/^pointblank:e_/))
    })
    event.addLootTableModifier('katabasis:chests/rare_gun_1').pool((pool) => {
        pool.rolls([1,3])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag('#katabasis:firearm_accessories'))
    })
    event.addLootTableModifier('katabasis:chests/rare_gun_1').pool((pool) => {
        pool.rolls([1,2])
            .randomChance(0.05)
            .addWeightedLoot([
                Item.of('pointblank:x_medusa').withChance(50),
                Item.of('pointblank:x_medusa').withChance(50)
            ])
    })

    event.addLootTableModifier('katabasis:chests/epic_gun_1').pool((pool) => {//实验武器箱
        pool.rolls([20,28])
            .randomChance(1)
            .addWeightedLoot([                
                Item.of('pointblank:whistle_max').withChance(25),
                Item.of('pointblank:whistle_nor').withChance(25),
                Item.of('pointblank:meb').withChance(5),
                Item.of('pointblank:dart').withChance(25),
                Item.of('pointblank:dartsheaf').withChance(10),
                Item.of('pointblank:shrapnel').withChance(10),

                Item.of('minecraft:iron_ingot').withChance(5),
                Item.of('minecraft:copper_ingot').withChance(5),
                Item.of('minecraft:gunpowder').withChance(5)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/epic_gun_1').pool((pool) => {
        pool.rolls([1,1])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag(/^pointblank:x_/))
    })
    event.addLootTableModifier('katabasis:chests/epic_gun_1').pool((pool) => {
        pool.rolls([1,3])
            .randomChance(0.5)
            .addWeightedLoot(itemsOfTag('#katabasis:firearm_accessories'))
    })

    event.addLootTableModifier('katabasis:chests/powerengine_1').pool((pool) => {//基础药物箱1
        pool.rolls([4,6])
            .randomChance(0.8)
            .addWeightedLoot([
                Item.of('protection_pixel:powerengine').withChance(20),
                Item.of('protection_pixel:flarerod', '{Damage:0}').withChance(40),
                Item.of('protection_pixel:emptywatertank').withChance(40),
            ])
    })
    event.addLootTableModifier('katabasis:chests/powerengine_1').pool((pool) => {
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:blaze_rod').withChance(15),
                Item.of('create:andesite_alloy').withChance(30),
                Item.of('minecraft:copper_ingot').withChance(30),                
                Item.of('create:brass_ingot').withChance(25)
            ])
            .limitCount([12,20])
    })

    event.addLootTableModifier('katabasis:chests/driver_armor_1').pool((pool) => {//驱动装备
        pool.rolls([8,16])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('create:cogwheel').withChance(15),
                Item.of('create:andesite_alloy').withChance(15),
                Item.of('minecraft:iron_ingot').withChance(15),                
                Item.of('create:brass_ingot').withChance(15),

                Item.of('protection_pixel:maneuveringwing', '{Damage:0}').withChance(2),
                Item.of('protection_pixel:tacticaloxygensupplydevice', '{Damage:0}').withChance(2),
                Item.of('protection_pixel:heatpulsethruster', '{Damage:0}').withChance(2),                
                Item.of('protection_pixel:steambooster', '{Damage:0}').withChance(2),
                Item.of('protection_pixel:pneumaticgrenadelauncharm').withChance(2),

                Item.of('protection_pixel:ironarmorplate', '{Damage:0,armor:1.0d,toughness:0.0d,weight:1.0d}').withChance(7),
                Item.of('protection_pixel:brassarmorplate', '{Damage:0,armor:2.0d,toughness:1.0d,weight:2.0d}').withChance(9),
                Item.of('protection_pixel:alloyarmorplate', '{Damage:0,armor:2.0d,toughness:1.0d,weight:1.5d}').withChance(9),
                Item.of('protection_pixel:armorplatekit', '{Damage:0}').withChance(3),
                Item.of('protection_pixel:equipmentkit', '{Damage:0}').withChance(2)
            ])
            .limitCount([12,20])
    })

    event.addLootTableModifier('katabasis:chests/common_armor_1').pool((pool) => {//黄铜动力甲
        pool.rolls([8,12])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('create:cogwheel').withChance(15),
                Item.of('create:andesite_alloy').withChance(15),
                Item.of('minecraft:iron_ingot').withChance(15),                
                Item.of('create:brass_ingot').withChance(15),
                
                Item.of('protection_pixel:socks_boots', '{Damage:0}').withChance(5),
                Item.of('protection_pixel:ironarmorplate', '{Damage:0,armor:1.0d,toughness:0.0d,weight:1.0d}').withChance(20),
                Item.of('protection_pixel:brassarmorplate', '{Damage:0,armor:2.0d,toughness:1.0d,weight:2.0d}').withChance(10),
                Item.of('protection_pixel:armorplatekit', '{Damage:0}').withChance(3),
                Item.of('protection_pixel:equipmentkit', '{Damage:0}').withChance(2)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/common_armor_1').pool((pool) => {
        pool.rolls([2,3])
            .randomChance(0.6)
            .addWeightedLoot(itemsOfTag('#protection_pixel:brass'))
    })

    event.addLootTableModifier('katabasis:chests/rare_armor_1').pool((pool) => {//合金动力甲
        pool.rolls([8,12])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('create:cogwheel').withChance(15),
                Item.of('create:andesite_alloy').withChance(10),
                Item.of('minecraft:iron_ingot').withChance(10),                
                Item.of('create:brass_ingot').withChance(15),
                
                Item.of('protection_pixel:socks_boots', '{Damage:0}').withChance(5),
                Item.of('protection_pixel:ironarmorplate', '{Damage:0,armor:1.0d,toughness:0.0d,weight:1.0d}').withChance(10),
                Item.of('protection_pixel:brassarmorplate', '{Damage:0,armor:2.0d,toughness:1.0d,weight:2.0d}').withChance(20),
                Item.of('protection_pixel:alloyarmorplate', '{Damage:0,armor:2.0d,toughness:1.0d,weight:1.5d}').withChance(10),
                Item.of('protection_pixel:armorplatekit', '{Damage:0}').withChance(3),
                Item.of('protection_pixel:equipmentkit', '{Damage:0}').withChance(2)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/rare_armor_1').pool((pool) => {
        pool.rolls([2,3])
            .randomChance(0.6)
            .addWeightedLoot(itemsOfTag('#protection_pixel:alloy'))
    })

    event.addLootTableModifier('katabasis:chests/enchanted_book').pool((pool) => {//附魔书箱
        pool.rolls([2,3])
            .randomChance(0.6)
            .addWeightedLoot(['minecraft:book'])
            .enchantRandomly()
    })
    event.addLootTableModifier('katabasis:chests/enchanted_book').pool((pool) => {
        pool.rolls([8,12])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:redstone').withChance(20),
                Item.of('minecraft:lapis_lazuli').withChance(20),
                Item.of('minecraft:paper').withChance(20),                
                Item.of('minecraft:book').withChance(20),
                Item.of('minecraft:experience_bottle').withChance(20)
            ])
            .limitCount([12,36])
    })

    event.addLootTableModifier('katabasis:chests/supplementaries_cannon_1').pool((pool) => {//锦致装饰炮
        pool.rolls([8,12])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:tnt').withChance(35),
                Item.of('minecraft:sand').withChance(30),                
                Item.of('minecraft:gunpowder').withChance(35)
            ])
            .limitCount([12,36])
    })
    event.addLootTableModifier('katabasis:chests/supplementaries_cannon_1').pool((pool) => {
        pool.rolls([1,3])
            .randomChance(0.4)
            .addWeightedLoot([
                Item.of('supplementaries:cannon')
            ])
    })

    event.addLootTableModifier('katabasis:chests/basic_cbc_1').pool((pool) => {//火炮底座
        pool.rolls([6,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('createbigcannons:cannon_mount').withChance(25),
                Item.of('createbigcannons:cannon_mount_extension').withChance(20),                
                Item.of('createbigcannons:fixed_cannon_mount').withChance(25),
                Item.of('createbigcannons:ram_rod').withChance(15),                
                Item.of('createbigcannons:worm').withChance(15)
            ])
    })
    event.addLootTableModifier('katabasis:chests/basic_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('minecraft:gunpowder'),
                Item.of('create:iron_sheet')
            ])
            .limitCount([12,20])
    })

    event.addLootTableModifier('katabasis:chests/common_cbc_1').pool((pool) => {//铸铁火炮
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot([
                Item.of('createbigcannons:powder_charge').withChance(40),
                Item.of('createbigcannons:big_cartridge', '{Power:2}').withChance(30),
                Item.of('createbigcannons:big_cartridge', '{Power:3}').withChance(20),
                Item.of('createbigcannons:big_cartridge', '{Power:4}').withChance(10)
            ])
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/common_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot(itemsOfTag('#createbigcannons:big_cannon_projectiles'))
            .addWeightedLoot(itemsOfTag('#createbigcannons:fuzes'))
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/common_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot([
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:flak_autocannon_round"}}'),
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:ap_autocannon_round"}}')
            ])
            .limitCount([36,60])
    })
    event.addLootTableModifier('katabasis:chests/common_cbc_1').pool((pool) => {
        pool.rolls([16,20])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag(/^createbigcannons:cast_iron.*(quickfiring_breech|cannon_chamber|cannon_barrel|autocannon_breech|autocannon_recoil_spring|autocannon_barrel)$/))
    })

    event.addLootTableModifier('katabasis:chests/rare_cbc_1').pool((pool) => {//青铜火炮
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot([
                Item.of('createbigcannons:powder_charge').withChance(40),
                Item.of('createbigcannons:big_cartridge', '{Power:2}').withChance(30),
                Item.of('createbigcannons:big_cartridge', '{Power:3}').withChance(20),
                Item.of('createbigcannons:big_cartridge', '{Power:4}').withChance(10)
            ])
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/rare_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot(itemsOfTag('#createbigcannons:big_cannon_projectiles'))
            .addWeightedLoot(itemsOfTag('#createbigcannons:fuzes'))
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/rare_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot([
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:flak_autocannon_round"}}'),
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:ap_autocannon_round"}}')
            ])
            .limitCount([36,60])
    })
    event.addLootTableModifier('katabasis:chests/rare_cbc_1').pool((pool) => {
        pool.rolls([16,20])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag(/^createbigcannons:bronze.*(quickfiring_breech|cannon_chamber|cannon_barrel|autocannon_breech|autocannon_recoil_spring|autocannon_barrel)$/))
    })

    event.addLootTableModifier('katabasis:chests/epic_cbc_1').pool((pool) => {//钢制火炮
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot([
                Item.of('createbigcannons:powder_charge').withChance(40),
                Item.of('createbigcannons:big_cartridge', '{Power:2}').withChance(30),
                Item.of('createbigcannons:big_cartridge', '{Power:3}').withChance(20),
                Item.of('createbigcannons:big_cartridge', '{Power:4}').withChance(10)
            ])
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/epic_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot(itemsOfTag('#createbigcannons:big_cannon_projectiles'))
            .addWeightedLoot(itemsOfTag('#createbigcannons:fuzes'))
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/epic_cbc_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(0.6)
            .addWeightedLoot([
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:flak_autocannon_round"}}'),
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:ap_autocannon_round"}}')
            ])
            .limitCount([36,60])
    })
    event.addLootTableModifier('katabasis:chests/epic_cbc_1').pool((pool) => {
        pool.rolls([16,20])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag(/^createbigcannons:steel.*(quickfiring_breech|cannon_chamber|cannon_barrel|autocannon_breech|autocannon_recoil_spring|autocannon_barrel)$/))
    })

    event.addLootTableModifier('katabasis:chests/shell_1').pool((pool) => {//炮弹箱
        pool.rolls([8,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('createbigcannons:powder_charge').withChance(40),
                Item.of('createbigcannons:big_cartridge', '{Power:2}').withChance(30),
                Item.of('createbigcannons:big_cartridge', '{Power:3}').withChance(20),
                Item.of('createbigcannons:big_cartridge', '{Power:4}').withChance(10)
            ])
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/shell_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(1)
            .addWeightedLoot(itemsOfTag('#createbigcannons:big_cannon_projectiles'))
            .addWeightedLoot(itemsOfTag('#createbigcannons:fuzes'))
            .limitCount([12,20])
    })
    event.addLootTableModifier('katabasis:chests/shell_1').pool((pool) => {
        pool.rolls([8,10])
            .randomChance(1)
            .addWeightedLoot([
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:flak_autocannon_round"}}'),
                Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:ap_autocannon_round"}}')
            ])
            .limitCount([36,60])
    })
})
