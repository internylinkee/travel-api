const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

exports.upload = async (req, res, next) => {
  const { files } = req;
  const appDomain = process.env.APP_DOMAIN
    ? process.env.APP_DOMAIN
    : `http://localhost:${process.env.PORT || 3000}`;
  try {
    const pathFiles = files.map(file => file.path);
    const compressedFiles = await imagemin(pathFiles, {
      destination: 'public/uploads',
      plugins: [imageminPngquant()],
    });

    const urlFileUploaded = compressedFiles.map(
      file =>
        `${appDomain}/${file.destinationPath
          .split('/')
          .slice(1)
          .join('/')}`,
    );

    return res.status(200).json(urlFileUploaded);
  } catch (err) {
    next(err);
  }
};
