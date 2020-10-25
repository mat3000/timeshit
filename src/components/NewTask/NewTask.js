import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import Form, { Autocomplete, Checkbox, Textarea } from '../Form';
import { useOvermind } from '../../overmind';
import NewClient from '../NewClient/NewClient';
import './NewTask.scss';

const NewTask = () => {
  const formApi = useRef(null);
  const { state, actions } = useOvermind();
  const [disabled, setDisabled] = useState(true);

  /*  order by label */
  const clients = [...state.Clients.clients].sort((a, b) => {
    const bandA = a.label.toUpperCase();
    const bandB = b.label.toUpperCase();
    let comparison = 0;
    if (a.id === 0) comparison = 1;
    else if (b.id === 0) comparison = -1;
    else if (bandA > bandB) comparison = 1;
    else if (bandA < bandB) comparison = -1;
    return comparison;
  });

  return (
    <div className={`NewTask ${state.Timeline.newTaskStatus ? '-show' : ''}`}>
      <Form
        onSubmit={(formData) => {
          actions.Tasks.newTask({
            date: state.Timeline.daySelected,
            clientId: formData.client.id,
            description: formData.description,
            consider: !!formData.consider,
            time: [
              state.Timeline.select.timeStart,
              state.Timeline.select.timeEnd,
            ],
          });
          actions.Timeline.resetSelect();
        }}
        getApi={(e) => (formApi.current = e)}
      >
        <Autocomplete
          name="client"
          options={clients}
          placeholder="Client..."
          label="Client"
          newOption={(label, validate, cancel) => (
            <NewClient label={label} validate={validate} cancel={cancel} />
          )}
          onChange={() => {
            if (formApi.current.getValue('client').value.id !== -1) {
              setDisabled(false);
            } else {
              setDisabled(true);
            }
          }}
        />
        <Textarea
          name="description"
          label="Description"
          rows="5"
          disabled={disabled}
        />
        <button type="submit" disabled={disabled}>
          Valider
        </button>
        <button
          type="button"
          onClick={() => {
            actions.Timeline.resetSelect();
          }}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={() => {
            formApi.current.resetAll();
            setDisabled(true);
          }}
        >
          reset
        </button>
      </Form>
    </div>
  );
};

export default NewTask;
