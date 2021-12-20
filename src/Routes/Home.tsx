import { useQuery } from "react-query";
import { motion, AnimatePresence, useViewportScroll  } from "framer-motion";
import { getMovies, IGetMoviesResult, getTopRateMovies, getUpcomingMovies } from "./api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Wrapper = styled.div`
    background: black;
    height: 200vh;
    overflow: hidden;
`

const Loader = styled.div`
    height: 20vh;
    display:flex;
    justify-content: center;
    align-items: center;
`

const Banner = styled.div<{ bgPhoto: string}>`
    height:100vh;
    background-color: white;
    display:flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.8)), url(${props => props.bgPhoto});
    background-size: cover;
`

const Title = styled.h2`
    font-size: 68px;
    margin-bottom:20px;
`

const Category = styled.h3`
  position:relative;
  bottom:5px;
  padding: 10px;
  font-size: 42px;
  color: whitesmoke;
`

const Overview = styled.p`
    font-size: 36px;
    width: 50%;
`

const Slider = styled.div`
    position:reletive;
`

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    margin-bottom: 10px;
    position:absolute;
    width: 100%;
`

const Box = styled(motion.div)<{bgPhoto:string}>`
    background-color: white;
    background-image: url(${(props) => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    cursor: pointer;

    &:first-child {
    transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;


const rowVariants = {
    hidden: {
      x: window.outerWidth + 15,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -window.outerWidth - 15,
    },
  };

  const boxVariants = {
    normal: {
      scale: 1,
    },
    hover: {
      scale: 1.3,
      y: -80,
      transition: {
        delay: 0.4,
        duaration: 0.1,
        type: "tween",
      },
    },
  };

  const infoVariants = {
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duaration: 0.1,
        type: "tween",
      },
    },
}

const offset = 6

function Home() {
    const navigator = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");
    console.log(bigMovieMatch)

    const {data:nowPlaying, isLoading:nowPlayingLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    const {data:topRate, isLoading:topRateLoading} = useQuery<IGetMoviesResult>(["movies", "topRate"], getTopRateMovies)
    const {data:upcoming, isLoading:upcomingLoading} = useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies)

    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    
    const increateIndex = () => {
        if (nowPlaying) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = nowPlaying.results.length - 2;
            const maxIndex = Math.ceil(totalMovies / offset) - 1
            
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
        }
    }

    const toggleLeaving = () => setLeaving(prev => !prev);
    const onBoxClicked = (movieId: number) => {
        navigator(`/movies/${movieId}`);
      };
    const onOverlayClick = () => navigator("/");

    const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlaying?.results.find((movie) => movie.id + "" === bigMovieMatch.params.movieId);

    const { scrollY } = useViewportScroll();

    const categories = [nowPlaying, topRate, upcoming]
    const categoriesString = ["nowPlaying", "topRate", "upcoming" ]
    return (
        <Wrapper>
            {nowPlayingLoading ? (
                <Loader>
                    Loading...
                </Loader>
            ) : (
                <>
                    <Banner onClick={increateIndex} bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}>
                        <Title>{nowPlaying?.results[0].title}</Title>
                        <Overview>{nowPlaying?.results[0].overview}</Overview>
                    </Banner>

                    {categoriesString.map((e,i) =>(
                      <Slider style={{marginTop: i === 0 ? 0 : 200}}>
                      <Category>{`${e} movies`}</Category>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type: "tween", duration: 1}} key={index}>
                                {categories[i]?.results.slice(1).slice(offset*index, offset*index + offset).map(movie => 
                                    <Box 
                                        layoutId={movie.id + ""}
                                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                        key={movie.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        transition={{ type: "tween" }}
                                        onClick={() => onBoxClicked(movie.id)}
                                        >
                                        <Info variants={infoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                )}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    ))}
                    
                    


                    <AnimatePresence>
                        {bigMovieMatch ? (
                         <>
                         <Overlay
                           onClick={onOverlayClick}
                           exit={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                         />
                         <BigMovie
                           style={{ top: scrollY.get() + 100 }}
                           layoutId={bigMovieMatch.params.movieId}
                         >
                            {clickedMovie && (
                                <>
                                    <BigCover
                                        style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                            clickedMovie.backdrop_path,
                                            "w500"
                                        )})`,
                                        }}
                                    />
                                    <BigTitle>{clickedMovie.title}</BigTitle>
                                    <BigOverview>{clickedMovie.overview}</BigOverview>
                                </>
                            )}
                         </BigMovie>
                       </>
                        ) : null}
                </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;