if (Platform.isClientEnvironment) {
    let $VanillaGuiOverlay = Java.loadClass("net.minecraftforge.client.gui.overlay.VanillaGuiOverlay")

    // 存储当前显示的核心信息
    global.shipCoreInfo = {
        energy: 0,
        distance: -1,
        connected: false,
        maxRange: 0,
        pos: null,
        lastUpdate: 0
    }

    // 注册GUI覆盖层
    ForgeModEvents.onEvent("net.minecraftforge.client.event.RegisterGuiOverlaysEvent", event => {
        event.registerBelow(
            $VanillaGuiOverlay.CROSSHAIR.id(),
            "ship_core_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.ship_core_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )
    })

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
            console.error("Ship Core Overlay Error: " + e)
        }
    }
}
