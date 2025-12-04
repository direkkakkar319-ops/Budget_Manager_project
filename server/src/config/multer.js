'use strict'

const path = require('path')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const uploadsDir = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadsDir)
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, `${uuidv4()}${ext}`)
    }
})

const upload = multer({ storage })

module.exports = { upload, uploadsDir }
