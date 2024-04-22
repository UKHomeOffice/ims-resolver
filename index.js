'use strict';
const imsResolver = require('./ims-resolver');
/* eslint-disable consistent-return, no-console */
const { createPublicAllegationsCase } = require('./models/ims-model');
//imsResolver.start();
var msg;
createPublicAllegationsCase(msg);
