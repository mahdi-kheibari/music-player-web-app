import { useContext, useEffect, useRef } from "react";
import { Card } from "react-bootstrap";
import { FaHeart, FaPauseCircle, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { MyContext } from "../context";
import SongListItem from "./songlist/SongListItem";
import { withRouter } from "react-router";
import { SwiperSlide } from "swiper/react";
import DraggableScroll from "./DraggableScroll";

const CurrentSongFav = ({ time, width, removeFromFav }) => {

    const { currentSongFav, setCurrentSongFav, currentTime, setCurrentTime, fullTime, setFullTime, favList, songHandlerFav, setSongHandlerFav } = useContext(MyContext)
    const audioRefFav = useRef();
    const currentIndexFav = favList.findIndex((item) => item.id === currentSongFav[0].id);
    function goNextFav() {
        if (currentIndexFav === favList.length - 1) {
            setCurrentSongFav([favList[0]]);
        } else { setCurrentSongFav([favList[currentIndexFav + 1]]); }
    }
    function goBackFav() {
        if (currentIndexFav === 0) {
            setCurrentSongFav([favList[favList.length - 1]]);
        } else { setCurrentSongFav([favList[currentIndexFav - 1]]); }
    }

    useEffect(() => {
        const play = async () => {
            if (songHandlerFav) { await audioRefFav.current.play(); }
            else { await audioRefFav.current.pause(); }
        }
        play();
        var timeFav = setInterval(async () => {
            await setCurrentTime(audioRefFav.current.currentTime);
            await setFullTime(audioRefFav.current.duration);
        }, 1000);
        return function cleanup() {
            clearInterval(timeFav);
        }
    }, [songHandlerFav, currentSongFav]);// eslint-disable-line react-hooks/exhaustive-deps

    const imgRef = useRef();
    const imgBoxRef = useRef();
    function setHeight() {
        const imgwidth = imgRef.current.width;
        imgBoxRef.current.height = imgwidth;
        console.log(imgBoxRef.current.height);
        console.log(imgRef.current.height);
    }
    return (
        <>
            <audio
                src={currentSongFav[0].address}
                ref={audioRefFav}
                onEnded={goNextFav}>
            </audio>
            {(width > 778) ?
                <div className="currentSong" style={{ backgroundImage: "linear-gradient(0deg,rgba(35,53,74,0.7),rgba(35,53,74,0.85)), url(" + currentSongFav[0].cover + ")" }}>
                    <div className="row no-gutters">
                        <div className="col-5 col-xl-3 p-0 d-flex justify-content-end">
                            <Card className="currentSong_box">
                                <Card.Img className="currentSong_box-img mx-auto" src={currentSongFav[0].cover} />
                                {(songHandlerFav) ?
                                    <FaPauseCircle onClick={() => setSongHandlerFav(!songHandlerFav)} size="4rem" className="currentSong_box-icon" />
                                    :
                                    <FaPlay onClick={() => setSongHandlerFav(!songHandlerFav)} size="4rem" className="currentSong_box-icon" />
                                }
                                <Card.Body>
                                    <Card.Title>{currentSongFav[0].name}</Card.Title>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Card.Text>{currentSongFav[0].singer}</Card.Text>
                                        <div className="visualizer d-flex align-items-baseline">
                                            <div className="visualizer_icon"></div>
                                            <div className="visualizer_icon2"></div>
                                            <div className="visualizer_icon3"></div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-7 col-xl-9">
                            <div className="row no-gutters">
                                <div className="col-12">
                                    <div className="currentSong_caption">
                                        <div className="row justify-content-between w-100 align-items-center">
                                            <div className="col-6 ml-3">
                                                <h2 className="font-weight-bold">{currentSongFav[0].name}</h2>
                                                <h4>{currentSongFav[0].singer}</h4>
                                            </div>
                                            <div className="col-5 d-flex flex-column align-items-end mr-xl-auto">
                                                <div>
                                                    <FaStepBackward onClick={goBackFav} size="2rem" className="m-2 currentSong_caption-icon" />
                                                    {(songHandlerFav) ?
                                                        <FaPauseCircle onClick={() => setSongHandlerFav(!songHandlerFav)} size="2.5rem" className="m-2 currentSong_caption-icon" />
                                                        :
                                                        <FaPlay onClick={() => setSongHandlerFav(!songHandlerFav)} size="2.5rem" className="m-2 currentSong_caption-icon" />
                                                    }
                                                    <FaStepForward onClick={goNextFav} size="2rem" className="ml-2 currentSong_caption-icon" />

                                                </div>
                                                <FaHeart onClick={removeFromFav} size="2rem" className="currentSong_caption-icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="currentSong_time d-flex justify-content-between">
                                        <span className="ml-2">{time(currentTime)}</span>
                                        <span className="mr-2">{time(fullTime)}</span>
                                    </div>
                                    <div className="currentSong_range">
                                        <div className="currentSong_range-slider">
                                            <div className="progress" style={{ width: (currentTime / fullTime) * 100 + "%" }}></div>
                                            <input type="range" onChange={(e) => audioRefFav.current.currentTime = e.target.value} min="0" max={fullTime} value={currentTime} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                :
                // Start Mobile current song fav
                <div>
                    <div className="currentSongMobile" style={{ backgroundImage: "linear-gradient(0deg,rgba(35,53,74,0.7),rgba(35,53,74,0.85)), url(" + currentSongFav[0].cover + ")" }}>
                        <div className="row no-gutters">
                            <div className="col-11 col-sm-6 p-0 d-flex justify-content-end">
                                <Card className="currentSongMobile_box">
                                    <div className="currentSongMobile_box-img mx-auto mt-3" ref={imgBoxRef} onLoad={setHeight}>
                                    <Card.Img className="currentSongMobile_box-img-shadow mx-auto" src={currentSongFav[0].cover} ref={imgRef}/>
                                        <div className="currentSongMobile_box-img-icon mx-auto">
                                            <FaStepBackward onClick={goBackFav} size={(width <= 580) ? "2rem" : "3rem"} className="m-2 currentSong_caption-icon" />
                                            {(songHandlerFav) ?
                                                <FaPauseCircle onClick={() => setSongHandlerFav(!songHandlerFav)} size={(width <= 600) ? "2.5rem" : "3.5rem"} className="m-2 currentSong_caption-icon" />
                                                :
                                                <FaPlay onClick={() => setSongHandlerFav(!songHandlerFav)} size={(width <= 580) ? "2.5rem" : "3.5rem"} className="m-2 currentSong_caption-icon" />
                                            }
                                            <FaStepForward onClick={goNextFav} size={(width <= 580) ? "2rem" : "3rem"} className="m-2 currentSong_caption-icon" />
                                        </div>
                                    </div>

                                    <Card.Body className="">
                                        <div className="d-flex justify-content-between">
                                            <Card.Title className="font-weight-bold">{currentSongFav[0].name}</Card.Title>
                                            <FaHeart onClick={removeFromFav} size="2rem" className="currentSong_caption-icon" />
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Card.Text>{currentSongFav[0].singer}</Card.Text>
                                            <div className="visualizer d-flex align-items-baseline">
                                                <div className="visualizer_icon"></div>
                                                <div className="visualizer_icon2"></div>
                                                <div className="visualizer_icon3"></div>
                                            </div>
                                        </div>
                                        <div className="currentSongMobile_time d-flex justify-content-between font-weight-bold">
                                            <span>{time(currentTime)}</span>
                                            <span>{time(fullTime)}</span>
                                        </div>
                                        <div className="currentSongMobile_range">
                                            <div className="currentSongMobile_range-slider">
                                                <div className="progress" style={{ width: (currentTime / fullTime) * 100 + "%" }}></div>
                                                <input type="range" onChange={(e) => audioRefFav.current.currentTime = e.target.value} min="0" max={fullTime} value={currentTime} />
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="songListMobile col-11 col-sm-5 ml-3">
                                <DraggableScroll width={width}>
                                    {favList.map((item) => (
                                        <SwiperSlide>
                                            <SongListItem key={item.id} name={item.name} singer={item.singer} cover={item.cover} id={item.id} />
                                        </SwiperSlide>
                                    ))}
                                </DraggableScroll>
                            </div>
                        </div>
                    </div>
                </div>
                // End Mobile current song fav
            }
        </>
    );
}

export default withRouter(CurrentSongFav);