import { derived } from 'overmind';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { initialUserPreferences } from './initialState';

export const state = {
  ready: false,

  newTaskStatus: false,
  // taskEdit: { taskId: -1, status: '-hidden' },

  weekIndex: null,
  datesOfTheWeek: [],
  daySelected: derived((state) => {
    return format(state.datesOfTheWeek[state.select.indexDay], 'yyyy-MM-dd', {
      locale: fr,
    });
  }),

  select: {
    indexDay: -1,
    timeStart: 0,
    timeEnd: 0,
  },

  userPreferences: { ...initialUserPreferences },

  steps: derived((state) => {
    if (!state.userPreferences.weekOfWork.length) return [];
    const minHour = state.userPreferences.weekOfWork.reduce(
      (acc, day) => (day.hours[0] < acc ? day.hours[0] : acc),
      36
    );
    const maxHour = state.userPreferences.weekOfWork.reduce(
      (acc, day) => (day.hours[1] > acc ? day.hours[1] : acc),
      0
    );
    const length = (maxHour - minHour) / state.userPreferences.step;
    const array = Array(length).keys();
    return [...array].map((e, i) => {
      return {
        integer: Number.isInteger((i + 1) * state.userPreferences.step),
        timeStart: i * state.userPreferences.step + minHour,
        timeEnd:
          i * state.userPreferences.step + minHour + state.userPreferences.step,
        percentStart: i * (100 / length),
        percentEnd: (i + 1) * (100 / length),
      };
    });
  }),
};
