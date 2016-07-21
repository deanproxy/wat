import { Dispatcher } from 'flux';
import InjuryConstants from '../constants/InjuryConstants';
import InjuryStore from '../stores/InjuryStore';

class InjuryDispatcherClass extends Dispatcher {

  handleViewAction(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }
}

const InjuryDispatcher = new InjuryDispatcherClass();
InjuryDispatcher.register((payload) => {
    let action = payload.action;

    switch (action.actionType) {
    case InjuryConstants.LOAD_INJURIES:
      InjuryStore.setInjuries(action.data);
      break;
    case InjuryConstants.ADD_INJURY:
      InjuryStore.addInjury(action.data);
      break;
    case InjuryConstants.REMOVE_INJURY:
      InjuryStore.removeInjury(action.data);
      break;
    case InjuryConstants.UPDATE_INJURY:
      InjuryStore.updateInjury(action.data);
      break;
    default:
      return true;
    }

    InjuryStore.emitChange();
    return true;
});

export default InjuryDispatcher;
