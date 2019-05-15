import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

 class ManagerActions {

     showNavigation() {
         ShutterDispatcher.handleViewAction({
             actionType: "ShowManagerNavigation",
             payload: null
         });
     }

     ListOrders() {
         ShutterDispatcher.handleViewAction({
             actionType: "ManagerListOrders",
             payload: null
         });
     }

     CustomerDetails(customerID) {
         ShutterDispatcher.handleViewAction({
             actionType: "ManagerShowCustomerDetails",
             payload: customerID
         });
     }

     OrgenizeOrder(details) {
         ShutterDispatcher.handleViewAction({
             actionType: "ManagerOrganizeOrder",
             payload: details
         });
     }

     CreateReceipt(details) {
         ShutterDispatcher.handleViewAction({
             actionType: "ManagerCreateReceipt",
             payload: details
         });
     }

     showStatistic() {
         ShutterDispatcher.handleViewAction({
             actionType: "ManagerShowStatistic",
             payload: null
         });
     }

 }

export default new ManagerActions();
