import React, { useState, useEffect, useRef } from 'react';
import Form, { Autocomplete, Checkbox, Textarea } from '../Form';
import { useOvermind } from '../../overmind';
import './NewClient.scss';

const FormNewClient = ({ label, validate, cancel }) => {
  const { state, actions } = useOvermind();
  const [color, setColor] = useState('');
  const [prefix, setPrefix] = useState('');
  const [description, setDescription] = useState('');
  const [consider, setConsider] = useState(true);

  return (
    <div className="FormNewClient">
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Couleur :</span>
        {state.Timeline.userPreferences.clientsColors.map((c, i) => (
          <div
            key={i}
            onClick={() => setColor(c)}
            className={`FormNewClient__color ${color === c ? '-current' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </label>
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Identifiant :</span>
        <input
          onChange={({ target }) => setPrefix(target.value)}
          className="FormNewClient__textarea"
          rows={5}
        />
      </label>
      <label className="FormNewClient__group">
        <span className="FormNewClient__label">Description :</span>
        <textarea
          onChange={({ target }) => setDescription(target.value)}
          className="FormNewClient__textarea"
          rows={5}
        />
      </label>
      <label className="FormNewClient__group">
        <input
          type="checkbox"
          checked={consider}
          onChange={({ target }) => setConsider(target.checked)}
          className="FormNewClient__checkbox"
        />
        <span className="FormNewClient__labelCheckbox">
          Prendre en compte :
        </span>
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          actions.Clients.newClient({
            label,
            color,
            prefix,
            description,
            consider,
          }).then((newClientId) => validate(newClientId));
        }}
      >
        Valider
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          cancel();
        }}
      >
        Annuler
      </button>
    </div>
  );
};

export default FormNewClient;
