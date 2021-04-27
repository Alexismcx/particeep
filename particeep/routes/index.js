var express = require('express');
var router = express.Router();

var movieModel = require('../models/movie');




/* ajout d'un nouveau film   */

router.post('/addmovies', async function (req, res, next) {

  var movieInscription = new movieModel({
    id_movie: req.body.idMovie,
    title: req.body.title,
    category: req.body.category,
    likes: req.body.likes,
    dislikes: req.body.dislikes
  })

  savedMovie = await movieInscription.save()

  res.json({ result: true });
});

router.get('/getmovies', async function (req, res, next) {
  var movie = await movieModel.find()
  res.json({ result: true, movie });
});

router.delete('/delete-movies', async function (req, res, next) {

  var result;

  var allMovies = await movieModel.find()

  if(allMovies != null){


    var movies = await movieModel.deleteOne({_id: req.body.id})

    if(movies.deletedCount == 1){
      result = true
    }

  }

  res.json({result})

});

router.get('/count-elements', async function (req, res, next) {

  console.log(req.query.category);

  if(req.query?.category && req.query?.category != "Tous les films"){
    var count = await movieModel.countDocuments({category: req.query.category})

  }else{
    var count = await movieModel.countDocuments({})

  }

  
  res.json({ result: true, count });
});

router.get('/number-elements', async function (req, res, next) {

  var currentPage = req.query.page - 1

  var nb = req.query.nb


  if(req.query?.currentCategory && req.query?.currentCategory != "Tous les films"){
    var movies = await movieModel.find({category: req.query.currentCategory}).limit(parseInt(nb)).skip(currentPage * nb)
    console.log("avec cat");

  }else{
    var movies = await movieModel.find().limit(parseInt(nb)).skip(currentPage * nb)
    console.log("sans cat");
  }

  res.json({ result: true, movies });
});

module.exports = router;
