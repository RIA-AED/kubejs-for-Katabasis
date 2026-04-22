let $CameraType = Java.loadClass("net.minecraft.client.CameraType")
let cameraStatus = "normal"

NetworkEvents.dataReceived("cam_control", event => {

    cameraStatus = event.data.get("status")
    let options = Client.options
    switch (cameraStatus) {
        case ("first"):
            options.setCameraType($CameraType.FIRST_PERSON)
            break
        case ("third_back"):
            options.setCameraType($CameraType.THIRD_PERSON_BACK)
            break
        case ("third_front"):
            options.setCameraType($CameraType.THIRD_PERSON_FRONT)
            break
        default:
            break
    }
})

// ClientEvents.tick(event => {
//     try {
//         let player = event.player
//         if (!player) return
//         if (cameraStatus == "normal") return

//


//     } catch (e) {
//         event.player.tell(e)
//     }

// })