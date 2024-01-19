const https = require("https");
const fs = require("fs");

const options = {
  ca: fs.readFileSync("/etc/ssl/certs/ims-prp1-ca.crt"),
};

const getRequest = () => {
  console.log('CA IN CHAIN: ', options.ca.toString().slice(0,25));
//   https.get(
//     "https://ho-it-prp1-i-ie-ims.report-and-manage-intelligence.np.immigrationservices.phz/lagan/services/FL",
//     options,
//     (err, res) => {
//       if (err) {
//         console.error(err.message);
//       }
//       // Handle the response
//       console.log(res);
//     }
//   );
};

module.exports = { getRequest };
