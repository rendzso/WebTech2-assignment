import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class CustomerActions {

    showNavigation(){
        ShutterDispatcher.handleViewAction({
            actionType: "ShowNavigation",
            payload : null
        });
    }

    showCustomer(){
        ShutterDispatcher.handleViewAction({
            actionType: "ListAllCustomer",
            payload : null
        });
    }

    showRegisterForm(){
        ShutterDispatcher.handleViewAction({
            actionType: "showRegisterForm",
            payload : null
        });
    }

    registerCustomer(customer){
        ShutterDispatcher.handleViewAction({
            actionType: "registerCustomer",
            payload : customer
        });
    }

    showOrderForm(){
        ShutterDispatcher.handleViewAction({
            actionType: "showOrderForm",
            payload : null
        });
    }

    registerOrder(orderdetails){
        ShutterDispatcher.handleViewAction({
            actionType: "registerOrder",
            payload : orderdetails
        });
    }

    listMyOrders(customerID){
        ShutterDispatcher.handleViewAction({
            actionType: "ListMyOrders",
            payload : customerID
        });
    }

    submitOrder(details){
        ShutterDispatcher.handleViewAction({
            actionType: "submitOrder",
            payload : details
        });
    }

    listMyReceipts(customerID){
        ShutterDispatcher.handleViewAction({
            actionType: "ListMyReceipts",
            payload : customerID
        });
    }

}

export default new CustomerActions();
