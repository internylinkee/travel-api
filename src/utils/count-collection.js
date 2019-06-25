module.exports = async (collection, model, target, property) => {
  try {
    const countItem = await Promise.all(
      collection.map(item => model.countDocuments({ [target]: item })),
    );

    collection.map((item, index) => (item[property] = countItem[index]));
  } catch (err) {
    throw err;
  }
};
