const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const cloudinary = require('../../config/cloudinary');

exports.upload = async (req, res, next) => {
  const { files } = req;
  const appDomain = process.env.APP_DOMAIN
    ? process.env.APP_DOMAIN
    : `http://localhost:${process.env.PORT || 3000}`;
  try {
    const pathFiles = files.map(file => file.path);

    const compressedFiles = await imagemin(pathFiles, {
      destination: 'public/uploads',
      plugins: [imageminPngquant(), imageminMozjpeg()],
    });

    const uploadPromises = compressedFiles.map(file =>
      cloudinary.uploader.upload(file.destinationPath),
    );

    const urlImages = (await Promise.all(uploadPromises)).map(
      item => item.secure_url,
    );

    return res.status(200).json(urlImages);
  } catch (err) {
    next(err);
  }
};
