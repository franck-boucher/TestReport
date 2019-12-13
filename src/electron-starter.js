const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const os = require('os')

const Store = require('electron-store');
const store = new Store();
if (store.size === 0) {
  store.store = {
    general: {
      language: 'en',
      darkMode: false
    },
    issueTrackingApp: {
      jira: {
        url: '',
        authorizationToken: ''
      }
    },
    emptyUserStory: {
      userStory: '',
      environment: 'RCT',
      type: 'Manual functional testing',
      author: '',
      tools: ['Postman'],
      comments: '',
      asumptions: '',
      scenarios: []
    },
    emptyScenario: {
      testStatus: 'PENDING',
      title: '',
      description: '',
      urlParameters: '',
      headers: '',
      currentResult: '',
      expectedResult: '',
      defects: '',
      comments: ''
    }
  };
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 760,
    minWidth: 900,
    minHeight: 760
  });

  // Load React Developer Tools extension, see https://electronjs.org/docs/tutorial/devtools-extension
  // BrowserWindow.addDevToolsExtension(
  //   path.join(os.homedir(), 'AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.2.1_0')
  // )

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });
  mainWindow.loadURL(startUrl);

  // Hack to prevent 500 NPE uploading an attachment on JIRA
  electron.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details.requestHeaders['Custom-Headers-Electron']) {
      delete details.requestHeaders['Origin'];
      delete details.requestHeaders['Connection'];
      delete details.requestHeaders['Content-Length'];
      delete details.requestHeaders['Accept-Language'];
      delete details.requestHeaders['Accept-Encoding'];
      delete details.requestHeaders['Accept'];
      delete details.requestHeaders['User-Agent'];
      delete details.requestHeaders['Custom-Headers-Electron'];
    }
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  // Open the DevTools.
  //  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
