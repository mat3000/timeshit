import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useOvermind } from './overmind';
import { db } from './overmind/services';
import './Firebase.scss';

function Firebase({ children }) {
  const { state, actions } = useOvermind();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const listRef = useRef([]);

  const singIn = (e) => {
    e.preventDefault();
    actions.login({ login, password });
  };
  const signOut = (e) => {
    e.preventDefault();
    actions.logout();
  };

  useEffect(() => {
    if (!state.uid) {
      actions.Timeline.resetState();
      actions.Tasks.resetState();
    }
    db.ref(`/users/${state.uid}/userPreferences`).on('value', (e) => {
      actions.Timeline.mergeUserPreferences(e.val());
    });
    db.ref(`/users/${state.uid}/clients`).on('value', (e) => {
      actions.Clients.mergeClientList(e.val());
    });
  }, [state.uid, actions]);

  useEffect(() => {
    if (state.uid && state.Timeline.ready) {
      listRef.current = [];
      actions.Tasks.setLoadingStatus(true);
      state.Timeline.userPreferences.weekOfWork.forEach((e) => {
        const date = state.Timeline.datesOfTheWeek[e.day];
        const formatedDate = format(date, 'yyyy-MM-dd');
        const ref = db
          .ref(`/users/${state.uid}/tasks`)
          .orderByChild('date')
          .equalTo(formatedDate);
        ref.on('value', (e) => {
          actions.Tasks.setTaskByDate(e.val());
          actions.Tasks.setLoadingStatus(false);
        });
        listRef.current.push(ref);
      });
    }

    return () => {
      listRef.current.map((e) => e.off());
    };
  }, [
    state.uid,
    state.Timeline.ready,
    state.Timeline.datesOfTheWeek,
    state.Timeline.userPreferences.weekOfWork,
    actions,
  ]);

  return (
    <div className="Firebase">
      <button onClick={signOut} hidden={!state.uid}>
        logout
      </button>
      <form onSubmit={singIn} hidden={state.uid}>
        <input
          name="login"
          placeholder="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Valider</button>
      </form>
      {state.loading && <div style={{ background: '#FFF' }}>loading uid</div>}
      {state.Timeline.loading && (
        <div style={{ background: '#FFF' }}>loading pref</div>
      )}
      {state.Tasks.loading && (
        <div style={{ background: '#FFF' }}>loading task</div>
      )}
      {children}
    </div>
  );
}

export default Firebase;
