#!/bin/bash
const mongoose = require('../config/mongoose');
const axios = require('axios');
const Location = require('../api/models/location-model');

mongoose.connect();

const getLocation = async () => {
  try {
    let cityList = await axios.get('https://thongtindoanhnghiep.co/api/city');
    cityList = cityList.data.LtsItem;
    cityList.pop();

    const cityName = cityList.map(city => ({ name: city.Title }));
    await Location.insertMany(cityName);
  } catch (err) {
    throw err;
  }
};

getLocation()
  .then(() => {
    console.log('Done');
    process.exit(-1);
  })
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
