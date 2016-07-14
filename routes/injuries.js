var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  models.Injury.findAll({order: 'createdAt DESC'}).then(function(injuries) {
    res.json(injuries);
  });
});

router.post('/', function(req, res) {
  models.Injury.create({
    description: req.body.description
  }).then(function(injury) {
    res.json(injury);
  });
});

router.get('/:id', function(req, res) {
  models.Injury.findById(req.params.id)
    .then(function(injury) {
      if (!injury) {
        res.status(404);
        res.json({error: 'Injury not found with id ' + req.params.id});
      } else {
        res.json(injury.toJSON());
      }
    });
});

router.put('/:id', function(req, res) {
  models.Injury.findById(req.params.id)
    .then(function(injury) {
      if (!injury) {
        res.status(404);
        return res.json({error: "Injury not found with id " + req.params.id});
      }
      injury.description = req.body.description;
      injury.save().then(function() {
        res.json(injury.toJSON());
      }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.json({error: err});
      });
    });
});

router.delete('/:id', function(req, res) {
  models.Injury.findById(req.params.id)
    .then(function(injury) {
      if (!injury) {
        res.status(404);
        return res.json({error: 'Injury not found with id ' + req.params.id});
      }
      injury.destroy().then(function() {
        res.json(injury.toJSON());
      }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.json({error: err});
      });
    });
});

router.post('/:id/comments', function(req, res) {
  models.Injury.findById(req.params.id, {
    include: [models.Comment]
  }).then(function(injury) {
    if (!injury) {
      res.status(404);
      return res.json({error: "Injury not found with id " + req.params.id});
    }
    models.Comment.create({
      text: req.body.text,
      InjuryId: injury.id
    }).then(function(comment) {
      res.json(comment.toJSON());
    });
  });
});

router.delete('/:id/comments/:comment_id', function(req, res) {
  models.Comment.findById(req.params.comment_id)
    .then(function(comment) {
      if (!comment) {
        res.status(404);
        return res.json({error: "Comment not found with id: " + req.params.comment_id});
      }
      comment.destroy().then(function() {
        res.json(comment.toJSON());
      }).catch(function(err) {
        console.log(err);
        res.status(500);
        res.send();
      });
    });
});

module.exports = router;
