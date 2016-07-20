import { InjuryDispatcher } from '../dispatchers/InjuryDispatcher';
import { InjuryConstants } from '../constants/InjuryConstants';

export default class InjuryActions {
  static addInjury(injury) {
    InjuryDispatcher.handleViewAction({
      actionType: InjuryConstants.ADD_INJURY,
      injury: injury
    });
  }

  static saveInjury(injury) {
    InjuryDispatcher.handleViewAction({
      actionType: InjuryConstants.UPDATE_INJURY,
      injury: injury
    });
  }

  static removeInjury(injury) {
    InjuryDispatcher.handleViewAction({
      actionType: InjuryConstants.REMOVE_INJURY,
      injury: injury
    });
  }

  static getAllInjuries() {
    InjuryDispatcher.handleViewAction({
      actionType: InjuryConstants.LOAD_INJURIES
    });
  }
}