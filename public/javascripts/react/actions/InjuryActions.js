import InjuryDispatcher from '../dispatchers/InjuryDispatcher';
import InjuryConstants from '../constants/InjuryConstants';

import Rest from 'rest';
import Mime from 'rest/interceptor/mime';
import ErrorCode from 'rest/interceptor/errorCode';

let rest = Rest.wrap(Mime, {mime: 'application/json'}).wrap(ErrorCode);

export default class InjuryActions {
  static addInjury(injury) {
    rest({
      path: '/injuries',
      entity: injury
    }).then(
      (response) => {
        InjuryDispatcher.handleViewAction({
          actionType: InjuryConstants.ADD_INJURY,
          data: response.entity
        });
      }, (response) => {
        console.log(`Couldn't add injury: ${response.status.text}`);
        alert(`Couldn't add injury: ${response.status.text}`);
      });
  }

  static saveInjury(injury) {
    console.log("Injury description: " + injury.description);
    rest({
      method: 'PUT',
      path: `/injuries/${injury.id}`,
      entity: injury
    }).then(
      (response) => {
        InjuryDispatcher.handleViewAction({
          actionType: InjuryConstants.UPDATE_INJURY,
          data: response.entity
        });
      }, (response) => {
        console.log(`Couldn't save injury: ${response.status.text}`);
        alert(`Couldn't save injury: ${response.status.text}`);
      });
  }

  static removeInjury(injury) {
    rest({
      method: 'DELETE',
      path: `/injuries/${injury.id}`
    }).then(
      (response) => {
        InjuryDispatcher.handleViewAction({
          actionType: InjuryConstants.REMOVE_INJURY,
          data: response.entity
        })
      }, (response) => {
        console.log(`Couldn't delete injury: ${response.status.text}`);
        alert(`Couldn't delete injury: ${response.status.text}`);
      });
  }

  static getAllInjuries() {
    rest('/injuries').then((response) => {
      InjuryDispatcher.handleViewAction({
        actionType: InjuryConstants.LOAD_INJURIES,
        data: response.entity
      });
    });
  }
}
