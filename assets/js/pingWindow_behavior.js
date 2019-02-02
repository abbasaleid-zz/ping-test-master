//Declare some global vars
var Stopwatch = require('timer-stopwatch')
var stopwatch = new Stopwatch(null, {refreshRateMS: 1000})
var d, h, m, s
var selectedGame
var gameAdresses
var pingMax = 0, pingMin = 90000, pingAvg = 0, pingSum = 0, pktCounter = 0, pktLoss = 0
var address
var stopBtnPressed = false
const windowTitle = $('#windowTitle')
const stopBtn = $("#pauseBtn")
const startBtn = $("#startBtn")
const serverSelector = $('select')
const pingPlaceholder = $('#pingholder')
const timerPlaceholder = $('#timer')
const maxPlaceholder = $('#max')
const minPlaceholder = $('#min')
const avgPlaceholder = $('#avg')
const pketPlaceholder = $('#pket')
$(document).ready(function () {
    populateSelect()
})


function populateSelect() {
    const remote = require('electron').remote
    // get game object
    selectedGame = remote.getGlobal('gameObject')
    // get game addresses and info from the object
    gameAdresses = selectedGame.ip_address
    var name = selectedGame.name
    // set game title in pingWindow.html
    $("#title").html(name)
    windowTitle.html(`${remote.getGlobal('appName')} - ${name}`)

    // populate select list in pingWindow.html
    // populate it with game addresses
    initSelect()
    for (var key in gameAdresses) {
        serverSelector.append(`<optgroup label="${key}">`)
        Object.keys(gameAdresses[key]).forEach(element => {
            let innerAddress = String(element)
            serverSelector.append(`<option value="${key},${innerAddress}">&nbsp;&nbsp;${element}</option>`)
        })
        serverSelector.append(`</optgroup>`)
    }
}

serverSelector.change(function () {
    // first: disable the selede menu to prevent multi intervals (requests)
    disableSelect()

    // second: enable pause button
    // when it clicked, it clear the current interval
    enableStopBtn()
    startBtn.prop('disabled', true)
    stopBtnPressed = false
    getClickedOption()
})

function getClickedOption() {
    console.log('starttteeedd')
    // get clicked option value; which is the keys of selected region
    keys = serverSelector.val()
    // split the keys into array
    addressKeys = keys.split(',')
    // get address by the keys
    address = gameAdresses[addressKeys[0]][addressKeys[1]]
    // send address to the requestPing function to start the ping process
    requestPing()
    startTimer()
}

function startTimer() {
    stopwatch.start()
    stopwatch.onTime(function (time) {
        timerPlaceholder.html(convertMS(time.ms))
    })
}

function requestPing() {
    console.log('starttteeedd 2')
    // start the iterval
    interval_id = window.setInterval(function () {
        // declare a variable to store ajax
        let request
        // start ajax request
        request = $.ajax({
            method: 'GET',
            url: `http://localhost:3000/ping`,
            data: { ip: address },
            timeout: 1500
        })

        // ajax success
        request.done(function (response) {
            if (stopBtnPressed) return
            let pingInt = parseInt(response, 10)
            displayPing(pingInt)
            displayAvg(pingInt)
            displayMax(pingInt)
            displayMin(pingInt)
        });

        // ajax fail
        request.fail(function (jqXHR, textStatus) {
            if (stopBtnPressed) return
            pktLoss++
            displayPketLoss()
            /* if(pketLoss>=30) {
                window.clearInterval(interval_id)
                disableStopBtn()
                enableSelect()
                requestFail(textStatus)
            } */

        })

    }, 500)
}

function displayPing(ping) {
    pingPlaceholder.html(`${ping}ms`)
}

