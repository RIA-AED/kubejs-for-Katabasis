// priority: 0

// Visit the wiki for more info - https://kubejs.com/


ServerEvents.loaded(event => {
    event.server.scheduleInTicks(20, function (callback) {
        console.info('Hello, World! (Loaded server scripts)')
    })
})