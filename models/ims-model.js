'use strict';
/* eslint-disable consistent-return, no-console */
const soap = require('strong-soap').soap;
const config = require('../config');
const wsdlUrl = config.ims.wsdl;

const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;

const caseType = {
  FWTCaseCreate: {
    ClassificationEventCode: config.ims.PublicAllegationsEventCode
  }
};

const eForm = {
  FWTCaseEformNew: {
    CaseReference: null,
    EformName: null
  },
  FLCaseEformInstance: {
    CaseReference: null,
    EformName: null
  }
};

const eformData = {
  FLEformFields: {
    CaseEformInstance: {
      CaseReference: null,
      EformName: config.ims.eformName
    },
    EformData: null
  }
};

// const document = {
//   FWTDocument: {
//     Document: 'VGhpcyBpcyBhIHRlc3Q',
//     DocumentType: 1,
//     DocumentName: 'test.txt'
//   }
// };

// const notes = {
//   FWTNoteToParentRef: {
//     ParentId: null,
//     ParentType: 0,
//     NoteDetails: {
//       Text: null,
//       NoteLabels: {
//         NoteLabel: 'test note label'
//       },
//       NoteAttachments: {
//         NoteAttachmentList: {
//           AttachmentName: 'test.txt',
//           AttachmentIdentifier: null,
//           AttachmentType: 0
//         }
//       }
//     }
//   }
// };

const setEformValue = (eform, fieldName, fieldValue) => {
  eform.EformFields.push({FieldName: fieldName, FieldValue: fieldValue});
};

// Mandatory fields TBD - move to config
const setEformValues = (eform, caseRef) => {
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();

  setEformValue(eform, 'casenum', caseRef);
  setEformValue(eform, 'casenum_1', caseRef);
  setEformValue(eform, 'caseid', caseRef);
  setEformValue(eform, 'caseref', caseRef);
  setEformValue(eform, 'rdborec', 'Online');
  setEformValue(eform, 'staffuserid', config.ims.apiUser);
  setEformValue(eform, 'dtborec', today.toLocaleDateString());
  setEformValue(eform, 'tmboec', time);

  setEformValue(eform, 'rdaboutcontact', 'No');
  setEformValue(eform, 'rdabout18', 'Yes');

  setEformValue(eform, 'txbofname', 'test');
  setEformValue(eform, 'txbosurname', 'test');
  setEformValue(eform, 'txbomobile', 'test');
  setEformValue(eform, 'txboemail', 'test@test.com');
  setEformValue(eform, 'rdbogroup', 'ImmigrationGroup');

  setEformValue(eform, 'rdbowho', 'Other');
  setEformValue(eform, 'txbodept', 'test');
};

const createClient = async () =>
  new Promise((resolve, reject) =>
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, (err, client) => {
      if (err) {return reject(err);}
      client.setEndpoint(config.ims.endpoint);
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      return resolve(client);
    }
    )
  );

const createCase = async client =>
  new Promise((resolve, reject) =>
    client.createCase(caseType,
      (err, result) => {
        if (err) {return reject(err);}
        console.log('Case reference: ' + JSON.stringify(result, null, 2));
        return resolve(result);
      }
    )
  );

const addCaseForm = async (client, caseRef, eformDefinition, eformName) =>
  new Promise(function (resolve, reject) {
    eForm.FWTCaseEformNew.CaseReference =
      eForm.FLCaseEformInstance.CaseReference = caseRef;
    eForm.FWTCaseEformNew.EformName = eformDefinition;
    eForm.FLCaseEformInstance.EformName = eformName;
    client.addCaseEform(eForm,
      (err, result) => {
        if (err) {return reject(err);}

        return resolve(result);
      }
    );
  });


const writeFormData = async (client, caseRef, eform, msg) =>
  new Promise(function (resolve, reject) {
    eformData.FLEformFields.CaseEformInstance.EformName = eform.EformFields;
    eformData.FLEformFields.EformData = msg;
    eformData.FLEformFields.CaseEformInstance.CaseReference = caseRef;
    setEformValues(eformData.FLEformFields.EformData, caseRef);
    client.writeCaseEformData(eformData,
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

  const addAdditionalPerson = async (client, caseRef, eform, msg)=>
    new Promise(function(resolve, reject) {

  });


// const addDocument = (client, document) =>
//   new Promise((resolve, reject) =>
//     client.addDocumentToRepository(document,
//       (err, result) => (err ? reject(err) : resolve(result))
//     )
//   );

// const createNotes = (client, notes) =>
//   new Promise((resolve, reject) =>
//     client.createNotes(document,
//       (err, result) => (err ? reject(err) : resolve(result))
//     )
//   );

module.exports = {
  createPublicAllegationsCase: async msg => {
    let result = 0;

    const client = await createClient();

    const caseRef = await createCase(client);

    const eformDefinitions = config.ims.eformDefinitions.split(', ');
    const eforms = config.ims.eforms.split(', ');

    for (let i = 0; i < eformDefinitions.length; i++) {
      result = await addCaseForm(client, caseRef, eformDefinitions[i], eforms[i]);
      console.log('addCaseForm ' + eformDefinitions[i] + ' result: ' + JSON.stringify(result, null, 2));

      result = await writeFormData(client, caseRef, eforms[i], msg);
      console.log('writeFormData ' +  eforms[i] + ' result: ' + JSON.stringify(result, null, 2));
    }

    // result = await addDocument(client, document);
    // console.log('addDocument result: ' + JSON.stringify(result, null, 2));

    // result = await createNotes(client, notes);
    // console.log('createNotes result: ' + JSON.stringify(result, null, 2));
  }
};
