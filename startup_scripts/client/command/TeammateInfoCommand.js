if (Platform.isClientEnvironment()) {
    let $Commands = Java.loadClass("net.minecraft.commands.Commands")

    global.teammate_info_command_config = "all"
    try {
        global.teammate_info_command_config = JsonIO.read("teammateinfo_setting.json").config
    } catch (e) {
        JsonIO.write("teammateinfo_setting.json", { config: global.teammate_info_command_config })
    }

    global.teammate_info_command =
        $Commands.literal("teammateinfo")
            .requires(source => true)
            .then($Commands.literal("off").executes(ctx => {
                ctx.getSource().sendSuccess("队伍名牌信息已关闭", false)
                global.teammate_info_command_config = "off"
                JsonIO.write("teammateinfo_setting.json", { config: global.teammate_info_command_config })
                return 1
            }))
            .then($Commands.literal("all").executes(ctx => {
                ctx.getSource().sendSuccess("队伍名牌信息已开启(全服务器玩家)", false)
                global.teammate_info_command_config = "all"
                JsonIO.write("teammateinfo_setting.json", { config: global.teammate_info_command_config })
                return 1
            }))
            .then($Commands.literal("team").executes(ctx => {
                ctx.getSource().sendSuccess("队伍名牌信息已开启(团队玩家)", false)
                global.teammate_info_command_config = "team"
                JsonIO.write("teammateinfo_setting.json", { config: global.teammate_info_command_config })
                return 1
            }))

}