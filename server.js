//New Relic
//require('newrelic');

//server.js
const app = require("./app");
const port = 1337

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
