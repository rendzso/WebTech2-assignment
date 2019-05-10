import EventEmitter from 'events'

class WorkStore extends EventEmitter{

    _work = []

    emitChange(){
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
