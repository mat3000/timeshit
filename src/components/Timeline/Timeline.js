import React from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../overmind';
import Day from '../Day/Day';
// import { IconSettings } from '../Icon';
import './Timeline.scss';

export default () => {
  const { state, actions } = useOvermind();
  const dateStart =
    (state.Timeline.datesOfTheWeek &&
      state.Timeline.datesOfTheWeek.length &&
      format(new Date(state.Timeline.datesOfTheWeek[0]), 'd LLLL yyyy', {
        locale: fr,
      })) ||
    '';
  const dateEnd =
    (state.Timeline.datesOfTheWeek.length &&
      format(
        new Date(
          state.Timeline.datesOfTheWeek[
            state.Timeline.datesOfTheWeek.length - 1
          ]
        ),
        'd LLLL yyyy',
        {
          locale: fr,
        }
      )) ||
    '';

  return (
    <div className="Timelines">
      <div className="Timelines__date">
        <button
          className="Timelines__previous"
          onClick={() => actions.Timeline.previousWeek()}
        />
        <span>
          <b>Semaine {state.Timeline.weekIndex}</b>
          {' / '}
          {dateStart}
          {' - '}
          {dateEnd}
        </span>
        <button
          className="Timelines__next"
          onClick={() => actions.Timeline.nextWeek()}
        />
      </div>
      <div className="Timelines__content">
        {state.Timeline.userPreferences.weekOfWork.map(
          ({ day, hours }, index) => (
            <Day key={index} indexDay={day} hoursDay={hours} />
          )
        )}
      </div>
      <div className="Timelines__nav">
        <button
          className="Timelines__option"
          // onClick={() => actions.Timeline.toggleOptionsStatus()}
        >
          {/* <IconSettings /> */}
        </button>
      </div>
    </div>
  );
};
