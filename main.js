// electron variables
const { app, BrowserWindow, ipcMain } = require('electron')
const electron = require('electron')
const path = require('path')
const url = require('url')
const Menu = electron.Menu

// global variables between processes
global.windowsCount = BrowserWindow.getAllWindows.length
global.appVersion = app.getVersion()
global.appName = app.getName()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win // main window variable
let pingWindow // ping window variable
let aboutWindow // about window variable
let server = require('./server/ping.js') // running the server
let opendAbout = 0 // to check if about window i opend or not

// my menu template
const menuTemplate = [
    {
        label: 'App',
        submenu: [
            {
                role: 'reload'
            },
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'About',
        submenu: [
            {
                label: 'About us',
                click: function() {
                    if(opendAbout == 0)
                    createAboutWindow()
                    else
                    aboutWindow.show()
                }
            }
        ]
    }
]

// create my menu from the template
const myMenu = Menu.buildFromTemplate(menuTemplate)

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 535, height: 835, title: app.getName })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        title: 'PING Master'
    }))

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        let allwindows = BrowserWindow.getAllWindows()
        // when main window is closed, we close all the windows
        for (i = 0; i < allwindows.length; i++) {
            allwindows[i].close(this)
            allwindows[i] = null
        }
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
    // set the window menu, then create it
    //Menu.setApplicationMenu(myMenu)
    // start creating the main window
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.on('pingWindow:game', function (e, game) {
    global.gameObject = game
    createPingWindow()
})

function createPingWindow() {
    global.windowsCount = BrowserWindow.getAllWindows().length
    // Create the browser window.
    pingWindow = new BrowserWindow({ width: 520, height: 410, title: 'PING Window' })

    // and load the index.html of the app.
    pingWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'pingWindow.html'),
        protocol: 'file:',
        slashes: true,
        frame: false,
    }))

    // Garbage collection
    pingWindow.on('close', function () {
        // decreass the number of windows opend
        global.windowsCount = global.windowsCount - 1;
        pingWindow = null
    })
}

function createAboutWindow() {
    // Create the browser window.
    aboutWindow = new BrowserWindow({ width: 500, height: 300, title: 'About' })
    // and load the index.html of the app.
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'aboutWindow.html'),
        protocol: 'file:',
        slashes: true,
        frame: false,
    }))
    opendAbout = 1
    // Garbage collection
    aboutWindow.on('close', function () {
        // decreass the number of windows opend
        aboutWindow = null
        opendAbout = 0
    })
}
