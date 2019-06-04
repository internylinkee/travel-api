const app = require('./config/express');
const port = process.env.PORT || 3000;

const mongoose = require('./config/mongoose');

mongoose.connect();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