function displayMax(ping) {
    if (ping > pingMax) {
        pingMax = ping
        maxPlaceholder.html(pingMax)
        // change color
        if (pingMax < 60) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('light-green lighten-5')
        } else if (pingMax > 60 && pingMax <= 120) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('light-green lighten-3')
        } else if (pingMax > 120 && pingMax <= 180) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('yellow')
        } else if (pingMax > 180 && pingMax <= 240) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('orange')
        } else if (pingMax > 240 && pingMax <= 300) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('red accent-2')
        } else if (pingMax > 300 && pingMax <= 500) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('red accent-3')
        } else if (pingMax > 500) {
            maxPlaceholder.removeClass()
            maxPlaceholder.addClass('red accent-4')
        }
    } else {
        maxPlaceholder.html(pingMax)
    }
}

function displayMin(ping) {
    if (ping < pingMin) {
        pingMin = ping
        minPlaceholder.html(pingMin)
        // change color
        if (pingMin < 60) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('light-green lighten-5')
        } else if (pingMin > 60 && pingMin <= 120) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('light-green lighten-3')
        } else if (pingMin > 120 && pingMin <= 180) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('yellow')
        } else if (pingMin > 180 && pingMin <= 240) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('orange')
        } else if (pingMin > 240 && pingMin <= 300) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('red accent-2')
        } else if (pingMin > 300 && pingMin <= 500) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('red accent-3')
        } else if (pingMin > 500) {
            minPlaceholder.removeClass()
            minPlaceholder.addClass('red accent-4')
        }
    } else {
        minPlaceholder.html(pingMin)
    }
}

function displayAvg(ping) {
    pktCounter++
    pingSum += ping
    pingAvg = (pingSum / pktCounter)
    avgPlaceholder.html(Math.round(pingAvg))

    // change color
    if (pingAvg < 60) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('light-green lighten-5')
    } else if (pingAvg > 60 && pingAvg <= 120) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('light-green lighten-3')
    } else if (pingAvg > 120 && pingAvg <= 180) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('yellow')
    } else if (pingAvg > 180 && pingAvg <= 240) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('orange')
    } else if (pingAvg > 240 && pingAvg <= 300) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('red accent-2')
    } else if (pingAvg > 300 && pingAvg <= 500) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('red accent-3')
    } else if (pingAvg > 500) {
        avgPlaceholder.removeClass()
        avgPlaceholder.addClass('red accent-4')
    }
}

function displayPketLoss() {
    pketPlaceholder.html(pktLoss)
}

// clear inputs and interval if stop button is pressed
stopBtn.on('click', function () {
    window.clearInterval(interval_id)
    disableStopBtn()
    startBtn.prop('disabled', false)
    enableSelect()
})

startBtn.on('click', function () {
    stopBtnPressed = false
    disableSelect()
    requestPing()
    startTimer()
    enableStopBtn()
    startBtn.prop('disabled', true)
})

function initSelect() {
    serverSelector.empty()
    serverSelector.append('<option value="" disabled selected>Choose your option</option>')
}

function disableSelect() {
    serverSelector.prop('disabled', true)
}

function enableSelect() {
    serverSelector.prop('disabled', false)
}

function disableStopBtn() {
    clearInputs()
    stopBtnPressed = true
    stopBtn.prop('disabled', true)
}

function enableStopBtn() {
    stopBtn.prop('disabled', false)
}

function requestFail(msg) {
    M.toast({ html: `Request failed: ${msg} & exceeded possible lost packets` })
}

function clearInputs() {
    pingPlaceholder.html('000ms')
    stopwatch.reset()
    timerPlaceholder.html('0:0:0')
    pketPlaceholder.html(0)
    maxPlaceholder.html(0)
    maxPlaceholder.removeClass()
    minPlaceholder.html(0)
    minPlaceholder.removeClass()
    avgPlaceholder.html(0)
    avgPlaceholder.removeClass()
    pingAvg = 0
    pingSum = 0
    pktCounter = 0
    pingMax = 0
    pingMin = 90000
    pktLoss = 0

}

function convertMS(ms) {
    s = Math.floor(ms / 1000)
    m = Math.floor(s / 60)
    s = s % 60;
    h = Math.floor(m / 60)
    m = m % 60;
    d = Math.floor(h / 24)
    h = h % 24

    string = `${h}:${m}:${s}`

    return string
  }