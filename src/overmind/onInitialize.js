export default async ({ state, effects }) => {
  state.loading = true;
  state.uid = await effects.authInit();
  state.loading = false;
};
