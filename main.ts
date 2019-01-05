import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

if (require('electron-squirrel-startup')) {
  app.quit();
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

const thumbarIcons = {
  prev: path.join(__dirname, 'dist/assets/img/control-prev.png'),
  next: path.join(__dirname, 'dist/assets/img/control-next.png'),
  play: path.join(__dirname, 'dist/assets/img/control-play.png'),
  pause: path.join(__dirname, 'dist/assets/img/control-pause.png')
};

function setThumbarButtons(sender, paused = false) {
  try {
    win.setThumbarButtons([
      {
        icon: thumbarIcons.prev,
        click() { sender.send(`control-prev`); }
      },
      {
        icon: paused ? thumbarIcons.play : thumbarIcons.pause,
        click() { sender.send((paused ? 'control-play' : 'control-pause')); }
      },
      {
        icon: thumbarIcons.next,
        click() { sender.send(`control-next`); }
      }
    ]);
  } catch (e) {
    console.log(e);
  }
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

  // Update Thumbar on player state change
  ipcMain.on('player-onchange', (event, paused) => {
    setThumbarButtons(event.sender, paused);
  });

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

  win.on('closed', () => {
    win = null;
  });
}

try {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
