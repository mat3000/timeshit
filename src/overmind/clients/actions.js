import { initialClients } from './initialState';

export const mergeClientList = async ({ state, effects }, clientList) => {
  if (clientList) {
    const formatedClientList = Object.entries(clientList).map(
      ([id, value]) => ({
        id,
        ...value,
      })
    );
    state.Clients.clients = [...initialClients, ...formatedClientList];
  }
};

export const newClient = async ({ state, effects }, client) => {
  return await effects.Clients.newClient(state.uid, client);
};
