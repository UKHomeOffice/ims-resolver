const https = require('https');
const fs = require('fs');

const path = require("path");
//const file = fs.readFileSync(path.resolve(__dirname, "/etc/ssl/certs/ims-prp1-ca.crt"));
const options = {
    ca: fs.readFileSync("/etc/ssl/certs/ims-prp1-ca.crt")
    };

const getCertificate = function getRequest(){
    https.get('https://ho-it-prp1-i-ie-ims.report-and-manage-intelligence.np.immigrationservices.phz/lagan/services/FL', options, (res) => {
    // Handle the response
    console.log(res)
    });
}

module.exports = {
    getCertificate
};


// certificate.getCertificate();
// certificate.options.ca;