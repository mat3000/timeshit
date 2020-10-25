import { auth } from './services';

export const login = async ({ state }, { login, password }) => {
  state.loading = true;
  const result = await auth.signInWithEmailAndPassword(login, password);
  state.loading = false;
  state.uid = result.user.uid;
};

export const logout = async ({ state, actions }) => {
  state.loading = true;
  await auth.signOut();
  state.uid = null;
  state.loading = false;
};
