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
            intervalRef.current = setInterval(() => copyFrame(), 1000 / 30);

            // コンポーネントがアンマウントされたときにクリーンアップ
            return () => {
                clearInterval(intervalRef.current);
            };
        } else {
            image1.onload = function initialize() {
                canvas.width = image1.width;
                canvas.height = image1.height;
                let effect = new AsciiEffect(ctx, image1.width, image1.height, image1, font, bright, contrast, gamma);
                effect.draw(res);
            }; //*/
        }
    }, [res, type, font, image, bright, contrast, gamma, video]);

    const copyFrame = () => {
        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");

        const video1 = document.getElementById("video");
        if (video1.videoWidth > 0 && video1.videoHeight > 0) {
            canvas.width = video1.videoWidth;
            canvas.height = video1.videoHeight;

            let effect = new AsciiEffect(ctx, video1.videoWidth, video1.videoHeight, video1, font, bright, contrast, gamma);
            effect.draw(res);
        }
    };

    return (
        <div className="App">
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ maxWidth: "50vw", maxHeight: "100vh" }}>
                    <video id="video" src={video} style={{ maxWidth: "50vw", maxHeight: "50vh" }} autoPlay loop></video>
                    <canvas id="canvas1" style={{ maxWidth: "50vw", maxHeight: "50vh" }}></canvas>
                </div>
                <div className="controls" style={{ height: "100vh", maxHeight: "100vh", display: "flex", flexGrow: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "40px" }}>
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

                    <label>Resolution</label>
                    <Slider aria-label="res" sx={{ width: "20vw" }} min={10} max={40} step={1} value={res} valueLabelDisplay="on" onChange={(e) => resChange(e)} />

                    <label>font size</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={6} max={40} step={1} value={font} valueLabelDisplay="on" onChange={(e) => fontChange(e)} />

                    <label>bright</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={bright} valueLabelDisplay="on" onChange={(e) => brightChange(e)} />

                    <label>contrast</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={contrast} valueLabelDisplay="on" onChange={(e) => contrastChange(e)} />

                    <label>gamma</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={gamma} valueLabelDisplay="on" onChange={(e) => gammaChange(e)} />
                </div>
            </div>
        </div>
    );
}

export default App;
