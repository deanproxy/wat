var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

server.request.isAuthenticated = function() {
  return true;
}

describe('Injuries', function() {
  var id = 0, commentId = 0;

  it("should add a single injury on /injuries POST", function(done) {
    chai.request(server)
      .post('/injuries')
      .send({'description': 'I had an injury, man...'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        id = res.body.id;
        done();
      });
  });

  it("should list all injuries on /injuries GET", function(done) {
    chai.request(server)
      .get('/injuries')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        done();
      });
  });

  it("should list a single injury on /injuries/<id> GET", function(done) {
    chai.request(server)
      .get('/injuries/' + id)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('description');
        res.body.description.should.equal('I had an injury, man...');
        done();
      });
  });

  it('should update a single injury on /injuries/<id> PUT', function(done) {
    chai.request(server)
      .put('/injuries/' + id)
      .send({'description': 'I _really_ injured myself, man...'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('description');
        res.body.description.should.equal('I _really_ injured myself, man...');
        done();
      });
  });

  it('should create a comment on an injury at /injuries/<id>/comments POST', function(done) {
    chai.request(server)
      .post('/injuries/' + id + '/comments')
      .send({text: 'This is a comment on an injury...'})
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('text');
        res.body.should.have.property('id');
        commentId = res.body.id;
        done();
      });
  });

  it('should delete comment on an injury at /injuries/<id>/comments/<id> DELETE', function(done) {
    chai.request(server)
      .delete('/injuries/' + id + '/comments/' + commentId)
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        done();
      });
  });

  it('should destroy a single injury on /injuries/<id> DELETE', function(done) {
    chai.request(server)
      .delete('/injuries/' + id)
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('should return error if retrieving wrong injury on /injuries/<id> GET', function(done) {
    chai.request(server)
      .get('/injuries/' + id)
      .end(function(err, res) {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return error if deleting wrong injury on /injuries/<id> DELETE', function(done) {
    chai.request(server)
      .delete('/injuries/' + id)
      .end(function(err, res) {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

  it('should return error if updating wrong injury on /injuries/<id> PUT', function(done) {
    chai.request(server)
      .put('/injuries/' + id)
      .end(function(err, res) {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
  });

});

