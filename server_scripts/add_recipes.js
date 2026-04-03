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

    

    //代币配方
    event.shapeless('4x minecraft:diamond', '4x #kjs:spore_tissue_t1')

    event.shapeless('6x minecraft:diamond', ['2x #kjs:spore_tissue_t1', '2x #kjs:spore_tissue_t2'])

    event.recipes.createSequencedAssembly([
        Item.of('16x minecraft:diamond').withChance(0.9),//这个是权重
        Item.of('#kjs:spore_tissue_t1').withChance(0.06), Item.of('#kjs:spore_tissue_t2').withChance(0.01), Item.of('#kjs:spore_tissue_t3').withChance(0.03)],
        '#kjs:spore_tissue_t2', [
        event.recipes.createDeploying('minecraft:diamond', ['minecraft:diamond', '#kjs:spore_tissue_t1']),
        event.recipes.createFilling('minecraft:diamond', ['minecraft:diamond', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('minecraft:diamond', ['minecraft:diamond', '#kjs:spore_tissue_t3']),
        event.recipes.createFilling('minecraft:diamond', ['minecraft:diamond', Fluid.of('create_things_and_misc:slime', 250)]),
        event.recipes.createDeploying('minecraft:diamond', ['minecraft:diamond', '#kjs:spore_tissue_t1']),
        event.recipes.createPressing('minecraft:diamond', 'minecraft:diamond')
    ]).transitionalItem('minecraft:diamond').loops(3)//分别为循环装配的物品id和装配次数
})