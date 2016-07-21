import { EventEmitter } from 'events';


class InjuryStoreClass extends EventEmitter {
  constructor() {
    super();
    this.injuries = [];
  }

  setInjuries(injuries) {
    this.injuries = injuries;
  }

  getInjuries() {
    return this.injuries;
  }

  addInjury(injury) {
    this.injuries.push(injury);
  }

  removeInjury(injury) {
    this.injuries = this.injuries.filter((item, index) => {
      return item.id !== injury.id;
    });
  }

  updateInjury(injury) {
    // update.
  }

  emitChange() {
    this.emit('change');
  }

  addChangeListener(callback) {
    this.on('change', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
}

const InjuryStore = new InjuryStoreClass();
export default InjuryStore;

