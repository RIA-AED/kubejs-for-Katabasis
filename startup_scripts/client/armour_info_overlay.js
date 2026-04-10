if (Platform.isClientEnvironment) {
    let $VanillaGuiOverlay = Java.loadClass("net.minecraftforge.client.gui.overlay.VanillaGuiOverlay")
    let $Color = Java.loadClass("java.awt.Color")

    ForgeModEvents.onEvent("net.minecraftforge.client.event.RegisterGuiOverlaysEvent", event => {
        event.registerBelow(
            $VanillaGuiOverlay.CHAT_PANEL.id(),
            "armour_info_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.armour_info_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )
    })

    global.guiErrorLogged = false;

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
            if (!global.guiErrorLogged) {
                console.error("Critical error in GUI Overlay rendering!")
                console.error("Error details: " + e)
                console.error("Stacktrace: " + e.stack)

                global.guiErrorLogged = true

                if (Client.player) {
                    Client.player.tell(Text.red("GUI 渲染发生异常，请检查控制台日志！"))
                }
            }
        }
    }
}