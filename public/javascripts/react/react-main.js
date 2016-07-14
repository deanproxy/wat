import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap.native';
import Moment from 'moment';

function serialize(form) {
  var data = new FormData(form);
  var obj = {}
  for (var i of data.entries()) {
    obj[i[0]] = i[1];
  }
  return obj;
}

function ajax(type, url, data) {
  var DONE = 4;

  console.log(`${type}, ${url}`);
  return new Promise(function(resolve, reject) {
    var client = new XMLHttpRequest();
    client.open(type, url, true);
    client.setRequestHeader('Content-Type', 'application/json');
    client.onreadystatechange = function() {
      if (this.readyState !== DONE) {
        return;
      } else if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(this.response));
      } else {
        reject(this.statusText);
      }
    }
    var jsonString = data ? JSON.stringify(data) : null;
    client.send(jsonString);
  });
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
      ajax('GET', '/injuries/' + this.props.injuryId)
        .then(function(data) {
          that.setState({injury:data});
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
    ajax('GET', '/injuries')
      .then(function(data) {
        that.setState({injuries: data});
      });
  }

  addInjury(evt) {
    var form  = document.getElementById('add-form'),
        data  = serialize(form),
        that  = this;

    var opts = {
      method: 'POST',
      url: '/injuries'
    };

    if (data.injuryId) {
      opts.url = opts.url.concat('/' + data.injuryId);
      opts.method = 'PUT'
    }

    ajax(opts.method, opts.url, data)
      .then(function(data) {
        ajax('GET', '/injuries')
          .then(function(data) {
            that.setState({injuries: data});
            that.modal.close();
          });
      })
      .catch(function(err) {
        alert(err);
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
    ajax('DELETE', '/injuries/' + id)
      .then(function(data) {
        ajax('GET', '/injuries')
          .then(function(data) {
            that.setState({injuries: data});
          });
      });
  }

  render() {
    var that = this;
    var injuries = this.state.injuries.map(
      (item) => {
        return (
          <li key={item.id}>
            <span className="fa fa-wheelchair"></span> 
            <span className="description" onClick={this.showModal} data-injury-id={item.id}>{item.description}</span>
            <span className="date">{Moment(item.createdAt).fromNow()}</span>
            <a href data-item-id={item.id} onClick={that.removeInjury} title="Delete?">&times;</a>
          </li>
        );
      }
    );
    return (
      <div className="index">
        <div className="actions">
          <a className="btn btn-default" href="/logout">Logout</a>
          <button className="btn btn-primary" onClick={this.showModal}>Add Old Man Incident</button>
        </div>
        <ul>
          {injuries}
        </ul>
      </div>
    );
  }
}

const app = document.getElementById('react');
ReactDOM.render(<Index/>, app);