"use strict";

const soap = require('strong-soap').soap;
const config = require('./config');
const { createPublicAllegationsCase } = require('./models/ims-model');
const express = require('express')
const app = express()
const port = config.port;

const caseType = {
  FWTCaseCreate : {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

createPublicAllegationsCase(caseType);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
