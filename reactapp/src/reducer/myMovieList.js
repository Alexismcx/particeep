export default function myMovieList(movieList = [], action) {

    if (action.type === 'saveMovies') {
        return action.movies
    } else if (action.type === 'deleteOneMovie') {
        var moviesCopy = [...movieList]




        var position = null
        console.log(moviesCopy);
        for (let i = 0; i < moviesCopy.length; i++) {
            if (moviesCopy[i]._id === action.id) {
                position = i
            }
        }
        if (position != null) {
            moviesCopy.splice(position, 1)
        }

        return moviesCopy

    } else if(action.type === 'addLikes'){
        var moviesCopy = [...movieList]
        for (let i = 0; i < moviesCopy.length; i++) {
            if (moviesCopy[i].id_movie === action.idMovie) {
                moviesCopy[i].likes = action.likes
            }
        }
        return moviesCopy
    }else if(action.type === 'addDislikes'){
        var moviesCopy = [...movieList]
        for (let i = 0; i < moviesCopy.length; i++) {
            if (moviesCopy[i].id_movie === action.idMovie) {
                moviesCopy[i].dislikes = action.dislikes
            }
        }
        return moviesCopy
    }else if(action.type === 'addCategory'){

        var moviesCopy = [...movieList]

        var filteredMovies = []



        for (let i = 0; i < moviesCopy.length; i++) {
            if (moviesCopy[i].category === action.filter) {
                filteredMovies.push(moviesCopy[i])
            }
        }

        console.log(filteredMovies);

        return filteredMovies
    }else{
        return movieList
    }
}
    
    
    
    