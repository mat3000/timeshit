import React, { useState, useRef, useEffect } from 'react';
import Form, { Autocomplete, Textarea, Input } from '../Form';
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

  // const clientValue = formApi?.current?.getValue('client')?.value?.prefix;
  // // // console.log(clientValue);

  useEffect(() => {
    if (state.Timeline.newTaskStatus && state.Tasks.clipboard) {
      //console.log('clipboard', state.Tasks.clipboard.clientId);
      const clientLabel = state.Clients.clients.find(
        ({ id }) => id === state.Tasks.clipboard.clientId
      );
      formApi.current.setValue('client', {
        label: clientLabel.label,
        id: state.Tasks.clipboard.clientId,
      });
      formApi.current.setValue('ticket', state.Tasks.clipboard.ticket);
      formApi.current.setValue(
        'description',
        state.Tasks.clipboard.description
      );
      setDisabled(false);

      actions.Tasks.clearClipboard();
    }
  }, [
    state.Timeline.newTaskStatus,
    state.Clients.clients,
    state.Tasks.clipboard,
    actions.Tasks,
  ]);

  return (
    <div className={`NewTask ${state.Timeline.newTaskStatus ? '-show' : ''}`}>
      <Form
        onSubmit={(formData) => {
          actions.Tasks.newTask({
            date: state.Timeline.daySelected,
            clientId: formData.client.id,
            ticket: formData.ticket || '',
            description: formData.description || '',
            consider: true,
            time: [
              state.Timeline.select.timeStart,
              state.Timeline.select.timeEnd,
            ],
          });
          actions.Timeline.resetSelect();
        }}
        getApi={(e) => (formApi.current = e)}
      >
        <div className="NewTask__form">
          <div className="NewTask__form__field">
            <Autocomplete
              name="client"
              options={clients}
              placeholder="Client..."
              label="Client"
              newOption={(label, validate, cancel) => (
                <NewClient label={label} validate={validate} cancel={cancel} />
              )}
              onChange={() => {
                formApi.current.setValue('description', '');
                const prefix = formApi.current.getValue('client').value.prefix;
                formApi.current.setValue('ticket', prefix || '');
                if (formApi.current.getValue('client').value.id !== -1) {
                  setDisabled(false);
                } else {
                  setDisabled(true);
                }
              }}
              autoComplete="off"
            />
          </div>
          <div className="NewTask__form__field">
            <Input
              name="ticket"
              label="N° ticket"
              rows="2"
              onChange={(e) => {
                const clientCurrent = state.Clients.clients.find(({ prefix }) =>
                  e.value.includes(prefix)
                );
                if (clientCurrent) {
                  formApi.current.setValue('client', clientCurrent);
                }
              }}
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <Textarea
            name="description"
            label="Description"
            rows="2"
            disabled={disabled}
          />
        </div>
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
