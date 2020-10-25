import { format, addDays, startOfWeek } from 'date-fns';
import fr from 'date-fns/locale/fr';

// export const getOptions = async (): Promise<any> => {
//   const options: any = await indexedDB('options').getAll();
//   return options.reduce((a: any, e: any) => ({ ...a, [e.label]: e.value }), {});
// };

export const getColors = async () => {
  return Promise.resolve([
    '#8a3636',
    '#36898a',
    '#cba321',
    '#012e5a',
    '#af8989',
    '#4e4e4e',
    '#4a8a36',
  ]);
};

export const getDates = (date) => {
  const weekIndex = parseInt(format(date, 'w', { locale: fr }), 10);
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const datesOfTheWeek = [0, 1, 2, 3, 4, 5, 6].map((index) =>
    addDays(monday, index)
  );
  return { weekIndex, datesOfTheWeek };
};

export const getTasksByWeek = async (datesOfTheWeek) => {
  // const rawTasks = datesOfTheWeek.map((date: any) => {
  //   return indexedDB('tasks').getByIndex('date', [
  //     format(date, 'yyyy-MM-dd', { locale: fr }),
  //   ]);
  // });
  // const tasks = await Promise.all(rawTasks);
  // return tasks.map(e => ({ tasks: e }));
  /* 
  [
    {
      tasks: [
        {
          time: [9.5, 11.75],
          clientId: 1,
          description: 'coucou',
          consider: false,
        },
        {
          time: [14, 16],
          clientId: 2,
          description: 'machin',
          consider: true,
        },
        {
          time: [16, 17],
          clientId: 0,
          description: 'Congés',
          consider: true,
          holiday: true,
        },
      ],
    },
  ]
  */
};
