if (Platform.isClientEnvironment()) {
    let $Color = Java.loadClass("java.awt.Color")
    let $FireModeInstance = Java.loadClass("com.vicmatskiv.pointblank.item.FireModeInstance")
    let $GunItem = Java.loadClass("com.vicmatskiv.pointblank.item.GunItem")
    let $Item = Java.loadClass("net.minecraft.world.item.Item")
    let $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack")
    let $Axis = Java.loadClass("com.mojang.math.Axis")

    let $GunItem$isCompatibleBullet = Java.class.forName("com.vicmatskiv.pointblank.item.GunItem")
        .getDeclaredMethod("isCompatibleBullet", $Item, $ItemStack, $FireModeInstance)
    $GunItem$isCompatibleBullet.setAccessible(true)

    // 报错记号
    global.guiErrorLogged = {
        armourInfo: false,
        shipCore: false,
        ammoInfo: false,
        objectiveStatus: false
    }

    // 存储当前显示的核心信息
    global.shipCoreInfo = {
        energy: 0,
        distance: -1,
        connected: false,
        maxRange: 0,
        pos: null,
        lastUpdate: 0
    }

    // 护甲信息Overlay
    global.armour_info_overlay = (
        /** @type {Internal.ForgeGui} */ gui,
        /** @type {GuiGraphics} */ guiGraphics,
        partialTick,
        screenWidth,
        screenHeight
    ) => {
        try {
            if (!guiGraphics) return
            let player = Client.player
            if (!player) return

            let font = gui.getFont()
            let poseStack = guiGraphics.pose()
            let drawStringFloat = "drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)"

            let armorList = []
            let shouldRender = false
            player.armorSlots.forEach(item => {
                if (!item.isEmpty()) shouldRender = true
                armorList.push(item)
            })
            armorList.reverse()

            if (!shouldRender) return

            // --- 1. 预计算：统计总高度和最大宽度 ---
            let totalHeight = 0
            let maxAccCount = 0
            let itemData = [] // 存储处理后的数据，避免二次遍历 NBT

            armorList.forEach(itemStack => {
                let isEmpty = true
                let hasSlot = false
                let accCount = 0
                if (!itemStack.isEmpty() && itemStack.nbt) {
                    isEmpty = false
                    let i = 1
                    while (itemStack.nbt.contains(`slot${i}`)) {
                        let sid = itemStack.nbt.getString(`slot${i}`)
                        if (sid && sid != "minecraft:air" && sid != "") {
                            accCount++
                            hasSlot = true
                        }
                        i++
                    }
                }
                if (accCount > maxAccCount) maxAccCount = accCount

                let rowHeight = isEmpty ? 0 : (hasSlot ? 30 : 23)
                totalHeight += rowHeight
                itemData.push({ stack: itemStack, hasSlot: hasSlot, rowHeight: rowHeight })
            })

            // --- 2. 计算动态位置 ---
            let x = 10
            // 屏幕高度一半减去总高度的一半，实现垂直居中
            let y = (screenHeight / 2) - (totalHeight / 2)
            let dynamicWidth = Math.max(40, 36 + (maxAccCount * 4))
            let padding = 4

            // --- 3. 绘制背景 ---
            // guiGraphics.fill(x - padding, y - padding, x + dynamicWidth, y + totalHeight, (0x55000000 | 0))

            // --- 4. 循环渲染 ---
            let currentY = y
            itemData.forEach(data => {
                let itemStack = data.stack
                if (!itemStack.isEmpty()) {
                    // 渲染主图标
                    guiGraphics.renderItem(itemStack, x, currentY)
                    guiGraphics.renderItemDecorations(font, itemStack, x, currentY)

                    // 耐久文字
                    if (itemStack.isDamageableItem()) {
                        let { damageValue, maxDamage } = itemStack
                        let remaining = maxDamage - damageValue
                        let mainRatio = Math.max(0, Math.min(remaining / maxDamage, 1.0))
                        let mainColor = $Color.getHSBColor(mainRatio / 3, 1.0, 1.0).getRGB()
                        guiGraphics[drawStringFloat](font, `${remaining}`, x + 20, currentY, (mainColor | 0xFF000000) | 0, true)
                    }

                    // 渲染配件 (缩放逻辑)
                    if (data.hasSlot) {
                        let nbt = itemStack.nbt
                        let accX = x
                        let i = 1
                        while (nbt.contains(`slot${i}`)) {
                            let slotId = nbt.getString(`slot${i}`)
                            if (slotId && slotId != "minecraft:air" && slotId != "") {
                                let sValue = nbt.getDouble(`s${i}`)
                                let accItem = Item.of(slotId.replace(/\"/g, ""))

                                poseStack.pushPose()
                                let scale = 0.7
                                poseStack.scale(scale, scale, 1.0)
                                let renderX = accX / scale
                                let renderY = (currentY + 16) / scale

                                guiGraphics.renderItem(accItem, renderX, renderY)

                                // 配件耐久条
                                let maxS = accItem.isDamageableItem() ? accItem.getMaxDamage() : 1.0
                                let ratio = Math.max(0, Math.min(1.0 - sValue / maxS, 1.0))
                                if (sValue > 0) {
                                    let barWidth = 13
                                    let fillWidth = Math.floor(barWidth * ratio)
                                    let barY = renderY + 14
                                    let barX = renderX + 2
                                    poseStack.translate(0, 0, 200)
                                    guiGraphics.fill(barX, barY, barX + barWidth, barY + 2, (0xFF000000 | 0))
                                    let hsbColor = $Color.getHSBColor(ratio / 3, 1.0, 1.0).getRGB()
                                    guiGraphics.fill(barX, barY, barX + fillWidth, barY + 1, (hsbColor | 0xFF000000) | 0)
                                }
                                poseStack.popPose()
                                accX += 10
                            }
                            i++
                        }
                    }
                }
                // 递增坐标
                currentY += data.rowHeight
            })
        } catch (e) {
            if (!global.guiErrorLogged.armourInfo) {
                console.error("Critical error in GUI Overlay rendering!")
                console.error("Error details: " + e)
                console.error("Stacktrace: " + e.stack)

                global.guiErrorLogged.armourInfo = true

                if (Client.player) {
                    Client.player.tell(Text.red("GUI 渲染发生异常，请检查控制台日志！"))
                }
            }
        }
    }

    // 飞船核心Overlay
    global.ship_core_overlay = (
        /** @type {Internal.ForgeGui} */ gui,
        /** @type {GuiGraphics} */ guiGraphics,
        partialTick,
        screenWidth,
        screenHeight
    ) => {
        try {
            if (!guiGraphics) return
            let player = Client.player
            if (!player) return

            // 检查数据是否过期（超过1秒未更新则不显示）
            let now = Date.now()
            if (now - global.shipCoreInfo.lastUpdate > 250) return

            let font = gui.getFont()
            let drawStringFloat = "drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)"

            // 准星位置
            let crosshairX = screenWidth / 2
            let crosshairY = screenHeight / 2

            // 显示位置：准星左下角
            let x = crosshairX + 15
            let y = crosshairY + 15

            // 背景
            let padding = 10
            let bgWidth = 100
            let bgHeight = 55
            guiGraphics.fill(x - padding, y - padding, x + bgWidth, y + bgHeight, 0xAA000000 | 0)

            // 标题
            guiGraphics[drawStringFloat](font, "飞船核心", x, y, 0x00FFFF, true)
            y += 12

            // 能量
            let energyText = `能量: ${global.shipCoreInfo.energy}`
            let energyColor = global.shipCoreInfo.energy > 0 ? 0x00FF00 : 0xFF0000
            guiGraphics[drawStringFloat](font, energyText, x, y, energyColor, true)
            y += 10

            // 连接状态
            let connectedText = global.shipCoreInfo.connected ? "已连接母舰核心" : "未连接母舰核心"
            let connectedColor = global.shipCoreInfo.connected ? 0x00FF00 : 0xFF4444
            guiGraphics[drawStringFloat](font, connectedText, x, y, connectedColor, true)
            y += 10

            // 距离（始终显示）
            let info = global.shipCoreInfo
            let distanceText = info.distance >= 0
                ? `距离: ${info.distance}m / ${info.maxRange}m`
                : "距离: 未知"
            let distanceColor = info.connected ? 0x00FF00 : 0xFF4444
            guiGraphics[drawStringFloat](font, distanceText, x, y, distanceColor, true)

        } catch (e) {
            if (!global.guiErrorLogged.shipCore) {
                console.error("Critical error in GUI Overlay rendering!")
                console.error("Error details: " + e)
                console.error("Stacktrace: " + e.stack)

                global.guiErrorLogged.shipCore = true

                if (Client.player) {
                    Client.player.tell(Text.red("GUI 渲染发生异常，请检查控制台日志！"))
                }
            }
        }
    }

    // 子弹数量信息Overlay
    global.ammo_info_overlay = (
        /** @type {Internal.ForgeGui} */ gui,
        /** @type {GuiGraphics} */ guiGraphics,
        partialTick,
        screenWidth,
        screenHeight
    ) => {
        try {
            if (!guiGraphics) return
            let player = Client.player
            if (!player) return

            let gunStack = player.getMainHandItem()
            if (!(gunStack.item instanceof $GunItem)) return

            /** @type {Internal.GunItem} */
            let gunItem = gunStack.item

            let fireModeInstance = $GunItem.getFireModeInstance(gunStack)
            let maxCapacity = gunItem.getMaxAmmoCapacity(gunStack, fireModeInstance)
            let currentAmmo = $GunItem.getAmmo(gunStack, fireModeInstance)

            let ammoInfo = gunItem.getCompatibleAmmo().map(item => {
                return {
                    id: item.id,
                    count: 0
                }
            })

            for (let inventoryItem of player.getInventory().items) {
                if (!$GunItem$isCompatibleBullet.invoke(null, inventoryItem.item, gunStack, fireModeInstance)) continue

                let foundAmmoInfo = ammoInfo.find(item => item.id == inventoryItem.id)
                if (foundAmmoInfo != null) {
                    foundAmmoInfo.count += inventoryItem.count
                }
            }

            let font = gui.getFont()
            let poseStack = guiGraphics.pose()
            let drawStringFloat = "drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)"

            let rowHeight = 22
            let totalHeight = ammoInfo.length * rowHeight
            let yStart = (screenHeight - totalHeight) / 2 // 垂直居中

            // 设置右对齐的边距
            let rightMargin = 30
            let xBase = screenWidth - rightMargin

            let moveY = 0
            ammoInfo.forEach(info => {
                let y = yStart + moveY
                moveY += rowHeight
                let itemStack = Item.of(info.id)

                // 1. 渲染子弹图标
                guiGraphics.renderFakeItem(itemStack, xBase - 15, y)

                let time = Date.now()
                let countColor
                // 2. 渲染数量
                if (info.count > 0) {
                    let ratio = Math.min(info.count / 64, 1)
                    countColor = $Color.getHSBColor(ratio / 3, 1.0, 1.0).getRGB()
                } else {
                    let wave = Math.sin(time / 200);
                    let alpha = Math.floor(((wave + 1) / 2) * 155) + 100;

                    let redBase = $Color.getHSBColor(0.0, 1.0, 1.0).getRGB()
                    countColor = (alpha << 24) | (redBase & 0x00FFFFFF)
                }

                let text = `×${info.count}`
                // 执行绘制
                guiGraphics[drawStringFloat](font, text, xBase, y + 5, countColor, true)
            })
        } catch (e) {
            if (!global.guiErrorLogged.ammoInfo) {
                console.error("Critical error in GUI Overlay rendering!")
                console.error("Error details: " + e)
                console.error("Stacktrace: " + e.stack)

                global.guiErrorLogged.ammoInfo = true

                if (Client.player) {
                    Client.player.tell(Text.red("GUI 渲染发生异常，请检查控制台日志！"))
                }
            }
        }
    }

    // 任务信息Overlay
    global.objective_status_overlay = (
        /** @type {Internal.ForgeGui} */ gui,
        /** @type {GuiGraphics} */ guiGraphics,
        partialTick,
        screenWidth,
        screenHeight
    ) => {
        try {
            if (!guiGraphics) return
            let player = Client.player
            if (!player) return
            let objData = global.currentObjectiveData
            if (!objData || !objData.active) return

            let font = gui.getFont()
            let poseStack = guiGraphics.pose()
            let drawStringFloat = "drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)"

            let rightMargin = 20
            let bottomMargin = 60 // 避开物品栏
            let xBase = screenWidth - rightMargin
            let yBase = screenHeight - bottomMargin

            // --- 1. 状态映射逻辑 ---
            let statusText = objData.status
            let statusColor = 0xFFFFFFFF // 默认白色
            let targetPos = objData.targetPos
            if (targetPos != null)
                targetPos = BlockPos.of(targetPos)

            let statusMap = {
                'WAITING': { text: "前往目标点", color: 0xFFAAAAAA }, // 灰色
                'READY': { text: "准备就绪", color: 0xFF55FF55 }, // 绿色
                'ACTIVE': { text: "完成任务目标……尽量吧", color: 0xFFFFFFFF }, // 白色
                'COMPLETED': { text: "任务完成", color: 0xFFFFFF55 }, // 黄色
                'FAILED': { text: "任务失败", color: 0xFFFF5555 } // 红色
            }

            if (objData.isCooldown) {
                statusColor = 0xFFAAAAAA
            } else if (objData.status && statusMap[objData.status]) {
                let config = statusMap[objData.status]
                statusColor = config.color | 0

                // 如果是 WAITING 状态，额外计算距离
                if (objData.status == 'WAITING' && objData.targetPos) {
                    let dx = targetPos.x - player.x
                    let dz = targetPos.z - player.z
                    let dist = Math.sqrt(dx * dx + dz * dz).toFixed(0)
                    statusText = `${config.text}: ${dist}m`
                } else {
                    statusText = config.text
                }
            }

            // --- 2. 准备渲染数据 ---
            let titleText = objData.name
            let titleWidth = font.width(titleText)
            let statusWidth = font.width(statusText)
            let maxTextWidth = Math.max(titleWidth, statusWidth)

            // --- 3. 渲染旋转图标 ---
            let arrowStack = Item.of("minecraft:arrow")

            if (targetPos != null && !objData.isCooldown) {
                let dx = targetPos.x - player.x
                let dz = targetPos.z - player.z

                // 计算平滑旋转角度
                let targetAngle = Math.atan2(dz, dx) * (180 / KMath.PI) - 90
                let playerYaw = Mth.lerp(partialTick, player.yRotO, player.YRot)
                let finalAngle = targetAngle - playerYaw

                poseStack.pushPose()
                poseStack.translate(xBase - 8, yBase - 2, 0)
                // 额外 -45 度是因为箭头的默认贴图是斜着的
                poseStack.mulPose($Axis.ZP.rotationDegrees(finalAngle - 45))
                guiGraphics.renderFakeItem(arrowStack, -8, -8)
                poseStack.popPose()
            } else {
                // 冷却中或无坐标显示静止图标
                let icon = objData.isCooldown ? Item.of("minecraft:clock") : arrowStack
                guiGraphics.renderFakeItem(icon, xBase - 16, yBase - 10)
            }

            // --- 4. 渲染文字 (右对齐) ---
            // 标题 (任务名)
            guiGraphics[drawStringFloat](font, titleText, xBase - 25 - titleWidth, yBase - 12, 0xFFFF5555 | 0, true)
            // 状态文字 (颜色动态)
            guiGraphics[drawStringFloat](font, statusText, xBase - 25 - statusWidth, yBase, statusColor | 0, true)

            // --- 5. 渲染进度条 ---
            let barWidth = maxTextWidth + 5
            let barHeight = 2
            let barX = xBase - 25 - barWidth
            let barY = yBase + 12

            guiGraphics.fill(barX, barY, barX + barWidth, barY + barHeight, 0x88000000 | 0)
            let barColor = objData.isCooldown ? 0xFFAAAAAA : (statusColor == 0xFFFFFFFF ? 0xFFFF4466 : statusColor)
            let currentBarWidth = barWidth * Math.max(0, Math.min(1, objData.percent))

            // 从右往左填充进度条 (符合视觉直觉)
            guiGraphics.fill(barX + (barWidth - currentBarWidth), barY, barX + barWidth, barY + barHeight, barColor | 0)
        } catch (e) {
            if (!global.guiErrorLogged.objectiveStatus) {
                console.error("Critical error in GUI Overlay rendering!")
                console.error("Error details: " + e)
                console.error("Stacktrace: " + e.stack)

                global.guiErrorLogged.objectiveStatus = true

                if (Client.player) {
                    Client.player.tell(Text.red("GUI 渲染发生异常，请检查控制台日志！"))
                }
            }
        }
    }
}