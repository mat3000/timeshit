import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useOvermind } from '../../overmind';
import Day from '../Day/Day';
import { useConvertTimeToHour } from '../hooks';
import './Timeline.scss';

let timeout = null;
export default () => {
  const [menu, setMenu] = useState(false);
  const { state, actions } = useOvermind();
  const [now, setNow] = useState(format(new Date(), 'yyyyMMdd'));
  const convertTimeToHour = useConvertTimeToHour();

  const tasksObj = Object.values(state.Tasks.tasksList).reduce((a, e) => {
    if (e.removed) return a;
    if (a[e.clientId]) {
      return { ...a, [e.clientId]: e.time[1] - e.time[0] + a[e.clientId] };
    }
    return { ...a, [e.clientId]: e.time[1] - e.time[0] };
  }, {});

  const tasksArr = Object.entries(tasksObj).map(([clientId, time]) => {
    const client = state.Clients.clients.reduce(
      (a, c) => (c.id === clientId ? c : a),
      {}
    );
    return {
      client: client.label,
      color: client.color,
      time,
    };
  });

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

  useEffect(() => {
    document.addEventListener('visibilitychange', (e) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setNow(format(new Date(), 'yyyyMMdd'));
      }, 500);
    });
  }, []);

  return (
    <div className="Timelines">
      <div className="Timelines__date">
        <button
          className="Timelines__previous"
          onClick={() => actions.Timeline.previousWeek()}
        />
        <div className="Timelines__date__content">
          <div>
            <b>Semaine {state.Timeline.weekIndex}</b>
            {' / '}
            {dateStart}
            {' - '}
            {dateEnd}
          </div>
          <button
            onClick={() => setMenu((e) => !e)}
            className="Timelines__date__button"
          >
            🗂
          </button>
          <div className="Timelines__date__menu" hidden={!menu}>
            {tasksArr.map(({ client, color, time }) => (
              <div
                className="Timelines__date__menu__item"
                style={{ background: color }}
              >
                <div className="Timelines__date__menu__item__client">
                  {client}
                </div>
                <div className="Timelines__date__menu__item__time">
                  {convertTimeToHour(time)}
                </div>
                <div className="Timelines__date__menu__item__time">
                  <b>
                    {(time / 8).toLocaleString('fr', {
                      maximumFractionDigits: 1,
                    })}{' '}
                    jours
                  </b>{' '}
                  (journée de 8h)
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="Timelines__next"
          onClick={() => actions.Timeline.nextWeek()}
        />
      </div>
      <div className="Timelines__content">
        {state.Timeline.userPreferences.weekOfWork.map(
          ({ day, hours }, index) => (
            <Day key={index} indexDay={day} hoursDay={hours} now={now} />
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
