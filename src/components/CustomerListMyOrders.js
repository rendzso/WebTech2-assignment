import React from 'react';
import CustomerActions from "../actions/CustomerActions";
import OrderStore from "../stores/OrderStore";

class CustomerListMyOrders extends React.Component{

    constructor(props) {
        super(props);
        //CustomerActions.listMyOrders();
        this._onChange = this._onChange.bind(this);
        this.state = { orders : [], total: 0, customer: ""};
    }

    _onChange(){
        this.setState({orders: OrderStore._order});
    }

    componentDidMount(){
        OrderStore.addChangeListener(this._onChange)
    }

    componentWillUnmount(){
        OrderStore.removeChangeListener(this._onChange)
    }





    render(){
        return(

            <div className="card">
                <div className="card-header">My order list</div>
                <div className="card-body">
                    {this.state.orders !== undefined &&
                    <ul className="list-group">
                        {
                            this.state.orders.map((order) => {
                                this.state.total = 0;
                                this.state.customerID = order.customerID;
                                return (
                                    <li key={order.orderID}
                                        className="list-group-item"
                                    >
                                        CustomerID: {order.customerID}, OrderID: {order.orderID}<br/>
                                        Submitted: {order.submitted}, Status: {order.status}<br/>
                                        Delivery Time: {order.deliveryTime}, Payed: {order.payed}<br/>
                                        Item list:
                                        {order["items"].map((item) =>{
                                            this.state.total += item.shutterPrice
                                            return (
                                                <ul className="list-group" key={item.itemID}>
                                                <li className="list-group-item">
                                                    ItemID: {item.itemID}<br/>
                                                    Window Size: Height: {item.windowHeight} cm, Width: {item.windowWidth} cm<br/>
                                                    Shutter type: {item.shutterType}<br/>
                                                    Shutter prise: {item.shutterPrice} $

                                                </li>
                                                </ul>
                                            )
                                        })
                                        }
                                        Total price: {this.state.total} $<br/>
                                        <button className="btn btn-dark" disabled={order.submitted === "submitted"} onClick={()=>{CustomerActions.submitOrder({"customerID": this.state.customerID, "orderID": order.orderID})}}>Submit the order</button>
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

export default CustomerListMyOrders
