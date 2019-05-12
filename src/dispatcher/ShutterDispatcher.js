import {Dispatcher} from 'flux'

import CustomerStore from "../stores/CustomerStore";
import ReactDom from "react-dom";
import React from "react";
import CustomerList from "../components/CustomerList";
import CustomerNavigation from "../components/CustomerNavigation";
import CustomerRegisterForm from "../components/CustomerRegisterForm";
import OrderRegisterForm from "../components/CustomerOrderForm";
import OrderStore from "../stores/OrderStore"
import CustomerListMyOrders from "../components/CustomerListMyOrders"
import CustomerActions from "../actions/CustomerActions";
import CustomerListMyReceipts from "../components/CustomerListMyReceipts";
import ReceiptStore from "../stores/ReceiptStore";
import WorkerNavigation from "../components/WorkerNavigation"
import WorkerListOfWorks from "../components/WorkerListOfWorks";
import WorkStore from "../stores/WorkStore"
import WorkerActions from "../actions/WorkerActions";

class ShutterDispatcher extends Dispatcher {

    handleViewAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            payload: action
        });
    }

}

const dispatcher = new ShutterDispatcher();

dispatcher.register((data) => {
    if (data.payload.actionType !== "ListAllCustomer") {
        return;
    }

    fetch('/customer/list', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            CustomerStore._customer = result;
            CustomerStore.emitChange();
        })
        .then(()=>{ReactDom.render(
        React.createElement(CustomerList),
        document.getElementById("rightcontent")
    )});


    CustomerStore.emitChange();
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowNavigation") {
        return;
    }

    ReactDom.render(
        React.createElement(CustomerNavigation),
        document.getElementById('leftcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "showRegisterForm") {
        return;
    }

    ReactDom.render(
        React.createElement(CustomerRegisterForm),
        document.getElementById('rightcontent')
    );

});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "registerCustomer"){
        return;
    }

    fetch('/customer/addCustomer',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "showOrderForm") {
        return;
    }

    ReactDom.render(
        React.createElement(OrderRegisterForm),
        document.getElementById('rightcontent')
    );

});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "registerOrder"){
        return;
    }

    fetch('/customer/addOrder',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            alert(result)
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ListMyOrders") {
        return;
    }

    fetch('/customer/listCustomer?customerID='+data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            OrderStore._order = result;
            OrderStore.emitChange();
        })
        .then(()=>{ReactDom.render(
            React.createElement(CustomerListMyOrders),
            document.getElementById("bigcontent")
        )
            OrderStore.emitChange();});


    OrderStore.emitChange();
});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "submitOrder"){
        return;
    }

    fetch('/customer/submitOrder',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            CustomerActions.listMyOrders(data.payload.payload.customerID)
            alert(result)
            OrderStore.emitChange()
        })
});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ListMyReceipts") {
        return;
    }

    fetch('/customer/listReceipts?customerID='+data.payload.payload, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            ReceiptStore._receipt = result;
            ReceiptStore.emitChange();
        })
        .then(()=>{ReactDom.render(
            React.createElement(CustomerListMyReceipts),
            document.getElementById("bigcontent")
        )
            ReceiptStore.emitChange();});


    ReceiptStore.emitChange();
});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "payReceipt"){
        return;
    }

    fetch('/customer/pay',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            CustomerActions.listMyReceipts(data.payload.payload.customerID)
            alert(result)
            ReceiptStore.emitChange()
        })
});


dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowWorkerNavigation") {
        return;
    }

    ReactDom.render(
        React.createElement(WorkerNavigation),
        document.getElementById('leftcontent')
    );

});

dispatcher.register((data) => {
    if (data.payload.actionType !== "ShowWorkerAvailableWorks") {
        return;
    }

    fetch('/worker/list', {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        console.log(response)
        return response.json()
    })
        .then(result => {
            WorkStore._work = result;
            WorkStore.emitChange();
        })
        .then(()=>{ReactDom.render(
            React.createElement(WorkerListOfWorks),
            document.getElementById("rightcontent")
        )
            WorkStore.emitChange();});


    WorkStore.emitChange();
});

dispatcher.register((data)=>{
    if(data.payload.actionType !== "selectItem"){
        return;
    }

    fetch('/worker/select',{
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data.payload.payload)
    })
        .then((response) => {return response.text()})
        .then((result)=>{
            WorkerActions.showAvailable(data.payload.payload.customerID)
            alert(result)
            WorkStore.emitChange()
        })
});

export default dispatcher;
