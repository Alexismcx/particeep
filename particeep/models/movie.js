var mongoose = require('mongoose')

var movieSchema = mongoose.Schema({
    id_movie: Number,
    title: String,
    category: String,
    likes: Number,
    dislikes: Number
})

var movieModel = mongoose.model('movies', movieSchema)

module.exports = movieModel