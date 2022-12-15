
module.exports = {
    env: process.env.NODE_ENV,
    ims: {
      wsdl: process.env.WSDL,
      createCaseApi: 'createCase',
      getCaseApi: 'retrieveCaseDetails',
      apiUser: process.env.IMS_API_USER,
      apiPassword: process.env.IMS_API_PASSWORD,
      PublicAllegationsEventCode: 4000041
    }
  };