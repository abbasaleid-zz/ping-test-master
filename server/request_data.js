const remote = require('electron').remote
const isOnline = require('is-online')
var numClicks = 0
var games
$(document).ready(function () {
    isOnline({ timeout: 3500 }).then(online => {
        if (online) {
            retriveData()
        } else {
            showStatus('internet-connection', null)
        }
    })
})

function CARDSfactory(data) {
    Object.keys(data).forEach(function (key) {
        if (data[key].visible == 1) {
            name = data[key].name
            image = data[key].img
            document.getElementById("myCollection").innerHTML +=
                `<div class="col s6"> <div name="${name}" id="${key}" onclick="initAdresses(this.id)" class="game card hoverable blue-grey darken-4">
        <div class="card-image waves-effect waves-light">
            <img draggable="false" src="${image}">
        </div>
        <div class="card-content">
        <a class="card-title">${name}</a>
        </div>
    </div>
    </div>`
        }

    })
}

function initAdresses(id) {
    var numWindows = remote.getGlobal('windowsCount')

    if (numWindows == 2) {
        // increass the number of clicks
        numClicks++
        // if num of clicks exceded more than one then show them a msg
        if (numClicks == 2) {
            showToast("You can't open more than two windows")
            numClicks = 0
            return
        }
        return
    }
    game = games[id]
    pingWindow(game)
}

function pingWindow(game) {
    const electron = require('electron')
    const { ipcRenderer } = electron
    ipcRenderer.send('pingWindow:game', game)
}

function showToast(msg) {
    M.toast({ html: msg })
}

function retriveData() {
    games = require("./assets/games_info.json")
    CARDSfactory(games)
    showStatus('ajax-complete', null)
}

function showStatus(status, msg) {
    switch (status) {
        case 'ajax-complete': {
            $("#loader").css('display', 'none')
            $("#container").fadeIn('slow')
            break
        }

        case 'internet-connection': {
            $("#loader").css('display', 'none')
            $("#internet-connection").fadeIn('slow')
            break
        }

        case 'ajax-error': {
            $("#loader").css('display', 'none')
            $("#error-msg").html(msg)
            $("#ajax-error").fadeIn('slow')
            break
        }
    }
}