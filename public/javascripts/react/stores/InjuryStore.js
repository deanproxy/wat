import { EventEmitter } from 'events';
import Rest from 'rest';
import Mime from 'rest/interceptor/mime';


class InjuryStoreClass extends EventEmitter {
  constructor() {
    super();
    this.rest = Rest.wrap(Mime, {mime: 'application/json'});
    this.injuries = [];
    this.getInjuries();
  }

  getInjuries() {
    this.rest('/injuries').then((response) => {
      this.injuries = response.entity;
    });
    return this.injuries;
  }

  addInjury(injury) {
    this.rest({
      path: '/injuries',
      entity: injury
    }).then((response) => {
      this.injuries.push(injury);
    });
  }

  removeInjury(injury) {
    this.rest({
      method: 'DELETE',
      path: `/injuries/${injury.id}`
    }).then((response) => {
      this.injuries = this.injuries.filter((item, index) => {
        return item.id !== injury.id;
      });
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

export const InjuryStore = new InjuryStoreClass();

