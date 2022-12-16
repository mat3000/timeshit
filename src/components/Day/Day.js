import React, { useState } from 'react';
import { format, subDays, getTime } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../overmind';
import Steps from '../Steps/Steps';
import Tasks from '../Tasks/Tasks';
import Select from '../Select/Select';
import Export from '../Export/Export';
import './Day.scss';

export default ({ indexDay, hoursDay, now }) => {
  const { state } = useOvermind();
  const date = state.Timeline.datesOfTheWeek[indexDay];
  const [exportStatus, setExportStatus] = useState(false);

  const getPercentByTime = (time) =>
    state.Timeline.steps.reduce(
      (a, e) => (a === 100 && e.timeStart >= time ? e.percentStart : a),
      100
    );

  const start = getPercentByTime(hoursDay[0]);
  const end = getPercentByTime(hoursDay[1]);
  const toDay = format(date, 'yyyyMMdd') === now;
  const nextDay = getTime(subDays(Date.now(), 1)) > getTime(date);

  const { tasksList = [] } = state.Tasks;
  const totalHourDay = Object.entries(tasksList).reduce(
    (acc, [id, task]) =>
      task.date === format(date, 'yyyy-MM-dd') && !task.removed
        ? acc + (task.time[1] - task.time[0])
        : acc,
    0
  );

  return (
    <div className={`Timeline ${toDay ? '-today' : ''}`}>
      <div className="Timeline__date">
        {format(date, 'EEE d LLL', { locale: fr })}{' '}
        <span
          role="img"
          aria-label="alert"
          hidden={!nextDay || totalHourDay >= 7}
          title="Journée incomplète"
          style={{ fontSize: '12px', lineHeight: '10px' }}
        >
          ⚠️
        </span>
        <button
          className="Timeline__export"
          type="button"
          onClick={() => setExportStatus((e) => !e)}
        >
          ▾
        </button>
      </div>
      <div className="Timeline__wrap">
        {exportStatus && <Export indexDay={indexDay} date={date} />}
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
