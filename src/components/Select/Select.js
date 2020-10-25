import React, { useRef } from 'react';
import { useOvermind } from '../../overmind';
import {
  useToolsStep,
  useConvertTimeToHour,
  useEvent,
  useCumulativeOffset,
} from '../hooks';
import './Select.scss';

const Select = ({ indexDay }) => {
  const timelineRef = useRef(null);
  const { state, actions } = useOvermind();
  const { select } = state.Timeline;
  const convertTimeToHour = useConvertTimeToHour();
  const { getPercentByTime } = useToolsStep(indexDay);
  const event = useEvent();
  const cumulativeOffset = useCumulativeOffset();
  const { getLimitByPercent } = useToolsStep(indexDay);
  const top = getPercentByTime(select.timeStart);
  const bottom = getPercentByTime(select.timeEnd);
  const duration = select.timeEnd - select.timeStart;
  // const isSmall = duration < 1;

  const update = (top, height, downPageY, movePageY) => {
    const percentStart = ((downPageY - top) / height) * 100;
    const percentEnd = ((movePageY - top) / height) * 100;
    const [timeStart, timeEnd] = getLimitByPercent(percentStart, percentEnd);
    actions.Timeline.setSelect({
      indexDay,
      timeStart,
      timeEnd,
    });
  };

  const mouseMove = (eventMove, left, height, downPageY) => {
    eventMove.preventDefault();
    const movePageY = eventMove.pageY;
    update(left, height, downPageY, movePageY);
  };

  const mouseup = (eventEnd, left, height, downPageY) => {
    eventEnd.preventDefault();
    const movePageY = eventEnd.pageY;
    event.removeEventListener('mousemove.timeline');
    event.removeEventListener('mouseup.timeline');
    update(left, height, downPageY, movePageY);
    actions.Timeline.newTaskStatus(true);
  };

  const mouseDown = (eventDown) => {
    eventDown.preventDefault();
    const node = timelineRef.current;
    const { top } = cumulativeOffset(node);
    const height = node?.offsetHeight;
    const downPageY = eventDown.pageY;

    event.removeEventListener('mousemove.timeline');
    event.removeEventListener('mouseup.timeline');

    event.addEventListener('mousemove.timeline', (eventMove) => {
      mouseMove(eventMove, top, height, downPageY);
    });

    event.addEventListener('mouseup.timeline', (eventEnd) =>
      mouseup(eventEnd, top, height, downPageY)
    );
    actions.Timeline.newTaskStatus(false);
  };

  return (
    <div ref={timelineRef} className="Select" onMouseDown={mouseDown}>
      {select.indexDay === indexDay && (
        <div
          className={`Select__item`}
          style={{
            top: `${top}%`,
            height: `${bottom - top}%`,
          }}
        >
          <span className="Select__back">
            <span className="Select__center">
              {convertTimeToHour(select.timeStart)}
            </span>
            <span className="Select__center">
              {convertTimeToHour(duration)}
            </span>
            <span className="Select__center">
              {convertTimeToHour(select.timeEnd)}
            </span>
          </span>
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="Select"
  //     // ref={timelineRef}
  //     onMouseDown={mouseDown}
  //   >
  //     {state.Timeline.select.indexDay === indexDay && (
  //       <div className={`Select__item ${isSmall ? '-small' : ''}`} style={{
  //         top: `${top}%`, height: `${bottom - top}%`,
  //       }}>
  //         <span className="Select__back">
  //           {isSmall ? (
  //             <span className="Select__center">
  //               {convertTimeToHour(state.Timeline.select.timeStart)} -{' '}
  //               {convertTimeToHour(state.Timeline.select.timeEnd)}
  //             </span>
  //           ) : (
  //               <>
  //                 <span className="Select__center">
  //                   {convertTimeToHour(state.Timeline.select.timeStart)}
  //                 </span>
  //                 <span className="Select__center">
  //                   {convertTimeToHour(duration)}
  //                 </span>
  //                 <span className="Select__center">
  //                   {convertTimeToHour(state.Timeline.select.timeEnd)}
  //                 </span>
  //               </>
  //             )}
  //         </span>
  //       </div>
  //     )}
  //   </div >
  // );
};

export default Select;
