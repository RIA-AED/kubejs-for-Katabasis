ItemEvents.rightClicked("kubejs:copter",event=>{
    if(event.player.getItemInHand(event.getHand())=="kubejs:copter" &&
        event.player.cooldowns.isOnCooldown("kubejs:copter"))
        return
    event.player.addMotion(0,1.5,0)
})