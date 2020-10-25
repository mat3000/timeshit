import React from 'react';
import { useOvermind } from '../../overmind';
import './Back.scss';

const Back = () => {
  const { actions } = useOvermind();

  function handleClick(e) {
    e.preventDefault();
    actions.Timeline.resetSelect();
    actions.Timeline.newTaskStatus(false);
  }

  function handleKeyPress(e) {
    if (e.keyCode === 27) handleClick(e);
  }

  return (
    <div
      className="Back"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      role="button"
      tabIndex={0}
    />
  );
};

export default Back;
