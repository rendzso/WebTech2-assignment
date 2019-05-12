import EventEmitter from 'events'

class WorkStore extends EventEmitter{

    _work = []
    _actualWorker = ""

    emitChange(workerID){
        if(workerID!==undefined){this._actualWorker = workerID}
        this.emit('change')
    }

    addChangeListener(callback){
        this.on('change', callback)
    }

    removeChangeListener(callback){
        this.removeListener('change', callback)
    }
}

export default new WorkStore();
