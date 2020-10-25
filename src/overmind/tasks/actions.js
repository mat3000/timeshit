import { initialState } from './initialState';
import { db } from '../../overmind/services';

export const resetState = ({ state }) => {
  state.Tasks = { ...initialState };
};

export const setLoadingStatus = async ({ state }, status) => {
  state.Tasks.loading = status;
};

export const setTaskByDate = async ({ state }, rawTasks) => {
  state.Tasks.tasksList = {
    ...state.Tasks.tasksList,
    ...(rawTasks || {}),
  };
};

export const newTask = ({ state }, newTask) => {
  return db
    .ref(`/users/${state.uid}/tasks`)
    .push(newTask)
    .then((snapshot) => console.log(snapshot.key));
};
