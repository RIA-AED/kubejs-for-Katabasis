if (Platform.isClientEnvironment()) {
    ForgeEvents.onEvent("net.minecraftforge.client.event.RegisterClientCommandsEvent", event => {
        event.getDispatcher().register(global.teammate_info_command )
    })
}