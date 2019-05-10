import React from 'react';
import CustomerActions from "../actions/CustomerActions";
import CustomerStore from "../stores/CustomerStore";

class CustomerNavigation extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            customerID: ''
        }
    }


    _onChange() {
        this.setState({});
    }

    componentDidMount() {
        CustomerStore.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        CustomerStore.removeChangeListener(this._onChange)
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">Customer Navigation Bar</div>
                <div className="card-body">
                    <div>
                        <button className="btn btn-dark btn-block" onClick={()=>{CustomerActions.showRegisterForm()}}>Register</button>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-dark btn-block" onClick={()=>{CustomerActions.showOrderForm()}}>Order</button>
                    </div>
                    <div className="pt-2 text-center">
                        <input className="w-70" type="text" defaultValue="My user name" onChange={(event) => {
                            this.state.customerID = event.target.value
                            this.setState({customerID: this.state.customerID});
                        }}/>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-dark btn-block" onClick={()=>{CustomerActions.listMyOrders(this.state.customerID)}}>Show my orders</button>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-dark btn-block">Show my receipts</button>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }

}

export default CustomerNavigation
