import React from 'react';
import { format } from 'date-fns';
import { useOvermind } from '../../overmind';
import { useConvertTimeToJira, useConvertTimeToHourEn } from '../hooks';
import './Export.scss';

const Tasks = ({ indexDay, date }) => {
  const formatedDate = format(date, 'yyyy-MM-dd');
  const { state } = useOvermind();
  const convertTimeToJira = useConvertTimeToJira();
  const convertTimeToHourEn = useConvertTimeToHourEn();
  const { tasksList = [] } = state.Tasks;
  const tasksOfTheDay = Object.entries(tasksList).reduce(
    (acc, [id, task]) =>
      task.date === formatedDate && !task.removed
        ? [...acc, { id, ...task }]
        : acc,
    []
  );

  const test = tasksOfTheDay
    .sort((a, b) => {
      const clientA = state.Clients.clients.find(
        (client) => client.id === a.clientId
      );
      const clientB = state.Clients.clients.find(
        (client) => client.id === b.clientId
      );
      return clientA.label.localeCompare(clientB.label);
    })
    .reduce((acc, task) => {
      const client = state.Clients.clients.find(
        (client) => client.id === task.clientId
      );
      const newDate = format(date, 'dd/LLL/yy');
      const start = `${newDate} ${convertTimeToHourEn(task.time[0])}`;

      if (task.ticket) {
        const id = `${task.ticket}-${task.clientId}`;
        if (acc[id]) {
          acc[id].time += task.time[1] - task.time[0];
          if (acc[id].startTime > task.time[0]) {
            acc[id].startTime = task.time[0];
            acc[id].startHour = start;
          }
          return { ...acc };
        } else {
          return {
            ...acc,
            [id]: {
              client: client.label,
              ticket: task.ticket,
              description: task.description,
              time: task.time[1] - task.time[0],
              startTime: task.time[0],
              startHour: start,
            },
          };
        }
      } else if (task.description) {
        const id = `${task.description}-${task.clientId}`;
        if (acc[id]) {
          acc[id].time += task.time[1] - task.time[0];
          if (acc[id].startTime > task.time[0]) {
            acc[id].startTime = task.time[0];
            acc[id].startHour = start;
          }
          return { ...acc };
        } else {
          return {
            ...acc,
            [id]: {
              client: client.label,
              ticket: task.ticket,
              description: task.description,
              time: task.time[1] - task.time[0],
              startTime: task.time[0],
              startHour: start,
            },
          };
        }
      }
      return {
        ...acc,
        [task.id]: {
          client: client.label,
          ticket: task.ticket,
          description: task.description,
          time: task.time[1] - task.time[0],
          startTime: task.time[0],
          startHour: start,
        },
      };
    }, {});

  return (
    <div className="Export">
      <div className="Export__content">
        {Object.values(test).map((value) => (
          <div className="Export__item">
            <input
              type="text"
              readonly
              value={value.client}
              onClick={(e) => e.target.select()}
              className="Export__title"
            />
            <span
              className="Export__link"
              onClick={() =>
                window.open(
                  `https://iolab.atlassian.net/browse/${
                    value.ticket || value.description
                  }`,
                  'name',
                  'width=1200,height=900'
                )
              }
            >
              {value.ticket || value.description || '-'}
            </span>
            <input
              type="text"
              readonly
              value={convertTimeToJira(value.time)}
              onClick={(e) => e.target.select()}
              className="Export__input"
            />
            <input
              type="text"
              readonly
              value={value.startHour}
              onClick={(e) => e.target.select()}
              className="Export__input"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
