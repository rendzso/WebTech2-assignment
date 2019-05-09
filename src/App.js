import React from 'react';
import './App.css';
import CustomerList from "./components/CustomerList"

function App() {
  return (
      <div className="App container-fluid">
        <div className="row">
          <div className="col-md-1"/>
          <div className="col-md-4" id="menuContentPanel">
            <CustomerList/>
          </div>
          <div className="col-md-6" id="mainContentPanel">

          </div>
          <div className="col-md-1"/>
        </div>
      </div>
  );
}

export default App;
