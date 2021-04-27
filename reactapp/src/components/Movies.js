import React, { useEffect, useState } from "react";
import 'antd/dist/antd.css';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Col, Select, Radio } from 'antd';
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { connect } from 'react-redux';
import "./style.css";


function Movies(props) {

    const { Option } = Select;

    const [allFilter, setAllFilter] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const [displayMoviesByNb, setDisplayMoviesByNb] = useState({})
    const [checkAllPages, setCheckAllPages] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [numberMovieToDisplay, setNumberMovieToDisplay] = useState(0)
    const [checkCategory, setCheckCategory] = useState("")

    useEffect(() => {
        const findUser = async () => {
            const data = await fetch(`/getmovies`);
            const body = await data.json();
            props.saveMovies(body.movie);
            setIsLoading(false);
            setAllFilter(body.movie);
        }
        findUser();
    }, []);

    if (isloading == true) {
        return (<p>CHargement</p>);
    }

    const handleClickDelete = async (id) => {
        props.deleteMovie(id);
        const deleteReq = await fetch('/delete-movies', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        });
    }

    var listMovie

    const handleClickLikes = async (data) => {
        data.likes = data.likes + 1;
        props.addLikes(data);
    }

    const handleClickDislikes = async (data) => {
        data.dislikes = data.dislikes + 1;
        props.addDislikes(data);
    }

    const handleClickFilter = async (category) => {
        const data = await fetch('/getmovies');
        const body = await data.json();
        setAllFilter(body.movie);
        props.saveMovies(body.movie);
        setCheckCategory(category);

        if (category != "Tous les films") {
            props.addFilter(category);
        }

        const sendNb = await fetch(`/count-elements?category=${category}`, {
            method: 'GET'
        });

        const bodySendNb = await sendNb.json();

        if (numberMovieToDisplay != 0) {
            var calculateNbPages = bodySendNb.count / numberMovieToDisplay;
            totalPage = Math.ceil(calculateNbPages);
            var arrayAllNumbers = [];
            for (let i = 0; i < totalPage; i++) {
                arrayAllNumbers.push(i + 1);
            }
            setCheckAllPages(arrayAllNumbers);
        }
    }

    var totalPage

    const handleClickPagination = async (nb) => {

        const sendNb = await fetch(`/number-elements?nb=${nb}&currentPage=${currentPage}`, {
            method: 'GET'
        });

        setNumberMovieToDisplay(nb);

        const bodySendNb = await sendNb.json();
        setDisplayMoviesByNb(bodySendNb);
        props.saveMovies(bodySendNb.movies);

        const data = await fetch(`/count-elements?category=${checkCategory}`);
        const body = await data.json();

        var calculateNbPages = body.count / nb;
        totalPage = Math.ceil(calculateNbPages);
        var arrayAllNumbers = [];
        for (let i = 0; i < totalPage; i++) {
            arrayAllNumbers.push(i + 1);
        }
        setCheckAllPages(arrayAllNumbers);
    }

    const handleClickChangeCurrentPage = async (page) => {
        setCurrentPage(page);

        const sendNb = await fetch(`/number-elements?nb=${numberMovieToDisplay}&page=${page}&currentCategory=${checkCategory}`, {
            method: 'GET'
        })

        const bodySendNb = await sendNb.json();
        props.saveMovies(bodySendNb.movies);
    }

    var displayAllButtonPages

    if (Object.entries(displayMoviesByNb).length > 0) {
        displayAllButtonPages = checkAllPages.map((page, i) => {
            var styleBackgroundColor;
            if (page == currentPage) {
                styleBackgroundColor = "#40A9FF";
            }
            return (
                <Button style={{ backgroundColor: styleBackgroundColor, height: 50, width: 50, borderRadius: 50, fontSize: 20, color: "black", fontWeight: "bold", marginBottom: 120, marginTop: 80, marginRight: 30, boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", }} key={i} onClick={() => handleClickChangeCurrentPage(page)}>{page}</Button>
            );
        })
    }

    var listMovie
    var filterList

    if (allFilter.length !== 0) {
        var i,
            len = allFilter.length,
            out = [],
            obj = {};
        for (i = 0; i < len; i++) {
            obj[allFilter[i].category] = 0;
        }
        for (i in obj) {
            out.push(i);
        }
        filterList = out.map((category, i) => {
            return (
                <Option value={category} key={i} onChange={handleClickFilter}>{category}</Option>
            )
        })
    }

    if (props.movieList && isloading == false) {
        listMovie = props.movieList.map((movie, i) => {
            var total = movie.likes + movie.dislikes;
            var percentageLikes = (movie.likes / total) * 100;
            var percentageDislikes = (movie.dislikes / total) * 100;
            var calculLikes = percentageLikes.toString() + "%";
            var calculDislikes = percentageDislikes.toString() + "%";
            return (
                <Col xs={24} md={10} lg={6} key={i} style={style.insideBox_div}>
                    <h2 style={style.title_movie}>{movie.title}</h2>
                    <Button style={style.category_tag}>{movie.category}</Button>
                    <div style={style.percentage_bar}>
                        <div style={{ width: calculLikes, height: 15, backgroundColor: "#badc58", float: "left", borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} />
                        <div style={{ width: calculDislikes, height: 15, backgroundColor: "#eb4d4b", float: "right", borderTopRightRadius: 20, borderBottomRightRadius: 20 }} />
                    </div>
                    <div style={style.bloc_likes_dislikes}>
                        <div style={style.contenair_likes_dislikes}>
                            <p style={style.counter_like_dislike}>{movie.likes}</p>
                            <LikeOutlined style={style.icon} onClick={() => handleClickLikes({ id: movie.id_movie, likes: movie.likes, dislikes: movie.dislikes })} ></LikeOutlined>
                        </div>
                        <div style={style.contenair_likes_dislikes}>
                            <p style={style.counter_like_dislike}>{movie.dislikes}</p>
                            <DislikeOutlined style={style.icon} onClick={() => handleClickDislikes({ id: movie.id_movie, dislikes: movie.dislikes, likes: movie.likes })} ></DislikeOutlined>
                        </div>
                    </div>
                    <FontAwesomeIcon style={style.trash_icon} color='black' icon={faTrashAlt} onClick={() => handleClickDelete(movie._id)} />
                </Col>);
        });
    }

    return (
        <div>
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 60 }}>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a filter"
                    onChange={handleClickFilter}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option value="Tous les films">Tous les films</Option>
                    {filterList}
                </Select>
                <Radio.Group style={style.button_Select}>
                    <Radio.Button value="4" onClick={() => handleClickPagination(4)}>4</Radio.Button>
                    <Radio.Button value="8" onClick={() => handleClickPagination(8)}>8</Radio.Button>
                    <Radio.Button value="12" onClick={() => handleClickPagination(12)}>12</Radio.Button>
                </Radio.Group>

            </div>
            <Row style={style.bloc_div}>
                {listMovie}
            </Row>
            <div style={style.containair_pagination}>
                {displayAllButtonPages}
            </div>
        </div>
    );
}

