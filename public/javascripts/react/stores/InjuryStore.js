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
    this.injuries.unshift(injury);
  }

  removeInjury(injury) {
    this.injuries = this.injuries.filter((item, index) => {
      return item.id !== injury.id;
    });
  }

  updateInjury(injury) {
    // Find an index for this particular injury id
    let indexes = this.injuries.map((inj, idx) => {
      if (inj.id === injury.id) {
        return idx;
      }
    }).filter(isFinite); // Removes any 'undefined' items from the array

    if (indexes.length) {
      let idx = indexes[0];
      this.injuries[idx] = injury;
    }
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

