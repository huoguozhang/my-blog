const uuid = require('uuid')
const fs = require('fs')

const UPLOAD_PATH = 'uploads'
const fileOptions = { dest: `${UPLOAD_PATH}/` }

const uploader = function (file, options) {
  if (!file) throw new Error('no file(s)')

  return _fileHandler(file, options)
}

if (!fs.existsSync(UPLOAD_PATH)){
    fs.mkdirSync(UPLOAD_PATH)
}

const _fileHandler = function (file, options = fileOptions) {
  if (!file) throw new Error('no file')

  const orignalname = file.hapi.filename
  const filename = uuid.v1()
  const path = `${options.dest}${filename}${orignalname.match(/\.[\d\w]+$/)}`
  const fileStream = fs.createWriteStream(path)
  //  可以在这里存数据库 origin name - uid name
  return new Promise((resolve, reject) => {
    file.on('error', function (err) {
      reject(err)
    })

    file.pipe(fileStream)

    file.on('end', function (err) {
      const fileDetails = {
        fieldname: file.hapi.name,
        originalname: file.hapi.filename,
        filename,
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path: '/api/' + path,
        size: fs.statSync(path).size
      }

      resolve(fileDetails)
    })
  })
}

module.exports = {
  uploader
}
