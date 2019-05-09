import EventEmitter from 'events'

class CustomerStore extends EventEmitter{
    _customer = null

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

export default new CustomerStore();
