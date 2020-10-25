import { merge, namespaced } from 'overmind/config';
import { createHook } from 'overmind-react';
import onInitialize from './onInitialize';
import { state } from './state';
import * as actions from './actions';
import * as effects from './effects';
import * as Timeline from './timeline';
import * as Clients from './clients';
import * as Tasks from './tasks';

export const config = merge(
  {
    onInitialize,
    state,
    actions,
    effects,
  },
  namespaced({
    Timeline,
    Clients,
    Tasks,
  })
);

export const useOvermind = createHook();
