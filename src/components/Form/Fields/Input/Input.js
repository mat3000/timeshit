import React from 'react';
import asField from '../../field';
import './Input.scss';

const Input = ({ state, api, label, disabled, onChange, ...rest }) => {
  return (
    <p className={`Input ${disabled ? '-disabled' : ''}`}>
      <label className="Input__group">
        <span className="Input__label">{label}</span>
        <input
          type="text"
          value={state.value}
          onChange={({ target }) => {
            api.setValue(target.value);
            api.setTouched();
            onChange(target);
          }}
          onBlur={({ target }) => {
            if (state.touched) {
              api.checkError(target.value);
            }
          }}
          className="Input__field"
          disabled={disabled}
          {...rest}
        />
        {state.error && <span className="Input__error">{state.error}</span>}
      </label>
    </p>
  );
};

export default asField(Input);
