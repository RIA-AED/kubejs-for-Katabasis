StartupEvents.registry('block', event => {
    event.create('drop_controller', "cardinal")
        // 碰撞箱：水平 3x3（-16到32像素，即-1格到+2格），高度1格（0到16像素）
        // 这样视觉上占据3x3空间，但注意实体可以穿过（见下方noCollision）
        .box(-16, 0, -16, 32, 16, 32)

        // 无实体碰撞：玩家、怪物、掉落物等可以直接穿过，不会推动或被阻挡
        .noCollision()

        // 透明材质渲染（支持alpha通道，类似玻璃/树叶）
        .defaultCutout()

        // 基础属性（可选，根据需求调整）
        .material('metal')           // 金属材质（挖掘声音）
        .hardness(3)                // 硬度
        .resistance(6)              // 爆炸抗性
        .requiresTool(true)         // 需要工具挖掘
        .tagBlock('minecraft:mineable/pickaxe')  // 可被镐挖掘
        .tagBlock('kubejs:drop_controller')      // 自定义标签，方便事件监听
        .displayName("空降控制台")

    event.create("ship_core").defaultCutout().material('medal').tagBlock('minecraft:mineable/pickaxe')
        .blockEntity(blockEntity => shipCore(blockEntity))
        .hardness(1)                // 硬度
        .resistance(20)              // 爆炸抗性
        .requiresTool(true)         // 需要工具挖掘
        .displayName("飞船核心")
    event.create("base_core").defaultCutout().material('medal').tagBlock('minecraft:mineable/pickaxe')
        .blockEntity(entity => { })
        .hardness(-1)                // 硬度
        .resistance(20)              // 爆炸抗性
        .requiresTool(true)         // 需要工具挖掘
        .displayName("母舰核心")

    event.create("filler_block_1").blockEntity(entity => { }).material('wool').hardness(0).resistance(10).noDrops().displayName("发泡方块(填补型)")
    event.create("filler_block_2").blockEntity(entity => { }).material('wool').hardness(0).resistance(10).noDrops().displayName("发泡方块(扩展型)")
    event.create("filling_block").randomTick(tick => {
        let nowAge = parseInt(tick.block.properties.age)
        if (nowAge < 7) {
            if (Math.random() < 0.25) {
                tick.block.set("kubejs:filling_block", { "age": `${nowAge + 1}` })
            }
        }
        else {
            tick.block.set("minecraft:air")
        }
    })
        .suffocating(false)
        .property(BlockProperties.AGE_7).material('wool').hardness(0).resistance(10).noDrops().displayName("发泡填充方块")

    event.create("light_spark")
        .randomTick(tick => {
            let nowAge = parseInt(tick.block.properties.age)
            if (nowAge < 7 && nowAge != 0) {
                if (Math.random() < 0.25) {
                    tick.block.set("kubejs:light_spark", { "age": `${nowAge + 1}` })
                }
            }
            if (nowAge == 7) {
                tick.block.set("minecraft:air")
            }
        })
        .blockEntity(entity => {
            entity.tick(10, 5, function (callback) {
                //callback.block.level.server.tell(callback.level.isDay())
                let block = callback.block
                let nowAge = parseInt(block.properties.age)
                if (nowAge == 0) {
                    if (canReplace(block.offset(0, -1, 0))) {
                        block.offset(0, -1, 0).set("kubejs:light_spark")
                        block.set("air")
                    } else {
                        block.set("kubejs:light_spark", { "age": `${nowAge + 1}` })
                    }
                }
            })
        })
        .tagBlock("minecraft:replaceable")
        .suffocating(false)
        .defaultCutout()
        .noCollision()
        .lightLevel(18)
        .property(BlockProperties.AGE_7).material('wool').hardness(0).resistance(-1).noDrops().displayName("照明火花")

    event.create("energy_transport_terminal")
        .defaultCutout()
        .property(BlockProperties.POWERED)
        .defaultState(state => EnergyTransportTerminalBlock.defaultState(state))
        .rightClick(event => EnergyTransportTerminalBlock.rightClick(event))
        .blockEntity(info => EnergyTransportTerminalBlock.blockEntity(info))
        .displayName("能量传输终端")
})

