import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Slider, Switch } from "@mui/material";
import Cell from "./CellClass.js";
import AsciiEffect from "./AsciiEffectClass.js";

import useControl from "./useControl.js";

function App() {
    const { video, setVideo, videoChange, res, font, image, setImage, bright, contrast, gamma, resChange, fontChange, imageChange, brightChange, contrastChange, gammaChange } = useControl();
    const intervalRef = useRef(null);
    const [type, setType] = useState(true);
    useEffect(() => {
        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");
        const image1 = new Image();
        image1.src = image;

        if (type) {
            intervalRef.current = setInterval(() => copyFrame(), 1000 / 60);

            // コンポーネントがアンマウントされたときにクリーンアップ
            return () => {
                clearInterval(intervalRef.current);
            };
        } else {
            image1.onload = function initialize() {
                canvas.width = image1.width;
                canvas.height = image1.height;
                let effect = new AsciiEffect(ctx, canvas.width, canvas.height, image1, font, bright, contrast, gamma);
                effect.draw(res);
            }; //*/
        }
    }, [res, type, font, image, bright, contrast, gamma, video]);

    const copyFrame = () => {
        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");

        const video1 = document.getElementById("video");
        if (video1.videoWidth > 0 && video1.videoHeight > 0) {
            canvas.width = 1920; //video1.videoWidth;
            canvas.height = 1080; //video1.videoHeight;
            console.log(video1.videoWidth, video1.videoHeight);

            let effect = new AsciiEffect(ctx, video1.videoWidth, video1.videoHeight, video1, font, bright, contrast, gamma);
            effect.draw(res);
        }
    };

    return (
        <div className="App">
            <div className="container" style={{}}>
                <div className="controls" style={{ height: "10vh", display: "flex", justifyContent: "center", alignItems: "center", gap: "40px" }}>
                    <label>
                        Image
                        <input
                            type="file"
                            id="file"
                            accept=".png,.jpeg,.jpg"
                            style={{ margin: "30px" }}
                            onChange={(e) => {
                                setType(false);
                                imageChange(e);
                                setVideo("");
                            }}
                        ></input>
                    </label>
                    <label>
                        Video
                        <input
                            type="file"
                            id="file"
                            accept=".mp4"
                            style={{ margin: "30px" }}
                            onChange={(e) => {
                                setType(true);
                                videoChange(e);
                                setImage("");
                            }}
                        ></input>
                    </label>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label>
                        Resolution <Slider aria-label="res" size="small" sx={{ width: "20vw" }} min={1} max={100} step={1} value={res} valueLabelDisplay="on" onChange={(e) => resChange(e)} />
                    </label>

                    <label>
                        font size
                        <Slider aria-label="font" size="small" sx={{ width: "20vw" }} min={1} max={100} step={1} value={font} valueLabelDisplay="on" onChange={(e) => fontChange(e)} />
                    </label>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <video id="video" src={video} style={{ display: "none" }} autoPlay loop></video>
                    <canvas id="canvas1"></canvas>
                </div>
            </div>
        </div>
    );
}

export default App;

/*

                    <label>
                        Resolution <Slider aria-label="res" size="small" sx={{ width: "20vw" }} min={1} max={100} step={1} value={res} valueLabelDisplay="on" onChange={(e) => resChange(e)} />
                    </label>

                    <label>
                        font size
                        <Slider aria-label="font" size="small" sx={{ width: "20vw" }} min={1} max={100} step={1} value={font} valueLabelDisplay="on" onChange={(e) => fontChange(e)} />
                    </label>

                    <label>
                        bright <Slider aria-label="font" size="small" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={bright} valueLabelDisplay="on" onChange={(e) => brightChange(e)} />
                    </label>

                    <label>
                        contrast
                        <Slider aria-label="font" size="small" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={contrast} valueLabelDisplay="on" onChange={(e) => contrastChange(e)} />
                    </label>

                    <label>
                        gamma
                        <Slider aria-label="font" size="small" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={gamma} valueLabelDisplay="on" onChange={(e) => gammaChange(e)} />
                    </label>

*/
