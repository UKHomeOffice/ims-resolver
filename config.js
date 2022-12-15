
module.exports = {
    env: process.env.NODE_ENV,
    ims: {
      wsdl: process.env.WSDL,
      createCase: 'createCase',
      retrieveCaseDetails: 'retrieveCaseDetails',
      apiUser: process.env.IMS_API_USER,
      apiPassword: process.env.IMS_API_PASSWORD,
      ClassificationEventCode: 4000041
    }
  };