let allLores = [
    {
        title: "紧急通告1",
        text: [
            "我们注意到伊甸全域出现了全新的生物灾害",
            "它的生长速度、适应性和攻击性都是我们从未见过的",
            "而ae网络和所有依赖赛特斯石英的物品都已失效，我们已经来到了最危急的时候",
            "请所有人抛弃侥幸心理，做好最坏的打算"
        ]
    },
    {
        title: "紧急通告2",
        text: [
            "各自为战已经行不通了",
            "曾经的人口密集区都会生成雏形蜂巢思维，它们互相勾连，一张大网正在形成",
            "我们必须团结起来，只要真菌维持现在的强度，我们仍然有机会把它们完全清除"
        ]
    },
    {
        title: "真菌研究1",
        text: [
            "雏形蜂巢思维、菌染刷怪笼在被破坏时似乎会放出一种气体...",
            "新的菌染人类会随之生成，还会对人体造成损伤",
            "情况变得越来越棘手了..."
        ]
    }
]

ItemEvents.rightClicked("kubejs:posthumous_papers", event => {
    if (event.hand != "MAIN_HAND") return
    let lore = allLores[randint(0, allLores.length - 1)]
    event.player.tell(`————==${lore.title}==————`)
    let counter = 0
    lore.text.forEach(it => {
        event.server.scheduleInTicks(counter * 20, function (callback) {
            event.player.tell(`>${it}`)
        })
        counter += 1
    })
    event.server.scheduleInTicks(counter * 20, function (callback) {
        event.player.tell(`————————————————`)
    })
    event.player.addItemCooldown("kubejs:posthumous_papers", counter * 20)
    event.player.mainHandItem.count--
})