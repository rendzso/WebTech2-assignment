import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

 class ManagerActions {

     showNavigation() {
         ShutterDispatcher.handleViewAction({
             actionType: "ShowManagerNavigation",
             payload: null
         });
     }

 }

export default new ManagerActions();
