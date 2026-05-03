function getRandomInt() {
   const minCeiled = Math.ceil(1);
   const maxFloored = Math.floor(101);
   return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

EntityEvents.hurt(event => {//圣光
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:st_snake_strike_1') return
    event.entity.potionEffects.add('minecraft:instant_health', 1, 1)
})
EntityEvents.hurt(event => {//盛世
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:cr_k80_1') return
    event.entity.potionEffects.add('minecraft:absorption', 400, 1)
    event.entity.potionEffects.add('minecraft:regeneration', 200, 1)
})
EntityEvents.hurt(event => {//民团
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:e_prism_1') return
    event.entity.potionEffects.add('minecraft:resistance', 2400, 0)
})
EntityEvents.hurt(event => {//昏暗
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:x_cross_star_1') return
    event.entity.potionEffects.add('minecraft:resistance', 2400, 1)
    event.entity.potionEffects.add('minecraft:speed', 2400, 0)
    event.entity.potionEffects.add('minecraft:jump_boost', 2400, 0)
})

EntityEvents.hurt(event => {//盗墓者
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:cr_sar_1') return
    player.heal(1)
})

EntityEvents.hurt(event => {//偏振
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:cr_flea_1'
        && player.mainHandItem.id != 'pointblank:x_medusa_1'
    ) return
    player.potionEffects.add('spore:corrosion', 100, 6)
})

EntityEvents.hurt(event => {//地蚀
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:st_stifle_1'
        && player.mainHandItem.id != 'pointblank:cr_jpot_ii9_1'
        && player.mainHandItem.id != 'pointblank:e_vortex_1'
    ) return
    if (getRandomInt() > 95 && event.entity.hasEffect('spore:corrosion')){
        event.entity.potionEffects.add('spore:corrosion', 200, 3)
    }
    if (event.entity.hasEffect('spore:corrosion')) return
    if (getRandomInt() < 20){
        event.entity.potionEffects.add('spore:corrosion', 200, 1)
    }    
})
EntityEvents.hurt(event => {//炼狱
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != "pointblank:st_rasword_1"
        && player.mainHandItem.id != "pointblank:cr_shock_1"
        && player.mainHandItem.id != "pointblank:e_spark_1"
        && player.mainHandItem.id != "pointblank:x_protocol_1"
    ) return
    if (getRandomInt() >= 20) return
    event.entity.mergeNbt(`{Fire:200}`)
})
EntityEvents.hurt(event => {//骤停
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:st_sandstorm_1'
        && player.mainHandItem.id != 'pointblank:x_surge_1'
    ) return
    if (getRandomInt() > 95 && event.entity.hasEffect('minecraft:slowness')){
        event.entity.potionEffects.add('minecraft:slowness', 200, 2)
    }
    if (event.entity.hasEffect('minecraft:slowness')) return
    if (getRandomInt() < 20){
        event.entity.potionEffects.add('minecraft:slowness', 200, 0)
    } 
})
EntityEvents.hurt(event => {//星爆
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:x_guard_1') return
    event.entity.potionEffects.add('minecraft:instant_damage', 1, 1)
})

EntityEvents.hurt(event => {//折射
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:cr_meteor_fist_1'
        && player.mainHandItem.id != 'pointblank:x_dila_1'
    ) return
    if (getRandomInt() > 50) return
     event.entity.potionEffects.add('fractionandspore:chaos', 60, 18)
})
EntityEvents.hurt(event => {//辛迪加
    let player = event.getSource().getPlayer()
    if (!player) return
    if (player.mainHandItem.id != 'pointblank:cr_demeanour_1') return
    event.entity.removeAllEffects()
})