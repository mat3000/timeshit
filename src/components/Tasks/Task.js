import React from 'react';
import { useOvermind } from '../../overmind';
import {
  useToolsStep,
  useConvertTimeToHour,
  useEvent,
  useCumulativeOffset,
} from '../hooks';

import './Task.scss';

const Task = ({ task, indexDay }) => {
  const { state, actions } = useOvermind();
  const { getPercentByTime } = useToolsStep(indexDay);

  const start = getPercentByTime(task.time[0]);
  const end = getPercentByTime(task.time[1]);
  const client = state.Clients.clients.reduce(
    (a, c) => (c.id === task.clientId ? c : a),
    {}
  );

  return (
    <div
      className={`Task ${task.noConsider ? '-noConsider' : ''}`}
      style={{ top: `${start}%`, height: `${end - start}%` }}
      // onMouseDown={e => mouseDown(e, 'move')}
    >
      <div
        className="Task__resize-top"
        // onMouseDown={e => mouseDown(e, 'top')}
      />
      <div className="Task__back">
        <div
          className="Task__color"
          style={{ backgroundColor: client.color }}
        />
      </div>
      <span className="Task__label">{client.label}</span>
      <span className="Task__times">
        {/* {convertTimeToHour(task.time[1] - task.time[0])} */}
      </span>
      <span className="Task__description">{task.description}</span>
      {/* <button className="Task__remove" onClick={e => remove(e)}>
        x
      </button> */}
      {/* <button className="Task__edit" onClick={e => edit(e)}>
        edit
      </button> */}
      <div
        className="Task__resize-bottom"
        // onMouseDown={e => mouseDown(e, 'bottom')}
      />
    </div>
  );
};

export default Task;
