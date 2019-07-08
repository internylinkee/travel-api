#!/bin/bash
const mongoose = require('../config/mongoose');
const Category = require('../api/models/category-model');

mongoose.connect();

const importCategories = async () => {
  try {
    const categoies = [
      { name: 'Ăn uống' },
      { name: 'Du lịch' },
      { name: 'Giải trí' },
      { name: 'Mua sắm' },
      { name: 'Dịch vụ' },
      { name: 'Món ngon mới lạ' },
    ];

    await Category.insertMany(categoies);
  } catch (err) {
    throw err;
  }
};

importCategories()
  .then(() => {
    console.log('Done');
    process.exit(-1);
  })
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
