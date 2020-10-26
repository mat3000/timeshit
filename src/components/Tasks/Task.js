import React, { useRef } from 'react';
import { useOvermind } from '../../overmind';
import {
  useToolsStep,
  useConvertTimeToHour,
  useEvent,
  useCumulativeOffset,
} from '../hooks';

import './Task.scss';

const Task = ({ task, indexDay, tasksRef }) => {
  const taskRef = useRef(null);
  const { state, actions } = useOvermind();
  const {
    getPercentByTime,
    getPercentByTimeEnd,
    getLimitByPercent,
  } = useToolsStep(indexDay);
  const convertTimeToHour = useConvertTimeToHour();
  const cumulativeOffset = useCumulativeOffset();
  const event = useEvent();

  const start = getPercentByTime(task.time[0]);
  const end = getPercentByTime(task.time[1]);
  const client = state.Clients.clients.reduce(
    (a, c) => (c.id === task.clientId ? c : a),
    {}
  );

  const update = (
    top,
    height,
    downPageY,
    movePageY = downPageY,
    type,
    save = false
  ) => {
    const initialTop = getPercentByTime(task.time[0]);
    const initialBottom = getPercentByTimeEnd(task.time[1]);
    const cursorStart = ((downPageY - top) / height) * 100;
    const cursorTop = ((movePageY - top) / height) * 100;

    const newTop = type === 'top' ? cursorTop : initialTop;
    const newBottom = type === 'bottom' ? cursorTop : initialBottom;

    const [timeStart, timeEnd] = getLimitByPercent(
      type === 'move' ? newTop + (cursorTop - cursorStart) : newTop,
      type === 'move' ? newBottom + (cursorTop - cursorStart) : newBottom
    );

    // const [newTimeStart, newTimeEnd] = resolveConflict(
    //   state.tasks[index].tasks,
    //   [tStart, tEnd],
    //   task.id
    // );

    actions.Tasks.updateTask({
      taskId: task.id,
      timeStart,
      timeEnd,
      save,
    });
  };

  const mouseup = (top, height, downPageY, eventEnd, type) => {
    eventEnd.preventDefault();
    event.removeEventListener('mousemove.timeline', () => mouseMove());
    event.removeEventListener('mouseup.timeline', () => mouseup());

    const movePageY = eventEnd.pageY;

    update(top, height, downPageY, movePageY, type, true);
    // actions.selectTask();
  };

  const mouseMove = (top, height, downPageY, eventMove, type) => {
    eventMove.preventDefault();
    const movePageY = eventMove.pageY;
    update(top, height, downPageY, movePageY, type);
  };

  const mouseDown = (eventDown, type) => {
    eventDown.stopPropagation();
    eventDown.preventDefault();

    const node = tasksRef.current;
    const { top } = cumulativeOffset(node);
    const height = node.offsetHeight;
    const downPageY = eventDown.pageY;

    actions.Timeline.resetSelect();
    // actions.selectTask(task.id);

    event.addEventListener('mousemove.timeline', (eventMove) => {
      mouseMove(top, height, downPageY, eventMove, type);
    });

    event.addEventListener('mouseup.timeline', (eventEnd) => {
      mouseup(top, height, downPageY, eventEnd, type);
    });
  };

  return (
    <div
      className={`Task ${task.noConsider ? '-noConsider' : ''}`}
      style={{ top: `${start}%`, height: `${end - start}%` }}
      onMouseDown={(e) => mouseDown(e, 'move')}
      ref={taskRef}
    >
      <div
        className="Task__resize-top"
        onMouseDown={(e) => mouseDown(e, 'top')}
      />
      <div className="Task__back">
        <div
          className="Task__color"
          style={{ backgroundColor: client.color }}
        />
      </div>
      <span className="Task__label">{client.label}</span>
      <span className="Task__times">
        {convertTimeToHour(task.time[1] - task.time[0])}
      </span>
      <span className="Task__description">{task.description}</span>
      {/* <button className="Task__remove" onClick={(e) => remove(e)}>
        x
      </button> */}
      {/* <button className="Task__edit" onClick={e => edit(e)}>
        edit
      </button> */}
      <div
        className="Task__resize-bottom"
        onMouseDown={(e) => mouseDown(e, 'bottom')}
      />
    </div>
  );
};

export default Task;
