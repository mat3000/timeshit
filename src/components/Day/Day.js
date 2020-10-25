import React from 'react';
import { format, subDays, getTime } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../overmind';
import Steps from '../Steps/Steps';
import Tasks from '../Tasks/Tasks';
import Select from '../Select/Select';
import './Day.scss';

export default ({ indexDay, hoursDay }) => {
  const { state } = useOvermind();
  const date = state.Timeline.datesOfTheWeek[indexDay];

  const getPercentByTime = (time) =>
    state.Timeline.steps.reduce(
      (a, e) => (a === 100 && e.timeStart >= time ? e.percentStart : a),
      100
    );

  const start = getPercentByTime(hoursDay[0]);
  const end = getPercentByTime(hoursDay[1]);
  const toDay = format(date, 'yyyyMMdd') === format(new Date(), 'yyyyMMdd');
  const nextDay = getTime(subDays(Date.now(), 1)) > getTime(date);
  // const totalHourDay =
  //   day[1] - day[0] - (state.options.break.end - state.options.break.start);
  // const totalWorkedHourDay = tasks.tasks.reduce((a, e) => {
  //   return a + (e.time[1] - e.time[0]);
  // }, 0);

  // console.log('Day', indexDay);

  return (
    <div className={`Timeline ${toDay ? '-today' : ''}`}>
      <div className="Timeline__date">
        {format(date, 'EEE d LLL', { locale: fr })}{' '}
        <span
          role="img"
          aria-label="alert"
          hidden={!nextDay}
          // hidden={!nextDay || totalHourDay === totalWorkedHourDay}
          title="Journée incomplète"
          style={{ fontSize: '12px', lineHeight: '10px' }}
        >
          ⚠️
        </span>
      </div>
      <div className="Timeline__wrap">
        <div
          className="Timeline__item"
          style={{ height: `${end - start}%`, top: `${start}%` }}
        >
          <Select indexDay={indexDay} />
          <Tasks indexDay={indexDay} date={format(date, 'yyyy-MM-dd')} />
          <Steps indexDay={indexDay} isToday={toDay} />
        </div>
      </div>
    </div>
  );
};
