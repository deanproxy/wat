import React from 'react';
import ReactDOM from 'react-dom';

import { InjuryActions } from './actions/InjuryActions';
import { InjuryStore } from './stores/InjuryStore';

import Bootstrap from 'bootstrap.native';
import Moment from 'moment';

(function() {

  function serialize(form) {
    var data = new FormData(form);
    var obj = {}
    for (var i of data.entries()) {
      obj[i[0]] = i[1];
    }
    return obj;
  }

  class Add extends React.Component {
    constructor(props) {
      super(props);
      this.change = this.change.bind(this);
      this.state = {
        injury: {
          id: 0,
          description: ''
        }
      }
    }

    componentDidMount() {
      if (this.props.injury) {
        this.state.injury = this.props.injury;
      }
    }

    change(evt) {
      this.state.injury.description = evt.target.value;
      this.setState({injury: this.state.injury});
    }

    render() {
      return (
        <div className="modal-dialog">
          <div className="modal-body">
            <h2>Add A New Old Man Incident</h2>
            <form id="add-form">
              <input type="hidden" name="id" defaultValue={this.state.injury.id}/>
              <textarea name="description" placeholder="Tell us your sad, old man story..." required 
                value={this.state.injury.description} onChange={this.change}></textarea>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-default" data-dismiss="modal">Close</button>
            <button className="btn btn-primary" onClick={this.props.onClick}>Save</button>
          </div>
        </div>
      );
    }
  }

  class Index extends React.Component {
    constructor(props) {
      // Using es6 with React does some weird stuff. First of all, we have to call super to get our 
      // props.  Secondly, when using callbacks inside of JSX, it doesn't bind class instance, so
      // we have to set it up properly.
      super(props);
      this.state = {
        injuries: []
      }
      this.removeInjury = this.removeInjury.bind(this);
      this.showModal = this.showModal.bind(this);
      this.addInjury = this.addInjury.bind(this);
    }

    _onChange() {
      this.setState({ injuries: InjuryStore.getInjuries() });
    }

    componentDidMount() {
      InjuryStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
      InjuryStore.removeChangeListener(this._onChange);
    }

    addInjury(evt) {
      let form  = document.getElementById('add-form'),
          data  = serialize(form),
          that  = this;

      if (data.injuryId && data.injuryId !== '0') {
        InjuryActions.saveInjury(data);
      } else {
        InjuryActions.addInjury(data);
      }
    }

    showModal(evt) {
      let modalDiv = document.getElementById('modal'),
          id = evt.target.dataset.injuryId;

      // Clear previous modal data if there is any...
      if (modalDiv.firstChild) {
        modalDiv.removeChild(modalDiv.firstChild);
      }
      this.modal = new Bootstrap.Modal(modalDiv);
      let injury = this.injuries.find((injury) => {
        return id === injury.id;
      });
      ReactDOM.render(<Add onClick={this.addInjury} injury={injury}/>, modalDiv);
      this.modal.open();
    }

    removeInjury(evt) {
      let id = evt.target.dataset.itemId;

      evt.preventDefault();
      InjuryActions.removeInjury({injury: {id: id}});
    }

    render() {
      let injuries = this.state.injuries.map(
        (item) => {
          return (
            <div className="row" key={item.id}>
              <div className="col-xs-11 description" onClick={this.showModal} data-injury-id={item.id}>
                <span className="fa fa-wheelchair"></span>
                {item.description}
                <span className="date">{Moment(item.createdAt).fromNow()}</span>
              </div>
              <div className="col-xs-1">
                <a href data-item-id={item.id} onClick={this.removeInjury} title="Delete?">&times;</a>
              </div>
            </div>
          );
        }
      );
      return (
        <div className="index">
          <div className="actions">
            <a className="btn btn-default" href="/logout">Logout</a>
            <button className="btn btn-primary" onClick={this.showModal}>Add Old Man Incident</button>
          </div>
          <div className="container-fluid">
            {injuries}
          </div>
        </div>
      );
    }
  }

  const app = document.getElementById('react');
  ReactDOM.render(<Index/>, app);

})();
