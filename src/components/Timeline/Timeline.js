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

  const tasksArr = Object.entries(tasksObj)
    .map(([clientId, time]) => {
      const client = state.Clients.clients.reduce(
        (a, c) => (c.id === clientId ? c : a),
        {}
      );
      return {
        client: client.label,
        color: client.color,
        time,
      };
    })
    .sort((a, b) => {
      return b.time - a.time;
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

  const total = tasksArr.reduce((a, e) => a + e.time, 0);

  const cumulDay = {};
  state.Timeline.userPreferences.weekOfWork.forEach(({ day, hours }, index) => {
    const date = format(state.Timeline.datesOfTheWeek[day], 'yyyy-MM-dd');
    const tasksOfTheDay = Object.entries(state.Tasks.tasksList).reduce(
      (acc, [id, task]) =>
        task.date === date && !task.removed ? [...acc, { id, ...task }] : acc,
      []
    );
    tasksOfTheDay.forEach((e) => {
      if (cumulDay[e.clientId]) {
        cumulDay[e.clientId] += e.time[1] - e.time[0];
      } else {
        cumulDay[e.clientId] = e.time[1] - e.time[0];
      }
    });
  });

  const truc = Object.entries(cumulDay).map(([clientId, time]) => {
    const { label } = state.Clients.clients.reduce(
      (a, c) => (c.id === clientId ? c : a),
      {}
    );
    return { label, time, hours: convertTimeToHour(time) };
  });

  console.log(cumulDay);
  console.log(truc);

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
            <div
              className="Timelines__date__menu__item"
              style={{ background: 'grey' }}
            >
              <div className="Timelines__date__menu__item__client">Total</div>
              <div className="Timelines__date__menu__item__time">
                {Math.round(total / 7)}j {convertTimeToHour(total % 7)}
              </div>
              <div className="Timelines__date__menu__item__time">
                <b>
                  {((total / 7) * 400).toLocaleString('fr', {
                    minimunFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  €{' '}
                </b>
                brut
              </div>
              <div className="Timelines__date__menu__item__time">
                <b>
                  {(
                    (total / 7) * 400 -
                    ((total / 7) * 400 * 24.6) / 100
                  ).toLocaleString('fr', {
                    minimunFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  €{' '}
                </b>
                net
              </div>
            </div>
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
                {time / 7 >= 1 && (
                  <>
                    <div className="Timelines__date__menu__item__time">
                      <b>
                        {(time / 7).toLocaleString('fr', {
                          maximumFractionDigits: 1,
                        })}{' '}
                        jours
                      </b>{' '}
                      (journée de 7h)
                    </div>
                  </>
                )}
                {time / 7 / 5 >= 1 && (
                  <div className="Timelines__date__menu__item__time">
                    <b>
                      {(time / 7 / 5).toLocaleString('fr', {
                        maximumFractionDigits: 1,
                      })}{' '}
                      semaines
                    </b>{' '}
                    (semaine de 5 jours)
                  </div>
                )}
                <div className="Timelines__date__menu__item__time">
                  <b>{Math.round((time / 7) * 400)} €</b>
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
        <div style={{ flex: '0 0 300px' }}>
          {truc.map(({ label, hours }) => (
            <div>
              <div style={{ color: '#FFF' }}>
                {label}: {hours}
                <hr />
              </div>
            </div>
          ))}
        </div>
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
