function itemsOfTag(input) {
    let items = []
    Ingredient.of(input).itemIds.forEach(id => {
        items.push(Item.of(id).withChance(0.03))
    })
    return items;
}

ServerEvents.recipes(event => {
    //模组配方禁用
    event.remove({ mod: 'chinjufumod' })
    //event.remove({ mod: 'spore' })

    event.remove({output: 'pointblank:automationcomponent'})
    event.remove({output: 'pointblank:burstcomponent'})
    event.remove({output: 'pointblank:canisterconverter'})
    event.remove({output: 'pointblank:gunmetal_mesh'})
    event.remove({output: 'pointblank:gunmetal_ingot'})
    event.remove({output: 'pointblank:gunmetal_nugget'})
    event.remove({output: 'pointblank:printer'})
    event.remove({output: 'pointblank:processor'})

//生物质团配方
    //菌染
    event.shapeless('4x kubejs:spore_biomass', '4x #katabasis:spore_tissue_t1')
    event.shapeless('6x kubejs:spore_biomass', ['2x #katabasis:spore_tissue_t1', '2x #katabasis:spore_tissue_t2'])

    event.recipes.createSequencedAssembly([
        Item.of('16x kubejs:spore_biomass').withChance(0.9),//这个是权重
        Item.of('#katabasis:spore_tissue_t1').withChance(0.06), Item.of('#katabasis:spore_tissue_t2').withChance(0.01), Item.of('#katabasis:spore_tissue_t3').withChance(0.03)],
        '#katabasis:spore_tissue_t2', [
        event.recipes.createDeploying('kubejs:spore_biomass', ['kubejs:spore_biomass', '#katabasis:spore_tissue_t3']),
        event.recipes.createFilling('kubejs:spore_biomass', ['kubejs:spore_biomass', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('kubejs:spore_biomass', ['kubejs:spore_biomass', '#katabasis:spore_tissue_t1']),
        event.recipes.createFilling('kubejs:spore_biomass', ['kubejs:spore_biomass', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('kubejs:spore_biomass', ['kubejs:spore_biomass', '#katabasis:spore_tissue_t3']),
        event.recipes.createPressing('kubejs:spore_biomass', 'kubejs:spore_biomass')
    ]).transitionalItem('kubejs:spore_biomass').loops(3)//分别为循环装配的物品id和装配次数

    //活化
    event.recipes.createSequencedAssembly(
        'kubejs:activation_biomass',
        'kubejs:spore_biomass', [
        event.recipes.createFilling('kubejs:spore_biomass', ['kubejs:spore_biomass', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('kubejs:spore_biomass',['kubejs:spore_biomass','#katabasis:spore_tissue_t1']),
        event.recipes.createDeploying('kubejs:spore_biomass',['kubejs:spore_biomass','#katabasis:spore_tissue_t1']),
        event.recipes.createPressing('kubejs:spore_biomass', 'kubejs:spore_biomass')
    ]).transitionalItem('kubejs:spore_biomass').loops(1)
    //纤维化
    event.recipes.createSequencedAssembly(
        'kubejs:fibrosis_biomass',
        "kubejs:carbonization_biomass", [
        event.recipes.createFilling("kubejs:carbonization_biomass", ["kubejs:carbonization_biomass", Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying("kubejs:carbonization_biomass",["kubejs:carbonization_biomass",'minecraft:stick']),    
        event.recipes.createDeploying("kubejs:carbonization_biomass",["kubejs:carbonization_biomass",'kubejs:tumor']),
        event.recipes.createDeploying("kubejs:carbonization_biomass",["kubejs:carbonization_biomass",'minecraft:stick']), 
        event.recipes.createPressing("kubejs:carbonization_biomass", "kubejs:carbonization_biomass")
    ]).transitionalItem("kubejs:carbonization_biomass").loops(1)
    //钙化
    event.recipes.createSequencedAssembly(
        'kubejs:calcification_biomass',
        'kubejs:fossilization_biomass', [
        event.recipes.createFilling('kubejs:fossilization_biomass', ['kubejs:fossilization_biomass', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('kubejs:fossilization_biomass',['kubejs:fossilization_biomass','minecraft:bone_block']),    
        event.recipes.createPressing("kubejs:fossilization_biomass", "kubejs:fossilization_biomass"),
        event.recipes.createDeploying('kubejs:fossilization_biomass',['kubejs:fossilization_biomass','minecraft:bone_block']), 
        event.recipes.createPressing('kubejs:fossilization_biomass', 'kubejs:fossilization_biomass'),
        event.recipes.createDeploying('kubejs:fossilization_biomass',['kubejs:fossilization_biomass','minecraft:bone_block']), 
        event.recipes.createPressing('kubejs:fossilization_biomass', 'kubejs:fossilization_biomass')
    ]).transitionalItem('kubejs:fossilization_biomass').loops(1)
    //高能
    event.custom({
		"type": "createaddition:charging",
		"input": {
			"item": 'kubejs:fibrosis_biomass',
			"count": 1
		},
		"result": {
			"item": 'kubejs:high_energy_biomass',
			"count": 1,
		},
		"energy": 10000,
		"maxChargeRate": 1000
	})
    //石化
    event.recipes.create.mixing('kubejs:fossilization_biomass',['kubejs:spore_biomass','16x #forge:stone',Fluid.of('create_things_and_misc:slime', 250)])
    //炭化
    event.recipes.create.mixing("kubejs:carbonization_biomass",['kubejs:spore_biomass','16x #minecraft:coals',Fluid.of('create_things_and_misc:slime', 250)])


//道具配方
    //填补发泡
    event.shaped("kubejs:filler_block_1", [
		'ABA',
		'BCB',
		'ABA'
	], {
		A: 'minecraft:sand',
		B: 'minecraft:gravel',
        C:Item.of('protection_pixel:watertank', '{Damage:0}')
    })
    //扩展发泡
    event.shaped("kubejs:filler_block_2", [
		'ABA',
		'BCB',
		'ABA'
	], {
		B: 'minecraft:sand',
		A: 'minecraft:gravel',
        C:Item.of('protection_pixel:watertank', '{Damage:0}')
    })
    
    //空的机炮空投
    event.recipes.create.mechanical_crafting("kubejs:empty_cannon_drop", [
        "ABBBA",
        "CDDEC",
        "CDGFC",
        "AHIHA",
        " BJB "
    ], {
        A: 'kinetic_pixel:andesitealloycompressionsheet',B: 'alloyed:bronze_sheet',C: 'alloyed:steel_sheet',
        D:'createbigcannons:steel_autocannon_barrel',E:'createbigcannons:steel_autocannon_recoil_spring',F:'createbigcannons:steel_autocannon_breech',
        G:'minecraft:hopper',H:'minecraft:lever',I:'createbigcannons:cannon_mount',J:Item.of('minecraft:firework_rocket', '{Fireworks:{Flight:1b}}')
    })
    //机炮空投
    event.recipes.createSequencedAssembly(
        'kubejs:cannon_drop',
        "kubejs:empty_cannon_drop", [
        event.recipes.createDeploying("kubejs:empty_cannon_drop",["kubejs:empty_cannon_drop",Item.of('createbigcannons:autocannon_cartridge', '{Projectile:{Count:1b,id:"createbigcannons:flak_autocannon_round",tag:{Fuze:{Count:1b,id:"createbigcannons:impact_fuze"},Tracer:1b}}}')])
    ]).transitionalItem("kubejs:empty_cannon_drop").loops(64)

    //空的CDU空投
    event.recipes.create.mechanical_crafting('kubejs:empty_cdu_drop', [
        "ABBBA",
        "CHGHC",
        "CDFDC",
        "ADEDA",
        " BJB "
    ], {
        A: 'kinetic_pixel:andesitealloycompressionsheet',B: 'alloyed:bronze_sheet',C: 'alloyed:steel_sheet',
        D:'spore:compound_plate',E:'spore:circuit_board',F:'create:encased_fan',
        G:'create:nozzle',H:'spore:ice_canister',J:Item.of('minecraft:firework_rocket', '{Fireworks:{Flight:1b}}')
    })
    //CDU空投
    event.recipes.createSequencedAssembly(
        'kubejs:cdu_drop',
        'kubejs:empty_cdu_drop', [
        event.recipes.createDeploying('kubejs:empty_cdu_drop',['kubejs:empty_cdu_drop','minecraft:ice'])
    ]).transitionalItem('kubejs:empty_cdu_drop').loops(64)

//工业配方
    //骨头
    Ingredient.of(/(claw_fr|armor_fr|shield_fr|spine)/).itemIds.forEach(id => {
        event.shapeless('3x minecraft:bone',Item.of(id))
    })    
    //火药
    event.recipes.create.crushing("32x minecraft:gunpowder",'kubejs:high_energy_biomass')
    //树苗
    Ingredient.of('#create:pulpifiable').itemIds.forEach(id => {
        event.recipes.create.cutting((Item.of(id)),'kubejs:fibrosis_biomass')
    })
    //种子
    Ingredient.of('#forge:seeds').itemIds.forEach(id => {
        let a = id.toString().replace(':','/')
        event.recipes.create.crushing((Item.of(id)),'kubejs:fibrosis_biomass').id(`${a}_manual_only`)
    })
    //矿物
    Ingredient.of(/(electrum|:iron|gold|copper|zinc|brass)_nugget$/).itemIds.forEach(id => {
        event.recipes.create.mixing([Item.of(id,10),Fluid.of('minecraft:water', 250)],[Item.of(id),'kubejs:fossilization_biomass',Fluid.of('create_things_and_misc:slime', 250)])
    })
    //苔藓
    event.recipes.create.mixing(['8x immersive_weathering:moss_clump',Fluid.of('minecraft:water', 250)],['immersive_weathering:moss_clump','kubejs:activation_biomass',Fluid.of('create_things_and_misc:slime', 250)])
    //牛奶
    event.recipes.create.mixing(Fluid.of('minecraft:milk', 500),['kubejs:activation_biomass',Fluid.of('minecraft:milk', 250)])

//动力甲
    //盔甲挂架
    event.replaceInput({output:'protection_pixel:armorhanger'},'minecraft:shroomlight','quark:blaze_lantern')

    //燃料棒
    event.remove({output:Item.of('protection_pixel:flarerod', '{Damage:0}')})
    event.shaped(Item.of('protection_pixel:flarerod', '{Damage:0}'), [
		' BA',
		'BCB',
		'AB '
	], {
		A: 'kinetic_pixel:andesitealloycompressionsheet',
		B: 'minecraft:blaze_rod',
        C: 'kubejs:activation_biomass'
    })

    //胸甲内衬
    event.remove({output:'protection_pixel:chestplatelining'})
    event.shaped('protection_pixel:chestplatelining', [
		'ABA',
		'BCB',
		'DBD'
	], {
		A: 'createaddition:iron_rod',
		B: 'kubejs:calcification_biomass',
        C: Item.of('minecraft:iron_chestplate', '{Damage:0}'),
        D: 'kinetic_pixel:andesitealloycompressionsheet'
    })
    
    //腿甲内衬
    event.remove({output:'protection_pixel:leggingslining'})
    event.shaped('protection_pixel:leggingslining', [
		'ABA',
		'BCB',
		'DBD'
	], {
		D: 'createaddition:iron_rod',
		B: 'kubejs:calcification_biomass',
        C: Item.of('minecraft:iron_leggings', '{Damage:0}'),
        A: 'kinetic_pixel:andesitealloycompressionsheet'
    })

    //瘟疫头盔
    event.remove({output:Item.of('protection_pixel:plague_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:plague_helmet', '{Damage:0}'), [
        " ABA ",
        "CFEFC",
        "HDGDH",
        "AIJIA"
    ], {
        A: 'create:brass_sheet',B: 'create:brass_ingot',C: 'create:iron_sheet',
        F:'create:propeller',G:Item.of('minecraft:iron_helmet', '{Damage:0}'),D:'quark:framed_glass_pane',
        E:'spore:altered_spleen',H:'spore:fleshy_bone',I:'spore:plated_muscle',J:'spore:spine_fragment'
    })

    //枪骑兵头盔
    event.remove({output:Item.of('protection_pixel:lancer_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:lancer_helmet', '{Damage:0}'), [
        " ABA ",
        "AFGFA",
        "HDEDH",
        "AIJIA"
    ], {
        A: 'create:brass_sheet',B: 'create:brass_ingot',
        D:'quark:framed_glass_pane',E:Item.of('minecraft:iron_helmet', '{Damage:0}'),F:'spore:tendons',
        G:'create:cogwheel',H:'spore:fleshy_bone',I:'spore:plated_muscle',J:'spore:spine_fragment'
    })

    //锤头头盔
    event.remove({output:Item.of('protection_pixel:hammer_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:hammer_helmet', '{Damage:0}'), [
        " ABA ",
        "AFFFA",
        "HDEDH",
        "AIJIA"
    ], {
        A: 'create:brass_sheet',B: 'create:brass_ingot',
        D:'quark:framed_glass_pane',E:Item.of('minecraft:iron_helmet', '{Damage:0}'),F:'spore:armor_plate',
        H:'spore:fleshy_bone',I:'spore:plated_muscle',J:'spore:spine_fragment'
    })

    //捕猎者头盔
    event.remove({output:Item.of('protection_pixel:hunter_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:hunter_helmet', '{Damage:0}'), [
        "CA AC",
        " JBJ ",
        "HDEGH",
        "AIJIA"
    ], {
        A: 'create:brass_sheet',B: 'create:brass_ingot',C: 'createaddition:electrum_wire',
        D: 'spore:vigil_eye',E: 'minecraft:iron_helmet',
        G:'spore:nerves',H:'spore:fleshy_bone',I:'spore:plated_muscle',J:'spore:spine_fragment'
    })

    //全封闭头盔
    event.remove({output:Item.of('protection_pixel:closed_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:closed_helmet', '{Damage:0}'), [
        " DDD ",
        "DCBCD",
        "AJEJA",
        "AIJIA"
    ], {
        A: 'create:brass_sheet',B: 'create:brass_ingot',C: 'spore:alveolic_sack',
        D: 'minecraft:glass_pane',E: 'minecraft:iron_helmet',
        I:'spore:plated_muscle',J:'spore:spine_fragment'
    })

    //血囚头盔
    event.remove({output:Item.of('protection_pixel:bloodprisoner_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:bloodprisoner_helmet', '{Damage:0}'), [
        " ABA ",
        "FADAF",
        "HGEGH",
        "AIJIA"
    ], {
        A: 'create:brass_sheet',B: 'create:brass_ingot',
        D: 'quark:framed_glass_pane',E: 'minecraft:iron_helmet',F: 'kinetic_pixel:andesitealloycompressionsheet',
        G: 'spore:mutated_heart',I:'spore:plated_muscle',J:'spore:spine_fragment',H: 'spore:fleshy_bone'
    })

    //托萨奇头盔
    event.remove({output:Item.of('protection_pixel:tosaki_helmet', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:tosaki_helmet', '{Damage:0}'), [
        " ABA ",
        "FADAF",
        "HCEGH",
        "AIJIA"
    ], {
        A: 'protection_pixel:heatresistantceramicsheet',B: 'minecraft:iron_ingot',C:'quark:black_framed_glass_pane',
        D: 'spore:nerves',E: 'minecraft:iron_helmet',F: 'kinetic_pixel:andesitealloycompressionsheet',
        G: Item.of('spore:vigil_eye', '{Damage:0}'),I:'spore:plated_muscle',J:'spore:spine_fragment',H: 'spore:fleshy_bone'
    })

    //弹弓腿甲
    event.remove({output:Item.of('protection_pixel:slingshot_leggings', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:slingshot_leggings', '{Damage:0}'), [
        " FBF ",
        "AJDJA",
        "GG GG",
        "AI IA"
    ], {
        A: 'create:brass_sheet',B: 'spore:spine_fragment',
        D: 'protection_pixel:leggingslining',F: 'create:brass_ingot',
        G: 'spore:tendons',I:'spore:armor_plate',J:'spore:hardened_bind'
    })
    
    //锚点腿甲
    event.remove({output:Item.of('protection_pixel:anchorpoint_leggings', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:anchorpoint_leggings', '{Damage:0}'), [
        " FBF ",
        "AJDJA",
        "AG GA",
        "CI IC"
    ], {
        A: 'create:brass_sheet',B: 'spore:spine_fragment',C:'spore:spike',
        D: 'protection_pixel:leggingslining',F: 'create:brass_ingot',
        G: 'spore:plated_muscle',I:'spore:armor_plate',J:'spore:hardened_bind'
    })

    //浮力腿甲
    event.remove({output:Item.of('protection_pixel:buoyancy_leggings', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:buoyancy_leggings', '{Damage:0}'), [
        " FBF ",
        "AJDJA",
        "IG GI",
        "AC CA"
    ], {
        A: 'create:brass_sheet',B: 'spore:spine_fragment',C:'spore:wing_membrane',
        D: 'protection_pixel:leggingslining',F: 'create:brass_ingot',
        G: 'create:propeller',I:'spore:alveolic_sack',J:'spore:hardened_bind'
    })

    //托萨奇腿甲
    event.remove({output:Item.of('protection_pixel:tosaki_leggings', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:tosaki_leggings', '{Damage:0}'), [
        " FBF ",
        "AJDJA",
        "AG GA",
        "CI IC"
    ], {
        A: 'protection_pixel:heatresistantceramicsheet',B: 'spore:spine_fragment',C:'spore:wing_membrane',
        D: 'protection_pixel:leggingslining',F: 'minecraft:iron_ingot',
        G: 'spore:tendons',I:'spore:armor_plate',J:'spore:hardened_bind'
    })

    //破碎锤胸甲
    event.remove({output:Item.of('protection_pixel:breaker_chestplate', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:breaker_chestplate', '{Damage:0}'), [
        " AJA ",
        "ADBGA",
        "HIEIH",
        "AFJFA"
    ], {
        A: 'create:brass_sheet',B: 'spore:nerves',
        D:'spore:mutated_heart',E:'protection_pixel:chestplatelining',F:'spore:tendons',
        G:'spore:alveolic_sack',H:'spore:fleshy_claw',I:'spore:living_core',J:'spore:spine'
    })

    //棱翼胸甲
    event.remove({output:Item.of('protection_pixel:wingsofprism_chestplate', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:wingsofprism_chestplate', '{Damage:0}'), [
        " AJA ",
        "ADBGA",
        "HIEIH",
        "AFJFA"
    ], {
        A: 'create:brass_sheet',B: 'spore:nerves',
        D:'spore:mutated_heart',E:'protection_pixel:chestplatelining',F:'spore:tendons',
        G:'spore:alveolic_sack',H:'spore:fleshy_claw',I:'minecraft:sea_lantern',J:'spore:spine'
    })

    //工蜂胸甲
    event.remove({output:Item.of('protection_pixel:wingsofprism_chestplate', '{Damage:0}')})
    event.recipes.create.mechanical_crafting(Item.of('protection_pixel:wingsofprism_chestplate', '{Damage:0}'), [
        " AJA ",
        "ADBGA",
        "HIEIH",
        "AFJFA"
    ], {
        A: 'create:brass_sheet',B: 'spore:nerves',
        D:'spore:mutated_heart',E:'protection_pixel:chestplatelining',F:'spore:tendons',
        G:'spore:alveolic_sack',H:'spore:fleshy_claw',I:'minecraft:sea_lantern',J:'spore:spine'
    })
})