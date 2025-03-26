import { app, shell, BrowserWindow, ipcMain ,session} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'


function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {  } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  
 mainWindow.webContents.openDevTools();
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  const cookies = [
    {
      name: "cb_auth",
      value: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InNwYXJzaGdvZWxrIiwiZmlyc3RuYW1lIjoiU3BhcnNoIiwibGFzdG5hbWUiOiJHb2VsIiwiZ2VuZGVyIjoiTUFMRSIsInBob3RvIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS3R2SUNXWTRHcHJucFhTWkxpVmY2bi1pdTNablFlTkRrNUJEaFJIQ2pqdlBBWTFmT1c9czk2LWMiLCJlbWFpbCI6InNwYXJzaGdvZWxrQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiIrOTEtOTMxOTU1MTYwOCIsIndoYXRzYXBwX251bWJlciI6bnVsbCwicm9sZSI6bnVsbCwidmVyaWZpZWRlbWFpbCI6InNwYXJzaGdvZWxrQGdtYWlsLmNvbSIsInZlcmlmaWVkbW9iaWxlIjpudWxsLCJyZWZlcnJhbENvZGUiOiJTUEExSkoiLCJyZWZlcnJlZEJ5IjpudWxsLCJncmFkdWF0aW9uWWVhciI6MjAyNSwiYXBwYXJlbEdvb2RpZXNTaXplIjpudWxsLCJtYXJrZXRpbmdfbWV0YSI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNS0wMi0xMlQxMDoyMzo1My40MjRaIiwidXBkYXRlZEF0IjoiMjAyNS0wMi0xMlQxMDoyNDozNC44MjFaIiwiZGVsZXRlZEF0IjpudWxsLCJjbGllbnQiOiJ3ZWIiLCJjbGllbnROYW1lIjoibG9jYWxob3N0IiwiY2xpZW50SWQiOiIxMjM0NTY3ODkwIiwidXVpZCI6ImQzZGRiYTljLWU4YTUtNDVlZi1hMDdjLWY2YWE4YjdhMzMyMiIsInNlc3Npb25TdGFydGVkQXQiOiIyMDI1LTAzLTI1VDIwOjQ5OjIzLjYwOVoiLCJpYXQiOjE3NDI5MzU3NjMsImV4cCI6MTc0MzAyMjE2M30.rAYR93LmxXHque7SkZva5VKKTluC9XPowzz1eBCZUTTJQkk7b_S_j_Lut2IxW-DZpvROIFJDeiNU7ozlmE7ZZMCGJ5FYWvbxRb4Z6dAP99UZ2CP2t51VEjLpfzWY6RcgoS4vXNcVx2npdB_aU3434HcPe6RUDEQknh8Y7juLgeAvuWdQgr7VrED96IRoTxGmAtU-vCV1egpppV-GZ15ziOT3AqbzUZF1QMCnLDVy4DQCG1_SsYkpK-ZHo4oMqYTPkDfQGurxcEMqcxh3t0AIVugCxSYX3oZahBFAurYZOylkon3Icr9nRqLIQHXnXQgp5chFyBMNP85Wlc6qmd_o7A",
      domain: "localhost",
      url: "http://localhost:5173",
      path: "/",
      secure: false, // Set to `true` in production if using HTTPS
      httpOnly: false,
    },
    {
      name: "one_auth",
      value: "s%3AwMy8X0jF4hLnTkqYDTqgc8IrNTVGE3qz.sH8rUo1f3ZmZcIWJzEEw9jUIu%2BXhgONGxM49ccu8qyw",
      domain: "localhost",
      url: "http://localhost:5173",
      path: "/",
      secure: false,
      httpOnly: false,
    },
  ];

  // Set each cookie
  cookies.forEach((cookie) => {
    session.defaultSession.cookies.set(cookie).then(
      () => {
        console.log(`Cookie set: ${cookie.name}`);
      },
      (error) => {
        console.error(`Error setting cookie ${cookie.name}:`, error);
      }
    );
  });
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
