'use strict';

const soap = require('strong-soap').soap;
const config = require('../config');
const fv = require('../lib/file-vault-utils');
const logger = require('../lib/logger');

const settings = config.verint;
const wsdlUrl = settings.wsdl;
const auth = `Basic:${Buffer.from(`${settings.apiUser}:${settings.apiPassword}`).toString('base64')}`;

const createClient = async () =>
  new Promise((resolve, reject) =>
    soap.createClient(wsdlUrl, { wsdl_headers: { Authorization: auth } }, (err, client) => {
      if (err) { return reject(err); }
      client.setEndpoint(settings.endpoint);
      client.setSecurity(new soap.BasicAuthSecurity(settings.apiUser, settings.apiPassword));
      return resolve(client);
    })
  );

// Creates a populated form
const createForm = async (client, request) =>
  new Promise((resolve, reject) =>
    client.Create(request, (err, result) => {
      if (err) { return reject(err); }
      return resolve(result);
    })
  );

// Updates an existing form
const updateForm = async (client, request) =>
  new Promise((resolve, reject) =>
    client.Update(request, (err, result) => {
      if (err) { return reject(err); }
      return resolve(result);
    })
  );

// Attaches a file to a form
const attachFile = async (client, request) =>
  new Promise((resolve, reject) =>
    client.AttachFile(request, (err, result) => {
      if (err) { return reject(err); }
      return resolve(result);
    })
  );

const buildFormData = msg => {
  const fields = (msg.EformFields || []).map(({ FieldName, FieldValue }) => ({
    name: FieldName,
    value: FieldValue
  }));

  const today = new Date();
  const minutes = today.getMinutes();
  fields.push(
    { name: 'dtBORec', value: today.toLocaleDateString('en-GB') },
    { name: 'tmBORec', value: `${today.getHours()}:${minutes < 10 ? '0' : ''}${minutes}` }
  );

  return {
    'form-data': { field: fields }
  };
};

module.exports = {
  createPublicAllegationsCase: async msg => {
    if (typeof settings.formName !== 'string' || !settings.formName.trim()) {
      throw new Error('Form name is not configured');
    }

    const attachments = msg.Attachments ?? [];
    if (attachments.length && (typeof settings.attachmentField !== 'string' || !settings.attachmentField.trim())) {
      throw new Error('Attachment field is not configured');
    }

    const client = await createClient();
    logger.debug('Service SOAP client created');

    const createRequest = {
      name: settings.formName,
      data: buildFormData(msg)
    };

    const response = await createForm(client, createRequest);
    if (response?.status !== 'success' || !response?.ref) {
      throw new Error('Failed to create Verint form');
    }

    const formRef = response.ref;
    if (attachments.length) {
      const fvToken = await fv.auth();

      for (const attachment of attachments) {
        if (
          typeof attachment.url !== 'string' || !attachment.url ||
          typeof attachment.name !== 'string' || !attachment.name ||
          typeof attachment.mimetype !== 'string' || !attachment.mimetype
        ) {
          throw new Error('Attachment URL, filename, and MIME type are required');
        }

        const bytes = await fv.getFile(attachment.url, fvToken);
        const attachResponse = await attachFile(client, {
          ref: formRef,
          filename: attachment.name,
          file: Buffer.from(bytes).toString('base64'),
          mimetype: attachment.mimetype,
          field: settings.attachmentField
        });

        if (attachResponse?.status !== 'success') {
          throw new Error('Failed to attach file to form');
        }
      }
    }
  }
};
