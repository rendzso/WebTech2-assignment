import React from 'react';
import CustomerActions from "../actions/CustomerActions";

class CustomerNavigation extends React.Component {

    render() {
        return (
            <div className="card">
                <div className="card-header">Customer Navigation Bar</div>
                <div className="card-body">
                    <div className="p-2">
                        <button className="btn btn-dark btn-block" onClick={()=>{CustomerActions.showRegisterForm()}}>Register</button>
                    </div>
                    <div className="p-2">
                        <button className="btn btn-dark btn-block" onClick={()=>{CustomerActions.showOrderForm()}}>Order</button>
                    </div>
                    <div className="p-2">
                        <button className="btn btn-dark btn-block">Show my orders</button>
                    </div>
                    <div className="p-2">
                        <button className="btn btn-dark btn-block">Show my receipts</button>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }

}

export default CustomerNavigation
