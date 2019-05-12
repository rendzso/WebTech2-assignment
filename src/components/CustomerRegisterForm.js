import React from 'react'
import CustomerActions from "../actions/CustomerActions";
import CustomerStore from "../stores/CustomerStore";

class CustomerRegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            customerID: '',
            name: '',
            phone: '',
            place: ''
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
            <div className="card" id="boxes">
                <div className="card-header">Customer Registration Menu</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-4">User Name(customerID)</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.customerID = event.target.value
                                            this.setState({customerID: this.state.customerID});
                                        }}
                                        type="text"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">Real Name</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.name = event.target.value
                                            this.setState({name: this.state.name});
                                        }}
                                        type="text"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-4">Phone Number</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.phone = event.target.value
                                            this.setState({phone: this.state.phone});
                                        }}
                                        type="text"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-4">Living Place</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.place = event.target.value
                                            this.setState({place: this.state.place});
                                        }}
                                        type="text"/>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    CustomerActions.registerCustomer(this.state)
                                }}
                                className="btn btn-dark">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        );
    }
}

export default CustomerRegisterForm
