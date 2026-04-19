function getRandomInt() {
    const minCeiled = Math.ceil(1);
    const maxFloored = Math.floor(101);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

EntityEvents.hurt(event => {//圣光
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:aura_snake_strike') return
    event.entity.potionEffects.add('minecraft:instant_health', 1, 1)
})
EntityEvents.hurt(event => {//盛世
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:halcyon_k80') return
    event.entity.potionEffects.add('minecraft:absorption', 400, 1)
    event.entity.potionEffects.add('minecraft:regeneration', 200, 1)
})
EntityEvents.hurt(event => {//民团
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:posse_prism') return
    event.entity.potionEffects.add('minecraft:resistance', 2400, 0)
})
EntityEvents.hurt(event => {//昏暗
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:murky_cross_star') return
    event.entity.potionEffects.add('minecraft:resistance', 2400, 1)
    event.entity.potionEffects.add('minecraft:speed', 2400, 0)
    event.entity.potionEffects.add('minecraft:jump_boost', 2400, 0)
})

EntityEvents.hurt(event => {//盗墓者
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:ghoul_sar') return
    player.heal(1)
})

EntityEvents.hurt(event => {//偏振
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:polarized_flea'
        && player.mainHandItem.id != 'pointblank:polarized_medusa'
    ) return
    player.potionEffects.add('spore:corrosion', 100, 6)
})

EntityEvents.hurt(event => {//地蚀
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:umbra_stifle'
        && player.mainHandItem.id != 'pointblank:umbra_jpot_ii9'
        && player.mainHandItem.id != 'pointblank:umbra_vortex'
    ) return
    if (getRandomInt() > 95 && event.entity.hasEffect('spore:corrosion')) {
        event.entity.potionEffects.add('spore:corrosion', 200, 3)
    }
    if (event.entity.hasEffect('spore:corrosion')) return
    if (getRandomInt() < 20) {
        event.entity.potionEffects.add('spore:corrosion', 200, 1)
    }
})
EntityEvents.hurt(event => {//炼狱
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != "pointblank:inferno_rasword"
        && player.mainHandItem.id != "pointblank:inferno_shock"
        && player.mainHandItem.id != "pointblank:inferno_spark"
        && player.mainHandItem.id != "pointblank:inferno_protocol"
    ) return
    if (getRandomInt() >= 20) return
    event.entity.mergeNbt(`{Fire:200}`)
})
EntityEvents.hurt(event => {//骤停
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:fleeting_sandstorm'
        && player.mainHandItem.id != 'pointblank:fleeting_surge'
    ) return
    if (getRandomInt() > 95 && event.entity.hasEffect('minecraft:slowness')) {
        event.entity.potionEffects.add('minecraft:slowness', 200, 2)
    }
    if (event.entity.hasEffect('minecraft:slowness')) return
    if (getRandomInt() < 20) {
        event.entity.potionEffects.add('minecraft:slowness', 200, 0)
    }
})
EntityEvents.hurt(event => {//星爆
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:nova_guard') return
    event.entity.potionEffects.add('minecraft:instant_damage', 1, 1)
})
EntityEvents.hurt(event => {//折射
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:refraction_dila') return
    event.entity.potionEffects.add('minecraft:instant_damage', 1, 1)
})

EntityEvents.hurt(event => {//黑镜
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:rash_meteor_fist'
        && player.mainHandItem.id != 'pointblank:ghost_pulse'
    ) return
    if (getRandomInt() > 50) return
    event.entity.potionEffects.add('fractionandspore:chaos', 20, 18)
})
EntityEvents.hurt(event => {//辛迪加
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:syndicate_demeanour') return
    event.entity.removeAllEffects()
})