StartupEvents.registry('entity_type', event => {
    event.create('landing_pod', 'entityjs:living')
        // 基础属性
        .sized(1.5, 2.7)                    // 碰撞箱大小，根据模型调整
        .clientTrackingRange(64)            // 客户端追踪范围（空投通常从高处落下，需要较大范围）
        .updateInterval(1)                  // 每 tick 更新，确保高度检测精确

        // Geckolib 资源绑定（与文件结构对应）
        .modelResource(entity => 'kubejs:geo/entity/landing_pod.geo.json')
        .textureResource(entity => 'kubejs:textures/entity/landing_pod.png')
        .animationResource(entity => 'kubejs:animations/entity/landing_pod.animation.json')

        // 动画控制器预定义（为后续功能做准备）
        .addAnimationController('main', 5, event => {
            // 注册可触发动画（landing 和 break 后续通过代码触发）
            event.addTriggerableAnimation('landing', 'landing', 'play_once')
            event.addTriggerableAnimation('break', 'break', 'play_once')

            if (event.entity.persistentData.getString('state') == 'landing')
                event.thenPlayAndHold("landing")
            if (event.entity.persistentData.getString('state') == 'break')
                event.thenPlayAndHold("break")
            return true
        })

        // 骑乘配置（关键）
        .canAddPassenger(context => {
            // 只允许1名乘客，且必须是玩家
            return context.entity.getPassengers().size() < 1 && context.passenger.isPlayer()
        })
        .positionRider(context => {
            const { entity, passenger, moveFunction } = context
            // 将玩家固定在空投仓内部（y偏移根据模型高度调整）
            moveFunction.accept(passenger, entity.x, entity.y + 0.6, entity.z)
        })

        .onAddedToWorld(entity => {
            // 确保不显示名牌
            entity.setCustomNameVisible(false)
            entity.setCustomName(null)
        })

        // 物理与交互设置
        .isPushable(false)                   // 不可被其他实体推动
        //.isAttackable(false)                 // 不可被攻击（可选，避免被射爆）
        .canBreatheUnderwater(true)          // 防止溺水伤害

        .tick(entity => {
            if (entity.isVehicle()) {
                let currentMotion = entity.getDeltaMovement()
                let maxM = 0.01

                let clampedX = Math.max(-maxM, Math.min(maxM, currentMotion.x))
                let clampedZ = Math.max(-maxM, Math.min(maxM, currentMotion.z))
                entity.setDeltaMovement(clampedX, currentMotion.y, clampedZ)
            }
        })

        .displayName("空投仓")

    //可选：设置生成蛋（调试用途，后续可通过指令生成测试）
    // .eggItem(item => {
    //     item.backgroundColor(0xFF0000)
    //     item.highlightColor(0xFFFFFF)
    // })

    event.create("filler_1", "entityjs:projectile")
        .item(builder => FillerProjectileEntity.item(builder, 1))
        .onHitBlock(context => FillerProjectileEntity.onHitBlock(context, 1))

    event.create("filler_2", "entityjs:projectile")
        .item(builder => FillerProjectileEntity.item(builder, 2))
        .onHitBlock(context => FillerProjectileEntity.onHitBlock(context, 2))
})

StartupEvents.registry('item', event => {
    event.create("cdu_drop").displayName("CDU空投")
    event.create("cannon_drop").displayName("机炮空投")
    event.create("light_drop").displayName("照明空投")

    event.create("empty_cdu_drop").displayName("空的CDU空投")
    event.create("empty_cannon_drop").displayName("空的机炮空投")

    event.create("spore_biomass", "basic").displayName('菌染生物质团')
    event.create("fibrosis_biomass", "basic").displayName('纤维化生物质团')
    event.create("carbonization_biomass", "basic").displayName('碳化生物质团')
    event.create("fossilization_biomass", "basic").displayName('石化生物质团')
    event.create("calcification_biomass", "basic").displayName('钙化生物质团')
    event.create("blazing_biomass", "basic").displayName('炽灼化生物质团')
    event.create("end_biomass", "basic").displayName('末影化生物质团')
    event.create("activation_biomass", "basic").displayName('活化生物质团')
    event.create("high_energy_biomass", "basic").displayName('高能化生物质团')

    event.create("tumor", "basic").displayName('肿瘤')

    event.create("posthumous_papers").displayName("散乱的记述")

    event.create("copter")
        .maxDamage(100)
        .use((level, player, hand) => CopterItem.use(level, player, hand))
        .displayName("竹蜻蜓")
})