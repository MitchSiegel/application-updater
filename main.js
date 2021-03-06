// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')

var regedit = require('regedit')
regedit.setExternalVBSLocation("./wsf/");
let progList = {}



require('electron-reload')(__dirname);

function createWindow() {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.webContents.executeJavaScript(
    `global={progList: {${progList}}};`
  );
  // and load the index.html of the app.
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  regedit.list(['HKCU\\SOFTWARE', 'HKLM\\SOFTWARE'])
    .on('data', function (entry) {
      progList = entry
    })
    .on('finish', function () { 
      createWindow()
      console.log(progList)
    })
    


  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.