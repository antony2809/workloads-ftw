import React, { PureComponent } from 'react';

import { WorkloadListContainer } from '../WorkloadList';
import { WorkloadFormContainer } from '../WorkloadForm';
import './App.css';


class App extends PureComponent {
  render() {
    return (
      <div>
        <h1>CloudWork</h1>
        <hr />
        
        <div >
          <WorkloadFormContainer />
        </div>
        <hr />

        <div>
          <h2>Workloads</h2>
          <WorkloadListContainer />
        </div>
      </div>
    );
  }
}

export default App;
