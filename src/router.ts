import { Router } from 'express';
const router = Router();
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
import { settings } from '@config/settings';

const oauth2Client = new OAuth2(
  settings.GOOGLE.CLIENT_ID,
  settings.GOOGLE.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({
  refresh_token: settings.GOOGLE.REFRESH_TOKEN,
});

router.get('/', (req, res) => {
  return res.json({ hello: 'Wordl' });
});

router.get('/contacts', async (req, res) => {
  const { people, otherContacts } = google.people({
    version: 'v1',
    auth: oauth2Client,
  });

  const response = await people.connections.list({
    resourceName: 'people/me',
    personFields: 'names,phoneNumbers',
  });

  return res.json(response.data);
});

router.get('/contacts/create', async (req, res) => {
  const { people } = google.people({
    version: 'v1',
    auth: oauth2Client,
  });

  const response = await people.createContact({
    requestBody: {
      names: [
        {
          givenName: 'Prueba de contacto 2',
        },
      ],
      phoneNumbers: [
        {
          type: 'mobile',
          value: '4111267601',
        },
      ],
      organizations: [
        {
          name: 'Spammer',
        },
      ],
    },
  });

  return res.json(response);
});

router.get('/contacts/:contact', async (req, res) => {
  const query = req.params.contact;

  const { people } = google.people({
    version: 'v1',
    auth: oauth2Client,
  });

  const response = await people.searchContacts({
    readMask: 'names,phoneNumbers',
    query,
  });

  return res.json(response.data);
});

export default router;
