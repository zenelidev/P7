const sharp = require('sharp');

function imageProcessingMiddleware(req, res, next) {
  if (req.file && req.file.buffer) {
    const uploadedImageBuffer = req.file.buffer;
    sharp(uploadedImageBuffer)
      .resize({ width: 800, height: 600, fit: 'inside' })
      .toBuffer()
      .then((outputBuffer) => {
        req.file.buffer = outputBuffer;
        next();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Image processing error');
      });
  } else {
    next();
  }
}

module.exports = imageProcessingMiddleware;