export default async ({ state, effects }) => {
  // const opt = await effects.Timeline.getOptions();
  // const userPreferences = {
  //   weekOfWork: [
  //     { day: 0, hours: [10, 18] },
  //     { day: 1, hours: [9, 18] },
  //     // { day: 2, hours: [7, 24] },
  //     // { day: 2, hours: [9, 18] },
  //     { day: 3, hours: [9, 18] },
  //     { day: 4, hours: [9, 17] },
  //   ],
  //   break: [13, 14],
  //   step: 0.25,
  //   ...opt,
  //   clientsColors: opt.clientsColors ? [...state.Timeline.generalParameters.defaultClientsColors, ...opt.clientsColors] : state.Timeline.generalParameters.defaultClientsColors,
  // };
  const { weekIndex, datesOfTheWeek } = effects.Timeline.getDates(new Date());
  state.Timeline.weekIndex = weekIndex;
  state.Timeline.datesOfTheWeek = datesOfTheWeek;
  // state.Timeline.userPreferences = userPreferences;
  // state.Clients.clients = [
  //   {
  //     id: 0,
  //     label: 'Absence',
  //     color: '#CCC',
  //     description: 'Congés, arrêt maladie, etc...',
  //     noConsider: false,
  //   },
  //   {
  //     id: 1,
  //     label: 'Test',
  //     color: '#C36',
  //     description: 'Ceci est un test...',
  //     noConsider: false,
  //   },
  // ];
  // state.Tasks.tasksOfTheWeek = [
  //   {
  //     indexDay: 0,
  //     date: '2020-08-17',
  //     tasks: [
  //       {
  //         time: [10, 10.5],
  //         clientId: 0,
  //         description: 'azerty',
  //       },
  //       {
  //         time: [11, 13],
  //         clientId: 1,
  //         description: 'qsdfghj',
  //       },
  //     ],
  //   },
  // ];
};
