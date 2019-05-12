import React from 'react';
import WorkStore from "../stores/WorkStore";
import WorkerActions from "../actions/WorkerActions"
import ManagerActions from "../actions/ManagerActions";

class ManagerListOrders extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {works: [], date_value: ""}
    }

    _onChange() {
        this.setState({works: WorkStore._work});
    }

    componentDidMount() {
        WorkStore.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkStore.removeChangeListener(this._onChange)
    }


    render() {
        return (

            <div className="card">
                <div className="card-header">List of available works</div>
                <div className="card-body">
                    {this.state.works !== undefined &&
                    <ul className="list-group">
                        {
                            this.state.works.map((work) => {
                                return (
                                    <li key={work.customerID + work.orderID}
                                        className="list-group-item pb-2"
                                    >
                                        CustomerID: {work.customerID}<br/>
                                        OrderID: {work.orderID}<br/>
                                        Order details:<br/>
                                        <ul className="list-group">
                                            {work.items.map((item) => {
                                                return (
                                                    <li key={work.customerID + work.orderID + item.itemID}
                                                        className="list-group-item">
                                                        ItemID: {item.itemID}<br/>
                                                        Window details: Height: {item.windowHeight} cm,
                                                        Width: {item.windowWidth} cm<br/>
                                                        Shutter type: {item.shutterType}, Shutter
                                                        color: {item.shutterColor}<br/>
                                                        Shutter parts:
                                                        <ul className="list-group">
                                                            {item.shutterParts.map((partname) => {
                                                                return (
                                                                    <li key={work.customerID + work.orderID + item.itemID + partname}
                                                                        className="list-group-item">
                                                                        {partname}
                                                                    </li>)
                                                            })}
                                                        </ul>
                                                        ShutterPrice: {item.shutterPrice}$<br/>
                                                        Worker: {item.worker}, Status: {item.shutterStatus}

                                                    </li>)
                                            })}
                                        </ul>
                                        Submitted by customer: {work.submitted}<br/>
                                        Order status: {work.status}, Estimated deliveryTime: {work.deliveryTime}<br/>
                                        Payed: {work.payed}<br/>
                                        Date to delivery: <input hidden={work.status!=="organize"} id={work.customerID + work.orderID+"date"} className="w-50 mb-2" type="date" defaultValue={this.state.date_value} onChange={(event) => {
                                        this.state.date_value = event.target.value
                                        this.setState({date_value: this.state.date_value});
                                    }}/><br/>
                                        <button className="btn btn-dark mb-2" disabled={work.status!=="organize"} onClick={()=>{ManagerActions.OrgenizeOrder({"customerID": work.customerID, "orderID": work.orderID, "date": this.state.date_value})}}>Organize</button>
                                        <button className="btn btn-dark ml-2 mr-2 mb-2" disabled={work.status!=="creatingReceipt"} onClick={()=>{ManagerActions.CreateReceipt({"customerID": work.customerID, "orderID": work.orderID})}}>Create receipt</button>
                                        <button className="btn btn-dark mb-2" onClick={()=>{ManagerActions.CustomerDetails(work.customerID)}}>Show customer
                                            details
                                        </button>
                                        <div id="demo" className={"collapse" + (this.state.open ? ' in' : '')}>
                                            <div className="card card-body">
                                                It is the customer details body!!
                                            </div>
                                        </div>
                                    </li>)
                            })
                        }
                    </ul>
                    }
                </div>

                <div className="card-footer"></div>
            </div>
        )
    }
}

export default ManagerListOrders
