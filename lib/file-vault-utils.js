const config = require('../config');
const axios = require('axios');
const { tokenUrl } = config.keycloak;

const auth = async () => {
  if (!tokenUrl) {
    // eslint-disable-next-line no-console
    console.error('keycloak token url is not defined');
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
    // eslint-disable-next-line no-console
    console.error('Authentication error: ', error);
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
    // eslint-disable-next-line no-console
    console.error('Error retrieving file: ', error);
    throw error;
  }
};

module.exports = { auth, getFile };
