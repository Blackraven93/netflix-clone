import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMoviesResult } from "./api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { useState } from "react";


const Wrapper = styled.div`
    background: black;
    height: 200vh;
`

const Loader = styled.div`
    height: 20vh;
    display:flex;
    justify-content: center;
    align-items: center;
`

const Banner = styled.div<{ bgPhoto: string}>`
    height:100vh;
    background-color: green;
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
`

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


function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    
    const increateIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 2;
            const maxIndex = Math.ceil(totalMovies / offset) - 1
            
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
        }
    }

    const toggleLeaving = () => setLeaving(prev => !prev);

    const offset = 6

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>
                    Loading...
                </Loader>
            ) : (
                <>
                    <Banner onClick={increateIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type: "tween", duration: 1}} key={index}>
                                {data?.results.slice(1).slice(offset*index, offset*index + offset).map(movie => <Box bgPhoto={makeImagePath(movie.backdrop_path, "w500")} key={movie.id}>{movie.title}</Box>)}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}

export default Home;