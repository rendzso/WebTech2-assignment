import React from 'react'
import CustomerActions from "../actions/CustomerActions";
import CustomerStore from "../stores/CustomerStore";

class CustomerOrderForm extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            customerID: '',
            windowHeight: '',
            windowWidth: '',
            shutterType: '',
            shutterColor: ''
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
                <div className="card-header">Order Menu</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-4">User Name</div>
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
                                <div className="col-4">Height of the window</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.windowHeight = event.target.value
                                            this.setState({windowHeight: this.state.windowHeight});
                                        }}
                                        type="text"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-4">Width of the window</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.windowWidth = event.target.value
                                            this.setState({windowWidth: this.state.windowWidth});
                                        }}
                                        type="text"/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-4">Shutter type</div>
                                <div className="col-8">
                                    <select
                                        onChange={(event) => {
                                            this.state.shutterType = event.target.value
                                            this.setState({shutterType: this.state.shutterType});
                                        }}
                                    >
                                        <option value="simple">Simple</option>
                                        <option value="simpleWithMosquitoNet">Simple + Mosquito net</option>
                                        <option value="automata">Automata</option>
                                        <option value="automataWithMosquitoNet">Automata + Mosquito net</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-4">Shutter color</div>
                                <div className="col-8">
                                    <input
                                        onChange={(event) => {
                                            this.state.shutterColor = event.target.value
                                            this.setState({shutterColor: this.state.shutterColor});
                                        }}
                                        type="text"/>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    CustomerActions.registerOrder(this.state)
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

export default CustomerOrderForm
