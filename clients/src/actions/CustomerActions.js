import SakilaDispatcher from '../dispatcher/SakilaDispatcher'

class CustomerActions {

    showCustomer(){
        SakilaDispatcher.handleViewAction({
            actionType: "ListAllCustomer",
            payload : null
        });
    }
}

export default new CustomerActions();
