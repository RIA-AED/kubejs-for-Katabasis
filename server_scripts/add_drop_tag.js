// 定义要添加 drop_on_death 标签的物品列表
let itemsToTag = [
    "spore:claw",
    "spore:fleshy_bone",
    "spore:hardened_bind",
    "spore:fleshy_claw",
    "spore:living_core",
    "spore:cerebrum",
    "spore:spine",
    "spore:armor_plate",
    "spore:plated_muscle",
    "spore:fang",
    "spore:spike",
    "spore:shield_fragment",
    "spore:r_wing",
    "spore:tumor",
    "spore:sicken_tumor",
    "spore:calcified_tumor",
    "spore:bile_tumor",
    "spore:frozen_tumor",
    "spore:acidic_gland",
    "spore:amalgamated_heart",
    "spore:ligaments",
    "spore:fins",
    "spore:hyperbolized_liver",
    "spore:decayed_torso",
    "spore:tendons",
    "spore:nerves",
    "minecraft:shulker_box",
    "minecraft:white_shulker_box",
    "minecraft:light_gray_shulker_box",
    "minecraft:gray_shulker_box",
    "minecraft:black_shulker_box",
    "minecraft:brown_shulker_box",
    "minecraft:red_shulker_box",
    "minecraft:orange_shulker_box",
    "minecraft:yellow_shulker_box",
    "minecraft:lime_shulker_box",
    "minecraft:green_shulker_box",
    "minecraft:cyan_shulker_box",
    "minecraft:light_blue_shulker_box",
    "minecraft:blue_shulker_box",
    "minecraft:purple_shulker_box",
    "minecraft:magenta_shulker_box",
    "minecraft:pink_shulker_box",
    "spore:biomass"
];

// 使用 KubeJS 的 ServerEvents.tags 来创建/修改物品标签
ServerEvents.tags('item', event => {
    // 为每个物品添加 fractionandspore:drop_on_death 标签
    itemsToTag.forEach(itemId => {
        event.add('fractionandspore:drop_on_death', itemId);
    });
});

// 定义要添加 drop_on_death 标签的 Spore 物品标签列表
let sporeTagsToProcess = [
    'spore:amalgamated_biomass',
    'spore:biomass',
    'spore:body_parts',
    'spore:corrosive_parts',
    'spore:inf_parts',
    'spore:putrid_parts'
];

// 使用 KubeJS 的 ServerEvents.tags 来创建/修改物品标签
ServerEvents.tags('item', event => {
    let totalItems = 0;
    
    sporeTagsToProcess.forEach(tagId => {
        try {
            event.add('fractionandspore:drop_on_death', `#${tagId}`);
            totalItems++;
        } catch (e) {
            console.error(`[DropOnDeath] 处理标签 #${tagId} 时出错: ${e}`);
        }
    });
});

// 定义特殊武器列表
let specialWeapons = [
    'pointblank:cr_leveller',
    'pointblank:x_guard_1',
    'pointblank:warhammer',
    'pointblank:blackglass'
];

// 使用 KubeJS 的 ServerEvents.tags 来创建/修改物品标签
ServerEvents.tags('item', event => {
    specialWeapons.forEach(itemId => {
        event.add('fractionandspore:destroy_on_extraction', itemId);
    });
});