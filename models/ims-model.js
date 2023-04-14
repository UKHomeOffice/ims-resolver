"use strict";
const soap = require('strong-soap').soap;
const config = require('../config');
const wsdlUrl = config.ims.wsdl;

const auth = `Basic:${Buffer.from(`${config.ims.apiUser}:${config.ims.apiPassword}`).toString('base64')}`;

let eForm = {
  FWTCaseEformNew : {
    CaseReference : null,
    EformName : null
  },
  FLCaseEformInstance : {
    CaseReference : null,
    EformName : null
  }
};

let eformData = {
  FLEformFields : {
    CaseEformInstance : {
      CaseReference : null,
      EformName : config.ims.eformName
    },
    EformData : null
  }
};

let document = {
  FWTDocument : {
    Document : 'VGhpcyBpcyBhIHRlc3Q',
    DocumentType : 1,
    DocumentName : 'test.txt'
  }
};

let notes = {
  FWTNoteToParentRef : {
    ParentId : null,
    ParentType : 0,
    NoteDetails : {
      Text: null,
        NoteLabels : {
          NoteLabel : 'test note label'
        },
       NoteAttachments : {
         NoteAttachmentList : {
          AttachmentName : 'test.txt',
          AttachmentIdentifier : null,
          AttachmentType: 0
         }
       }
    }
  }
};

const createClient = () =>
  new Promise((resolve, reject) =>
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, (err, client) => {
      if (err)
        return reject(err);
      client.setEndpoint(config.ims.endpoint);
      client.setSecurity(new soap.BasicAuthSecurity(config.ims.apiUser, config.ims.apiPassword));
      return resolve(client);
    }
  )
);

/************************************************************
 * @param {Object} caseType type of case to create
 * @param {Object} caseType.FWTCaseCreate
 * @param {String} caseType.FWTCaseCreate.ClassificationEventCode
 ************************************************************/
const createCase = (client, caseType) =>
  new Promise((resolve, reject) =>
      client.createCase(caseType,
      (err, result) => {
          if (err)
          return reject(err);
      console.log('Case reference: ' + JSON.stringify(result, null, 2));
      return resolve(result);
    }
  )
);

/************************************************************
 * @param {Object} eForm Case eForm to add
 * @param {Object} eForm.FWTCaseEformNew
 * @param {Object} eForm.FWTCaseEformNew.CaseReference
 * @param {String} eForm.FWTCaseEformNew.EformName
 ************************************************************/
  const addCaseForm = (client, caseRef, eformDefinition, eformName) =>
    new Promise(function(resolve, reject){
      eForm.FWTCaseEformNew.CaseReference =
      eForm.FLCaseEformInstance.CaseReference = caseRef;
      eForm.FWTCaseEformNew.EformName = eformDefinition;
      eForm.FLCaseEformInstance.EformName = eformName;
      client.addCaseEform(eForm,
        (err, result) => {
          if (err)
            return reject(err);

          return resolve(result);
        }
      )
    });

  /************************************************************
   * @param {Object} eformData Case eForm data
   * @param {Object} eformData.FLEformFields
   * @param {Object} eformData.FLEformFields.CaseEformInstance
   * @param {String} eformData.FLEformFields.CaseEformInstance.CaseReference
   * @param {String} eformData.FLEformFields.CaseEformInstance.EformName
   * @param {String} eformData.FLEformFields.EformData
   ************************************************************/
  const writeFormData = (client, caseRef, eform, msg) =>
    new Promise(function(resolve, reject) {
      eformData.FLEformFields.CaseEformInstance.EformName = eform;

      const obj = JSON.parse(msg);
      eformData.FLEformFields.EformData = obj;
      let ids = {};
      eformData.FLEformFields.EformData.EformFields.map((item, index) => {ids[item.FieldName] = index})
      eformData.FLEformFields.CaseEformInstance.CaseReference =
      eformData.FLEformFields.EformData.EformFields[ids["casenum"]].FieldValue =
      eformData.FLEformFields.EformData.EformFields[ids["casenum_1"]].FieldValue =
      eformData.FLEformFields.EformData.EformFields[ids["caseid"]].FieldValue =
      eformData.FLEformFields.EformData.EformFields[ids["caseref"]].FieldValue = caseRef;

      client.writeCaseEformData(eformData,
        (err, result) => (err ? reject(err) : resolve(result))
      )
    });


  const addDocument = (client, document) =>
    new Promise((resolve, reject) =>
      client.addDocumentToRepository(document,
        (err, result) => (err ? reject(err) : resolve(result))
      )
  );

  const createNotes = (client, notes) =>
    new Promise((resolve, reject) =>
      client.createNotes(document,
        (err, result) => (err ? reject(err) : resolve(result))
      )
  );

module.exports = {
  /** **********************************************************
   * @param {Object} caseType type of case to create
   * @param {Object} caseType.FWTCaseCreate
   * @param {String} caseType.FWTCaseCreate.ClassificationEventCode
   ************************************************************/
  createPublicAllegationsCase: async (caseType, msg) => {
    let result = 0;

    const client = await createClient();

    const caseRef = await createCase(client, caseType);

    var eformDefinitions = config.ims.eformDefinitions.split(", ");
    var eforms = config.ims.eforms.split(", ");

    for (let i = 0; i < eformDefinitions.length; i++) {
      result = await addCaseForm(client, caseRef, eformDefinitions[i], eforms[i]);
      console.log('addCaseForm ' + eformDefinitions[i] + ' result: ' + JSON.stringify(result, null, 2));

      result = await writeFormData(client, caseRef, eforms[i], msg);
      console.log('writeFormData ' +  eforms[i] + ' result: ' + JSON.stringify(result, null, 2));
    }

    // let result = await addCaseForm(client, caseRef, config.ims.eformDefinitionAllegationsEditable, config.ims.eformNameAllegationsHorizon);
    // console.log('addCaseForm Allegations EDITABLE result: ' + JSON.stringify(result, null, 2));

    // result = await writeFormData(client, caseRef, config.ims.eformNameAllegationsHorizon, msg);
    // console.log('writeFormData result: ' + JSON.stringify(result, null, 2));

    // result = await addCaseForm(client, caseRef);
    // console.log('addCaseForm result: ' + JSON.stringify(result, null, 2));

    // result = await writeFormData(client, caseRef, msg);
    // console.log('writeFormData result: ' + JSON.stringify(result, null, 2));

    // result = await addCaseForm(client, caseRef);
    // console.log('addCaseForm result: ' + JSON.stringify(result, null, 2));

    // result = await writeFormData(client, caseRef, msg);
    // console.log('writeFormData result: ' + JSON.stringify(result, null, 2));


   // result = await addDocument(client, document);
   // console.log('addDocument result: ' + JSON.stringify(result, null, 2));

   // result = await createNotes(client, notes);
    //console.log('createNotes result: ' + JSON.stringify(result, null, 2));
  }
}
