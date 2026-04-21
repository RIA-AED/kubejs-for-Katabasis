if (Platform.isClientEnvironment()) {
    let $VanillaGuiOverlay = Java.loadClass("net.minecraftforge.client.gui.overlay.VanillaGuiOverlay")
    ForgeModEvents.onEvent("net.minecraftforge.client.event.RegisterGuiOverlaysEvent", event => {
        event.registerBelow(
            $VanillaGuiOverlay.CHAT_PANEL.id(),
            "armour_info_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.armour_info_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )

        event.registerBelow(
            $VanillaGuiOverlay.CROSSHAIR.id(),
            "ship_core_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.ship_core_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )

        event.registerAboveAll(
            "ammo_info_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.ammo_info_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )

        event.registerAboveAll(
            "objective_status_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.objective_status_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )

        event.registerAboveAll(
            "teammates_info_overlay",
            (gui, guiGraphics, partialTick, screenWidth, screenHeight) =>
                global.teammates_info_overlay(gui, guiGraphics, partialTick, screenWidth, screenHeight)
        )
    })
}