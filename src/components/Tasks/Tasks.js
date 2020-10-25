import React from 'react';
import { useOvermind } from '../../overmind';
import Task from './Task';
import './Tasks.scss';

const Tasks = ({ indexDay, date }) => {
  const { state } = useOvermind();
  const { tasksList = [] } = state.Tasks;
  const tasksOfTheDay = Object.entries(tasksList).reduce(
    (acc, [id, task]) =>
      task.date === date && !task.removed ? [...acc, { id, ...task }] : acc,
    []
  );

  return (
    <div className="Tasks">
      {tasksOfTheDay.map((task, i) => (
        <Task task={task} indexDay={indexDay} key={i} />
      ))}
    </div>
  );
};

export default Tasks;
