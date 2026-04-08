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
        event.recipes.createDeploying('kubejs:spore_biomass',['kubejs:spore_biomass','#katabasis:spore_tissue_t1']),
        event.recipes.createFilling('kubejs:spore_biomass', ['kubejs:spore_biomass', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('kubejs:spore_biomass',['kubejs:spore_biomass','#katabasis:spore_tissue_t1']),
        event.recipes.createPressing('kubejs:spore_biomass', 'kubejs:spore_biomass')
    ]).transitionalItem('kubejs:spore_biomass').loops(1)
    //石化
    event.recipes.create.mixing('kubejs:fossilization_biomass',['kubejs:spore_biomass','16x #forge:stone',Fluid.of('create_things_and_misc:slime', 250)])
    //炭化
    event.recipes.create.mixing("kubejs:carbonization_biomass",['kubejs:spore_biomass','16x #minecraft:coals',Fluid.of('create_things_and_misc:slime', 250)])
    //纤维化
    event.recipes.createSequencedAssembly(
        'kubejs:fibrosis_biomass',
        "kubejs:carbonization_biomass", [
        event.recipes.createDeploying("kubejs:carbonization_biomass",["kubejs:carbonization_biomass",'minecraft:stick']),    
        event.recipes.createDeploying("kubejs:carbonization_biomass",["kubejs:carbonization_biomass",'kubejs:tumor']),
        event.recipes.createDeploying("kubejs:carbonization_biomass",["kubejs:carbonization_biomass",'minecraft:stick']), 
        event.recipes.createFilling("kubejs:carbonization_biomass", ["kubejs:carbonization_biomass", Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createPressing("kubejs:carbonization_biomass", "kubejs:carbonization_biomass")
    ]).transitionalItem("kubejs:carbonization_biomass").loops(1)
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

    //工业配方
    //火药
    event.recipes.create.crushing("32x minecraft:gunpowder",'kubejs:high_energy_biomass')
    //树苗
    Ingredient.of('#create:pulpifiable').itemIds.forEach(id => {
        event.recipes.create.cutting((Item.of(id)),'kubejs:fibrosis_biomass')
    })
})