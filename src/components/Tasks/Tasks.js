import React, { useState, useRef, useEffect } from 'react';
import { useOvermind } from '../../overmind';
import Task from './Task';
import './Tasks.scss';

function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

const Tasks = ({ indexDay, date }) => {
  const [stepHeight, setStepHeight] = useState(0);
  const tasksRef = useRef(null);
  const { state } = useOvermind();
  const { tasksList = [] } = state.Tasks;
  const tasksOfTheDay = Object.entries(tasksList).reduce(
    (acc, [id, task]) =>
      task.date === date && !task.removed ? [...acc, { id, ...task }] : acc,
    []
  );

  useEffect(() => {
    const getStepHeight = () => {
      const { weekOfWork, step } = state.Timeline.userPreferences;
      const day = weekOfWork.find((e) => e.day === indexDay);
      if (day) {
        const lenghtStep = (day.hours[1] - day.hours[0]) / step;
        const lengthHeight = tasksRef.current.offsetHeight / lenghtStep;
        setStepHeight(lengthHeight);
      }
    };
    getStepHeight();
    const debouncedHandleResize = debounce(getStepHeight, 700);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [state, tasksRef, indexDay]);

  return (
    <div className="Tasks" ref={tasksRef}>
      {tasksOfTheDay.map((task, i) => (
        <Task
          task={task}
          indexDay={indexDay}
          tasksRef={tasksRef}
          key={i}
          stepHeight={stepHeight}
        />
      ))}
    </div>
  );
};

export default Tasks;
