if (Platform.isClientEnvironment()) {
    let $VanillaGuiOverlay = Java.loadClass("net.minecraftforge.client.gui.overlay.VanillaGuiOverlay")

    // 版本号配置
    let VERSION = "内部测试版本 不代表最终品质-40e18d9c"

    ForgeModEvents.onEvent("net.minecraftforge.client.event.RegisterGuiOverlaysEvent", event => {
        event.registerBelow(
            $VanillaGuiOverlay.CHAT_PANEL.id(),
            "version_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.version_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )
    })

    global.version_overlay = (
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
            let drawStringFloat = "drawString(net.minecraft.client.gui.Font,java.lang.String,float,float,int,boolean)"

            // 计算文字宽度以便右对齐
            let textWidth = font.width(VERSION)

            // 右下角位置（留出一些边距）
            let x = screenWidth - textWidth - 5
            let y = screenHeight - 12

            // 绘制版本号（灰色半透明）
            guiGraphics[drawStringFloat](font, VERSION, x, y, 0x888888, true)

        } catch (e) {
            console.error("Version Overlay Error: " + e)
        }
    }
}