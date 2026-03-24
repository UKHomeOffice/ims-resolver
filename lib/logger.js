'use strict';

const pino = require('pino');

module.exports = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level(label) {
      return { level: label };
    }
  },
  redact: [
    '**.username',
    '**.password',
    '**.client_id',
    '**.client_secret',
    '**.credentials',
    '**.bearer'
  ]
});
