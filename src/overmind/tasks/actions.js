import { initialState } from './initialState';
import { db } from '../../overmind/services';

export const copy = ({ state }, task) => {
  state.Tasks.clipboard = task;
};

export const clearClipboard = ({ state }) => {
  state.Tasks.clipboard = null;
};

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
  return db.ref(`/users/${state.uid}/tasks`).push(newTask);
};

export const updateTask = ({ state }, { taskId, timeStart, timeEnd, save }) => {
  state.Tasks.tasksList[taskId] = {
    ...state.Tasks.tasksList[taskId],
    time: [timeStart, timeEnd],
  };

  if (save) {
    return db
      .ref(`/users/${state.uid}/tasks/${taskId}`)
      .set(state.Tasks.tasksList[taskId]);
  }
};

export const remove = ({ state }, taskId) => {
  state.Tasks.tasksList[taskId] = {
    ...state.Tasks.tasksList[taskId],
    removed: true,
  };

  return db
    .ref(`/users/${state.uid}/tasks/${taskId}`)
    .set(state.Tasks.tasksList[taskId]);
};
