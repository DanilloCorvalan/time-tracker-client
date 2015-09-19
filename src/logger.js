import fs from 'fs'
import Winston from 'winston'
import Path from 'path'

module.exports = function (appDataPath, version) {
  const logDir = Path.join(appDataPath, 'Log')
  try {
    fs.mkdirSync(logDir)
  } catch (e) {
    // ignore
  }

  const versionRewriter = function (level, msg, meta) {
    if (!meta) {
      meta = {}
    }

    meta.version = version
    return meta
  }

  return new Winston.Logger({
    transports: [
      new Winston.transports.Console(),
      new Winston.transports.DailyRotateFile({ filename: Path.join(logDir, 'app.log') }),
    ],
    rewriters: [ versionRewriter ],
  })
}