const style = {
    bloc_div: {
        width: "auto",
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 20,
    },
    insideBox_div: {
        width: 500,
        marginBottom: 20,
        marginLeft: 40,
        marginTop: 20,
        borderRadius: "25px",
        boxShadow: "0px 0px 21px 5px rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
    },
    icon: {
        fontSize: 30
    },
    trash_icon: {
        fontSize: 40,
        marginTop: 20,
        marginBottom: 20,
        cursor: "pointer",
        color: "#95afc0"
    },
    counter_like_dislike: {
        marginBottom: 4,
        fontWeight: "bold"
    },
    bloc_likes_dislikes: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        marginTop: 20
    },
    contenair_likes_dislikes: {
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        fontSize: 30
    },
    percentage_bar: {
        marginTop: 20,
        width: "80%",
        borderRadius: 20
    },
    category_tag: {
        backgroundColor: "#f9ca24",
        borderRadius: 20,
        fontWeight: "bold",
        color: "black"
    },
    title_movie: {
        fontWeight: "bold",
        fontSize: 35,
        textAlign: "center",
        marginTop: 10
    },
    button_Select: {
        marginLeft: 20
    },
    containair_pagination: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
    }
}

function mapStateToProps(state) {
    return { movieList: state.myMovieList, currentPage: state.page }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteMovie: function (idMovie) {
            dispatch({
                type: 'deleteOneMovie',
                id: idMovie
            })
        },
        saveMovies: function (movieList) {
            dispatch({
                type: 'saveMovies',
                movies: movieList
            })
        },
        addLikes: function (data) {
            dispatch({
                type: 'addLikes',
                likes: data.likes,
                idMovie: data.id
            })
        },
        addDislikes: function (data) {
            dispatch({
                type: "addDislikes",
                dislikes: data.dislikes,
                idMovie: data.id
            })
        },
        addFilter: function (category) {
            dispatch({
                type: "addCategory",
                filter: category

            })
        },
        saveCurrentPage: function (page) {
            dispatch({
                type: "addPage",
                page: page
            })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Movies);