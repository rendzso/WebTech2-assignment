import React from 'react';
import CustomerActions from "../actions/CustomerActions";
import CustomerStore from "../stores/CustomerStore";

class CustomerList extends React.Component{

    constructor(props) {
        super(props);
        CustomerActions.showCustomer();
        this._onChange = this._onChange.bind(this);
        this.state = { customers : []};
    }

    _onChange(){
        this.setState({customers: CustomerStore._customer});
    }

    componentDidMount(){
        CustomerStore.addChangeListener(this._onChange)
    }

    componentWillUnmount(){
        CustomerStore.removeChangeListener(this._onChange)
    }





    render(){
        return(

            <div className="card">
                <div className="card-header">Customers</div>
                <div className="card-body">
                    <ul className="list-group">
                        {
                            this.state.customers.map((customer)=>{
                                return (
                                    <li key={customer.customerID}
                                        className="list-group-item"
                                        >
                                        CustomerID: {customer.customerID}<br/>
                                        Name: {customer.name}<br/>
                                        Living place: {customer.place}<br/>
                                        Phone number: {customer.phone}
                                    </li>)
                            })
                        }
                    </ul>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }
}

export default CustomerList
