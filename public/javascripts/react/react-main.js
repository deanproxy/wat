import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap.native';
import Moment from 'moment';
import Rest from 'rest';
import Mime from 'rest/interceptor/mime';

(function() {

  var rest = Rest.wrap(Mime, { mime: 'application/json' });

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
      var that = this;
      if (this.props.injuryId) {
        rest('injuries/' + this.props.injuryId).then(function(response) {
          that.setState({injury: response.entity});
        });
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
              <input type="hidden" name="injuryId" defaultValue={this.state.injury.id}/>
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

    componentDidMount() {
      var that = this;
      rest('injuries').then(function(response) {
        that.setState({injuries: response.entity});
      });
    }

    addInjury(evt) {
      var form  = document.getElementById('add-form'),
          data  = serialize(form),
          that  = this;

      var promise = null;
      if (data.injuryId && data.injuryId !== '0') {
        promise = rest({
          method: 'PUT',
          path: 'injuries/' + data.injuryId,
          entity: data
        });
      } else {
        promise = rest({
          path: 'injuries',
          entity: data
        });
      }

      promise.then(function(response) {
          rest('injuries').then(function(response) {
            that.setState({injuries: response.entity});
            that.modal.close();
          });
        })
        .catch(function(response) {
          alert(response.status.text);
          that.modal.close();
        });
    }

    showModal(evt) {
      var modalDiv = document.getElementById('modal'),
          id = evt.target.dataset.injuryId;

      // Clear previous modal data if there is any...
      if (modalDiv.firstChild) {
        modalDiv.removeChild(modalDiv.firstChild);
      }
      this.modal = new Bootstrap.Modal(modalDiv);
      ReactDOM.render(<Add onClick={this.addInjury} injuryId={id}/>, modalDiv);
      this.modal.open();
    }

    removeInjury(evt) {
      var that = this,
          id = evt.target.dataset.itemId;

      evt.preventDefault();
      rest({
        path: 'injuries/' + id,
        method: 'DELETE'
      }).then(function(response) {
        rest('injuries').then(function(response) {
          that.setState({injuries: response.entity});
        });
      });
    }

    render() {
      var that = this;
      var injuries = this.state.injuries.map(
        (item) => {
          return (
            <div className="row" key={item.id}>
              <div className="col-xs-11 description" onClick={this.showModal} data-injury-id={item.id}>
                <span className="fa fa-wheelchair"></span>
                {item.description}
                <span className="date">{Moment(item.createdAt).fromNow()}</span>
              </div>
              <div className="col-xs-1">
                <a href data-item-id={item.id} onClick={that.removeInjury} title="Delete?">&times;</a>
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
