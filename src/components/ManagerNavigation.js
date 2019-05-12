import React from 'react';
import ManagerActions from "../actions/ManagerActions";

class ManagerNavigation extends React.Component {


    render() {
        return (
            <div className="card" id="navigationBox">
                <div className="card-header">Manager Navigation Bar</div>
                <div className="card-body">
                    <div>
                        <button className="btn btn-dark btn-block" onClick={()=>{ManagerActions.ListOrders()}}>List orders & jobs</button>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-dark btn-block" onClick={()=>{ManagerActions.showStatistic()}}>Check statistic</button>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }

}

export default ManagerNavigation
