const https = require('https');
const fs = require('fs');

const path = require("path");
//const file = fs.readFileSync(path.resolve(__dirname, "/etc/ssl/certs/ims-prp1-ca.crt"));


const getCertificate = function getRequest(){
    https.get('https://ho-it-prp1-i-ie-ims.report-and-manage-intelligence.np.immigrationservices.phz/lagan/services/FL', options, (res) => {
    // Handle the response
    });
}

const options = {
    ca: fs.readFileSync(path.resolve(__dirname, "/etc/ssl/certs/ims-prp1-ca.crt"))
    };

module.exports = {
    getCertificate: getCertificate
};

// certificate.getCertificate();
// certificate.options.ca;