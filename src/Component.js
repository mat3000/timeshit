import React from 'react';
import { useOvermind } from './overmind';
import './styles.scss';

function Component() {
  console.log('Component');
  const { state, actions } = useOvermind();

  return (
    <div className="Truc">
      {state.uid}
      <button onClick={() => actions.setType('a')}>a</button>
      <button onClick={() => actions.setType('b')}>b</button>
    </div>
  );
}

export default Component;
