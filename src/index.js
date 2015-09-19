import menubar from 'menubar'
import Shell from 'shell'
import Path from 'path'
import Logger from './logger'
import globalShortcut from 'global-shortcut'

const opts = {
  dir: __dirname,
  icon: Path.join(__dirname, '..', 'images', 'icon-timer.png'),
  preloadWindow: true,
}

const menu = menubar(opts)
const appDataPath = Path.join(menu.app.getPath('appData'), menu.app.getName())
const logger = Logger(appDataPath, menu.app.getVersion())

process.on('uncaughtException', function (error) {
  if (error) {
    logger.error('uncaughtException', { message: error.message, stack: error.stack })
  }
})

let isWindowShown = false

menu.on('show', function() {
  isWindowShown = true
})

menu.on('after-create-window', function () {
  const ret = globalShortcut.register('ctrl+shift+a', function() {
    if (!isWindowShown) {
      menu.window.show()
      isWindowShown = true
    } else {
      menu.window.hide()
      isWindowShown = false
    }
  })

  if (!ret) {
    logger.error('shortcutRegistrationError', 'registration failed');
  }

  menu.window.webContents.on('new-window', function (e, url) {
    e.preventDefault()
    Shell.openExternal(url)
  })

  menu.window.on('closed', function () {
    menu.window = null
  })
})

menu.on('ready', function () {
  menu.tray.setToolTip('Time Tracker')
  menu.tray.setTitle('00:00')
})

menu.on('will-quit', function() {
  globalShortcut.unregister('ctrl+shift+a')
  globalShortcut.unregisterAll()
})
