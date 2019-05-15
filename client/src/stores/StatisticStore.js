import EventEmitter from 'events'

class StatisticStore extends EventEmitter{

    _stats = []

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

export default new StatisticStore();
