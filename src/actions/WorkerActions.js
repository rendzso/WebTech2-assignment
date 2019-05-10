import ShutterDispatcher from '../dispatcher/ShutterDispatcher'

class WorkerActions {

    showNavigation() {
        ShutterDispatcher.handleViewAction({
            actionType: "ShowWorkerNavigation",
            payload: null
        });
    }

    showAvailable() {
        ShutterDispatcher.handleViewAction({
            actionType: "ShowWorkerAvailableWorks",
            payload: null
        });
    }

}

export default new WorkerActions();
