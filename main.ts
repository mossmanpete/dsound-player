import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

if (require('electron-squirrel-startup')) {
  app.quit();
}

const squirrelCommand = process.argv[1];
switch (squirrelCommand) {
  case '--squirrel-install':
  case '--squirrel-updated':
    // Optionally do things such as:
    //
    // - Install desktop and start menu shortcuts
    // - Add your .exe to the PATH
    // - Write to the registry for things like file associations and
    //   explorer context menus

    // Always quit when done
    app.quit();
    break;
  case '--squirrel-uninstall':
    // Undo anything you did in the --squirrel-install and
    // --squirrel-updated handlers

    // Always quit when done
    app.quit();
    break;
  case '--squirrel-obsolete':
    // This is called on the outgoing version of your app before
    // we update to the new version - it's the opposite of
    // --squirrel-updated
    app.quit();
    break;
}

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

// Freeze console for production mode
if (!serve) {
  const disFunc = () => 'console has been disabled in production mode';

  console.log = disFunc;
  console.error = disFunc;
  console.warn = disFunc;

  Object.freeze(console);
}

// Close app if another instance is already running
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  // Someone tried to run a second instance, we should focus our window.
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
  });
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1205,
    height: 740,
    minWidth: 800,
    minHeight: 660,
    icon: path.join(__dirname, 'src/assets/img/icon.ico')
  });

  win.setMenu(null);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
