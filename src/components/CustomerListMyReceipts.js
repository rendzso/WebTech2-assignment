import React from 'react';
import ReceiptStore from "../stores/ReceiptStore";

class CustomerListMyReceipts extends React.Component{

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = { receipts : []};
    }

    _onChange(){
        this.setState({receipts: ReceiptStore._receipt});
    }

    componentDidMount(){
        ReceiptStore.addChangeListener(this._onChange)
    }

    componentWillUnmount(){
        ReceiptStore.removeChangeListener(this._onChange)
    }





    render(){
        return(

            <div className="card">
                <div className="card-header">My receipts list</div>
                <div className="card-body">
                    {this.state.receipts !== undefined &&
                    <ul className="list-group">
                        {
                            this.state.receipts.map((receipt) => {
                                return (
                                    <li key={receipt.orderID}
                                        className="list-group-item"
                                    >
                                        Customer name: {receipt.name}, CustomerID: {receipt.customerID}<br/>
                                        Address: {receipt.address}, Phone: {receipt.phone}<br/>
                                        OrderID: {receipt.orderID}, Total price: {receipt.total} $ , Payed: {receipt.payed}, Dateline pay: {receipt.dateline}<br/>
                                        Order details:
                                        <ul className="list-group" key={receipt["order"].orderID}>
                                            <li className="list-group-item">
                                                OrderID: {receipt["order"].orderID}<br/>
                                                Delivery time: {receipt["order"].deliveryTime}
                                                {receipt["order"]["items"].map((itemdetails) => {
                                                    return(
                                                        <ul className="list-group" key={itemdetails.itemID}>
                                                            <li className="list-group-item">
                                                                ItemID: {itemdetails.itemID}<br/>
                                                                Window details: Height: {itemdetails.windowHeight} cm, Width: {itemdetails.windowWidth} cm<br/>
                                                                Shutter type: {itemdetails.shutterType}, Shutter color: {itemdetails.shutterColor}<br/>
                                                                Price: {itemdetails.shutterPrice}$<br/>
                                                            </li>
                                                        </ul>)
                                                })}
                                            </li>
                                        </ul>
                                        <button className="btn btn-dark pt-2" disabled={receipt.payed === "payed"} >Pay this order</button>
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

export default CustomerListMyReceipts
