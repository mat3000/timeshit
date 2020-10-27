import React from 'react';
import ReactDOM from 'react-dom';
import { createOvermind } from 'overmind';
import { config } from './overmind';
import { Provider } from 'overmind-react';

import Firebase from './Firebase';
import Back from './components/Back/Back';
import Timelines from './components/Timeline/Timeline';
import NewTask from './components/NewTask/NewTask';
// import EditTask from '../EditTask/EditTask';
// import Options from '../Options/Options';
import './styles.scss';

const overmind = createOvermind(config);

function App() {
  return (
    <Provider value={overmind}>
      <Firebase />
      <div className="App">
        <Back />
        <div className="App__content">
          <Timelines />
          <NewTask />
          {/* <EditTask /> */}
          {/* <Options /> */}
        </div>
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
