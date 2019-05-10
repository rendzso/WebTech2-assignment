import EventEmitter from 'events'

class ReceiptStore extends EventEmitter{

    _receipt = []

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

export default new ReceiptStore();
