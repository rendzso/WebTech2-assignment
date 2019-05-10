import React from 'react';
import './App.scss';
import CustomerActions from "./actions/CustomerActions"
import CustomerNavigation from "./components/CustomerNavigation";

function App() {

    return (
      <>
          <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
              <ul className="navbar-nav">
                  <li className="nav-item">
                      <a className="nav-link" href="#">Register Customer</a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" onClick={()=>{CustomerActions.showNavigation()}}>Customer</a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">Worker</a>
                  </li>
                  <li className="nav-item">
                      <a className="nav-link" href="#">Manager</a>
                  </li>
              </ul>
          </nav>
          <div className="App container-fluid">
              <div className="row">
                  <div className="col-md-1"></div>
                  <div className="col-md-4" id="leftcontent">
                  </div>
                  <div className="col-md-6" id="rightcontent">
                  </div>
                  <div className="col-md-1"></div>
              </div>
          </div>
</>
  );
}

export default App;
