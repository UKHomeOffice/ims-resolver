const config = require('../config');
const axios = require('axios');
const logger = require('./logger');
const { tokenUrl } = config.keycloak;

const auth = async () => {
  if (!tokenUrl) {
    logger.error('keycloak token url is not defined');
    throw new Error('tokenUrlUndefined');
  }

  const tokenReq = {
    url: tokenUrl,
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      username: config.keycloak.username,
      password: config.keycloak.password,
      grant_type: 'password',
      client_id: config.keycloak.clientId,
      client_secret: config.keycloak.secret
    }
  };

  try {
    const response = await axios(tokenReq);
    return { bearer: response.data.access_token };
  } catch (error) {
    logger.error({ err: error }, 'Authentication error');
    throw error;
  }
};

const getFile = async (url, authToken) => {
  const reqConfig = {
    url: url,
    method: 'get',
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${authToken.bearer}`
    }
  };

  try {
    const response = await axios(reqConfig);
    return response.data;
  } catch (error) {
    logger.error({ err: error }, 'Error retrieving file');
    throw error;
  }
};

module.exports = { auth, getFile };
