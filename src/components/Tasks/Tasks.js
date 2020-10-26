import React, { useRef } from 'react';
import { useOvermind } from '../../overmind';
import Task from './Task';
import './Tasks.scss';

const Tasks = ({ indexDay, date }) => {
  const tasksRef = useRef(null);
  const { state } = useOvermind();
  const { tasksList = [] } = state.Tasks;
  const tasksOfTheDay = Object.entries(tasksList).reduce(
    (acc, [id, task]) =>
      task.date === date && !task.removed ? [...acc, { id, ...task }] : acc,
    []
  );

  return (
    <div className="Tasks" ref={tasksRef}>
      {tasksOfTheDay.map((task, i) => (
        <Task task={task} indexDay={indexDay} tasksRef={tasksRef} key={i} />
      ))}
    </div>
  );
};

export default Tasks;
