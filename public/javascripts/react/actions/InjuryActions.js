import InjuryDispatcher from '../dispatchers/InjuryDispatcher';
import InjuryConstants from '../constants/InjuryConstants';

import Rest from 'rest';
import Mime from 'rest/interceptor/mime';

let rest = Rest.wrap(Mime, {mime: 'application/json'});

export default class InjuryActions {
  static addInjury(injury) {
    rest({
      path: '/injuries',
      entity: injury
    }).then((response) => {
      InjuryDispatcher.handleViewAction({
        actionType: InjuryConstants.ADD_INJURY,
        injury: injury
      });
    });
  }

  static saveInjury(injury) {
    InjuryDispatcher.handleViewAction({
      actionType: InjuryConstants.UPDATE_INJURY,
      injury: injury
    });
  }

  static removeInjury(injury) {
    rest({
      method: 'DELETE',
      path: `/injuries/${injury.id}`
    }).then((response) => {
      InjuryDispatcher.handleViewAction({
        actionType: InjuryConstants.REMOVE_INJURY,
        injury: injury
      });
    });
  }

  static getAllInjuries() {
    rest('/injuries').then((response) => {
      InjuryDispatcher.handleViewAction({
        actionType: InjuryConstants.LOAD_INJURIES
      });
    });
  }
}
