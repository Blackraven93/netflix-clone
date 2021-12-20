import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMoviesResult } from "./api";
import styled from "styled-components";
import { makeImagePath } from "./utils";


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
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    margin-bottom: 10px;
    position:absolute;
    width: 100%;
`

const Box = styled(motion.div)`
    background-color:white;
    height: 200px;
`

function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
    
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>
                    Loading...
                </Loader>
            ) : (
                <>
                    <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence>
                            <Row>
                                <Box/>
                                <Box/>
                                <Box/>
                                <Box/>
                                <Box/>
                                <Box/>
                            </Row>
                        </AnimatePresence>
                    </Slider>
                </>
            )}
        </Wrapper>
    );
}

export default Home;