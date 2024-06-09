import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const userId = req.params.id
    const ext = path.extname(file.originalname)
    const timestamp = Date.now()
    cb(null, `${userId}-signature-${timestamp}${ext}`)
  }
})

export const upload = multer({ storage })
