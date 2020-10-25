import { auth } from './services';

export const authInit = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      resolve(firebaseUser?.uid);
      return;
    });
  });
};
