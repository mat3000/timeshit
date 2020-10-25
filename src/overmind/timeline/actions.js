import { addDays, subDays } from 'date-fns';
import { initialUserPreferences } from './initialState';

export const resetState = ({ state }) => {
  state.Timeline.userPreferences = { ...initialUserPreferences };
};
export const mergeUserPreferences = ({ state }, userPreferences) => {
  if (userPreferences) {
    state.Timeline.ready = true;
    state.Timeline.userPreferences = {
      ...state.Timeline.userPreferences,
      ...userPreferences,
    };
  } else {
    state.Timeline.ready = true;
  }
};

export const nextWeek = async ({ state, actions, effects }) => {
  actions.Timeline.resetSelect();

  const { weekIndex, datesOfTheWeek } = effects.Timeline.getDates(
    addDays(state.Timeline.datesOfTheWeek[0], 7)
  );

  // state.tasks = await effects.getTasksByWeek(datesOfTheWeek);
  state.Timeline.weekIndex = weekIndex;
  state.Timeline.datesOfTheWeek = datesOfTheWeek;
};

export const previousWeek = async ({ state, actions, effects }) => {
  actions.Timeline.resetSelect();

  const { weekIndex, datesOfTheWeek } = effects.Timeline.getDates(
    subDays(state.Timeline.datesOfTheWeek[0], 7)
  );

  // state.tasks = await effects.Timeline.getTasksByWeek(datesOfTheWeek);
  state.Timeline.weekIndex = weekIndex;
  state.Timeline.datesOfTheWeek = datesOfTheWeek;
};

// export const updateOption = ({ state }, { label, value }) => {
//   state.Timeline.options[label] = value;
//   indexedDB('options').update([{ label, value }]);
// };

// export const toggleOptionsStatus = ({ state }) => {
//   state.Timeline.options.status = !state.Timeline.options.status;
// };

export const setSelect = ({ state }, { indexDay, timeStart, timeEnd }) => {
  state.Timeline.select = {
    indexDay,
    timeStart,
    timeEnd,
  };
};

export const newTaskStatus = ({ state }, status) => {
  state.Timeline.newTaskStatus = status;
};

export const resetSelect = ({ state }) => {
  state.Timeline.select = {
    indexDay: -1,
    timeStart: 0,
    timeEnd: 0,
  };
  state.Timeline.newTaskStatus = false;
};
