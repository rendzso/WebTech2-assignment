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

    selectItem(details){
        ShutterDispatcher.handleViewAction({
            actionType: "selectItem",
            payload : details
        });
    }

    showSelected(workerID) {
        ShutterDispatcher.handleViewAction({
            actionType: "ShowWorkerSelectedWorks",
            payload: workerID
        });
    }

    finishItem(details){
        ShutterDispatcher.handleViewAction({
            actionType: "finishItem",
            payload : details
        });
    }

}

export default new WorkerActions();
