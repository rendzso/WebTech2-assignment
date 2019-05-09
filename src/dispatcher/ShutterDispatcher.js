import {Dispatcher} from 'flux'
import React from 'react'
import ReactDOM from 'react-dom'

import CustomerStore from "../stores/CustomerStore";

class SakilaDispatcher extends Dispatcher{

    handleViewAction(action){
        this.dispatch({
            source : 'VIEW_ACTION',
            payload : action
        });
    }

}

const dispatcher = new SakilaDispatcher();

dispatcher.register((data)=>{
    if(data.payload.actionType !== "ListAllCustomer"){
        return;
    }
    fetch('/customer/list',{
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        }
    }).then(response =>{ return response.json()})
        .then(result =>{
            CustomerStore._stores = result;
            CustomerStore.emitChange();
        });
});
