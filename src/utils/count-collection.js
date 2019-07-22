module.exports = async (collection, model, target, property) => {
  try {
    const countItem = await Promise.all(
      collection.map(item => model.countDocuments({ [target]: item })),
    );

    collection.map((item, index) => {
      if (item._doc) {
        item._doc[property] = countItem[index];
      } else {
        item[property] = countItem[index];
      }
    });
  } catch (err) {
    throw err;
  }
};
