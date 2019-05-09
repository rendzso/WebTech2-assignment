import React from 'react';
import CustomerActions from "../actions/CustomerActions";
import CustomerStore from "../store/CustomerStore";

class StoreList extends React.Component{

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
                <div className="card-header">Stores</div>
                <div className="card-body">
                    <ul className="list-group">
                        {
                            this.state.customers.map((customer)=>{
                                return (
                                    <li key={customer.customerID}
                                        className="list-group-item"
                                        >
                                        {customer.name},<br/>
                                        {customer.phone}, {customer.place}
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

export default StoreList
