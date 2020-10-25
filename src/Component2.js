import React from 'react';
import { useOvermind } from './overmind';
import './styles.scss';

function Component() {
  console.log('Component2');
  const { state } = useOvermind();

  return (
    <div className="Truc">
      <h1>-{state.data}-</h1>
    </div>
  );
}

export default Component;
