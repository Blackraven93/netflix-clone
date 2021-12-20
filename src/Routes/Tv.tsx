import { useQuery } from "react-query";
import { motion, AnimatePresence, useViewportScroll  } from "framer-motion";
import { getLatestTv, getAiringTodayTv, getPopularTv, getTopRatedTv, IGetTvsResult } from "./api";
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

const BigTv = styled(motion.div)`
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
    height: 220vh;
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

function Tv() {
    const navigator = useNavigate();
    const bigTvMatch = useMatch("/tv/:tvId");

    
    const {data:latest, isLoading:latestLoading} = useQuery<IGetTvsResult>(["tvs", "latest"], getLatestTv)
    const {data:airing, isLoading:airingLoading} = useQuery<IGetTvsResult>(["tvs", "airing"], getAiringTodayTv)
    const {data:popular, isLoading:popularLoading} = useQuery<IGetTvsResult>(["tvs", "popular"], getPopularTv)
    const {data:topRated, isLoading:topLatedLoading} = useQuery<IGetTvsResult>(["tvs", "topRated"], getTopRatedTv)


    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    
    const increateIndex = () => {
        if (latest) {
            if (leaving) return;
            toggleLeaving();
            const totalTvs = latest.results.length - 2;
            const maxIndex = Math.ceil(totalTvs / offset) - 1
            
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
        }
    }

    const toggleLeaving = () => setLeaving(prev => !prev);
    const onBoxClicked = (tvId: number) => {
        navigator(`/tv/${tvId}`);
      };
    const onOverlayClick = () => navigator("/tv");

    const clickedTv =
    bigTvMatch?.params.tvId &&
    latest?.results.find((movie) => movie.id + "" === bigTvMatch.params.tvId);

    const { scrollY } = useViewportScroll();
    
    const categories = [latest, airing, popular, topRated]
    const categoriesString = ["latest", "airing", "popular", "topRated" ]
    return (
        <Wrapper>
            {latestLoading ? (
                <Loader>
                    Loading...
                </Loader>
            ) : (
                <>
                    <Banner onClick={increateIndex} bgPhoto={makeImagePath(latest?.results[0].backdrop_path || "")}>
                        <Title>{latest?.results[0].name}</Title>
                        <Overview>{latest?.results[0].overview}</Overview>
                    </Banner>

                    {categoriesString.map((e,i) =>(
                      <Slider style={{marginTop: i === 0 ? 0 : 200}}>
                      <Category>{`${e} tv`}</Category>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type: "tween", duration: 1}} key={index}>
                                {categories[i]?.results.slice(1).slice(offset*index, offset*index + offset).map(tv => 
                                    <Box 
                                        layoutId={tv.id + ""}
                                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                                        key={tv.id}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        transition={{ type: "tween" }}
                                        onClick={() => onBoxClicked(tv.id)}
                                        >
                                        <Info variants={infoVariants}>
                                            <h4>{tv.name}</h4>
                                        </Info>
                                    </Box>
                                )}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    ))}
                    
                    


                    <AnimatePresence>
                        {bigTvMatch ? (
                         <>
                         <Overlay
                           onClick={onOverlayClick}
                           exit={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                         />
                         <BigTv
                           style={{ top: scrollY.get() + 100 }}
                           layoutId={bigTvMatch.params.tvId}
                         >
                            {clickedTv && (
                                <>
                                    <BigCover
                                        style={{
                                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                            clickedTv.backdrop_path,
                                            "w500"
                                        )})`,
                                        }}
                                    />
                                    <BigTitle>{clickedTv.name}</BigTitle>
                                    <BigOverview>{clickedTv.overview}</BigOverview>
                                </>
                            )}
                         </BigTv>
                       </>
                        ) : null}
                </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Tv;