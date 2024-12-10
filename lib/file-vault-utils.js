const config = require('../config');
const axios = require('axios');
const { tokenUrl } = config.keycloak;

const auth = async () =>
  new Promise((resolve, reject) => {
    if (!tokenUrl) {
      // eslint-disable-next-line no-console
      console.error('keycloak token url is not defined');
      reject(new Error('tokenUrlUndefined'));
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

    axios(tokenReq)
      .then(response => {
        console.log('info', `******************* Filevault response ${response.data}`);
        console.log('Successfully retrieved file: ', response.status);
        resolve({ bearer: response.data.access_token });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Authentication error: ', error);
        reject(error);
      });
  });

const getFile = async (url, authToken) =>
  new Promise((resolve, reject) => {
    const reqConfig = {
      url: url,
      method: 'get',
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Basic ${authToken.bearer}`
      }
    };
    console.log('********************** ', reqConfig);

    axios(reqConfig)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error retrieving file: ', error);
        reject(error);
      });
  });

module.exports = { auth, getFile };
