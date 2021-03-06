module.exports.paginate = (limit = 20) => {
  return (req, res, next) => {
    const { page } = req.query;
    const skip = (page - 1) * limit;

    req.skip = skip;
    req.limit = limit;

    next();
  };
};
