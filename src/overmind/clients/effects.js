import { db } from '../services';

export const getClients = async (uid) => {
  return await db.ref(`/users/${uid}/userPreferences`).one('value');
};

export const newClient = async (uid, client) => {
  return db
    .ref(`/users/${uid}/clients`)
    .push(client)
    .then((snapshot) => ({ ...client, id: snapshot.key }));
};
