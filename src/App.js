import logo from "./logo.svg";
import "./App.css";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { src } from "./local.js";
import { Slider } from "@mui/material";

function App() {
    const [res, setRes] = useState(10);
    const [font, setFont] = useState(10);
    const [image, setImage] = useState("");
    const [bright, setBright] = useState(1);
    const [contrast, setContrast] = useState(1);
    const [gamma, setGamma] = useState(1);

    const resChange = (e) => {
        setRes(e.target.value);
    };

    const fontChange = (e) => {
        setFont(e.target.value);
    };

    const brightChange = (e) => {
        setBright(e.target.value);
    };

    const contrastChange = (e) => {
        setContrast(e.target.value);
    };

    const gammaChange = (e) => {
        setGamma(e.target.value);
    };

    const imageChange = (e) => {
        setImage("");
        const uploadImage = e.target.files[0];
        console.log(uploadImage);
        const reader = new FileReader();

        reader.onload = (e) => {
            const base64 = e.currentTarget.result;
            console.log(base64);
            setImage(base64);
        };

        reader.readAsDataURL(uploadImage);
    };

    useEffect(() => {
        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");

        const image1 = new Image();
        image1.src = image;
        let effect;

        image1.onload = function initialize() {
            canvas.width = image1.width;
            canvas.height = image1.height;
            effect = new AsciiEffect(ctx, image1.width, image1.height);
            effect.draw(res);
        };

        class Cell {
            constructor(x, y, symbol, color) {
                this.x = x;
                this.y = y;
                this.symbol = symbol;
                this.color = color;
            }

            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.fillText(this.symbol, this.x, this.y);
            }
        }

        class AsciiEffect {
            #imageCellArray = [];
            #pixels = [];
            #ctx;
            #width;
            #height;

            constructor(ctx, width, height) {
                this.#ctx = ctx;
                this.#width = width;
                this.#height = height;
                this.#ctx.font = `${font}px Verdana`;
                this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
                this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
                //console.log(this.#pixels);
            }

            #convertToSymbol(g) {
                if (g > 250) return "@";
                else if (g > 220) return "*";
                else if (g > 200) return "R";
                else if (g > 180) return "O";
                else if (g > 160) return "C";
                else if (g > 140) return "K";
                else if (g > 120) return "W";
                else if (g > 100) return "E";
                else if (g > 80) return "L";
                else if (g > 60) return "/";
                else if (g > 40) return "-";
                else if (g > 20) return "X";
                else return "";
            }

            #scanImage(cellSize) {
                this.#imageCellArray = [];

                for (let y = 0; y < this.#pixels.height; y += cellSize) {
                    for (let x = 0; x < this.#pixels.width; x += cellSize) {
                        const posX = x * 4;
                        const posY = y * 4;
                        const pos = posY * this.#pixels.width + posX;

                        if (this.#pixels.data[pos + 3] > 128) {
                            let red = this.#pixels.data[pos];
                            let green = this.#pixels.data[pos + 1];
                            let blue = this.#pixels.data[pos + 2];

                            //brightness
                            red = red * bright;
                            green = green * bright;
                            blue = blue * bright;

                            //contrast
                            red = (red - 128) * contrast + 128;
                            green = (green - 128) * contrast + 128;
                            blue = (blue - 128) * contrast + 128;

                            //gamma
                            red = Math.pow(red / 255, 1 / gamma) * 255;
                            green = Math.pow(green / 255, 1 / gamma) * 255;
                            blue = Math.pow(blue / 255, 1 / gamma) * 255;

                            const total = red + green + blue;
                            const averageColorValue = total / 3;
                            const color = "rgb(" + red + "," + green + "," + blue + ")";
                            const symbol = this.#convertToSymbol(averageColorValue);
                            if (total > 20) this.#imageCellArray.push(new Cell(x, y, symbol, color));
                        }
                    }
                }
                //console.log(this.#imageCellArray);
            }
            #drawAscii() {
                this.#ctx.clearRect(0, 0, this.#width, this.#height);
                for (let i = 0; i < this.#imageCellArray.length; i++) {
                    this.#imageCellArray[i].draw(this.#ctx);
                }
            }
            draw(cellSize) {
                this.#scanImage(cellSize);
                this.#drawAscii();
            }
        }
    }, [res, font, image, bright, contrast, gamma]);

    return (
        <div className="App">
            <div className="container">
                <canvas id="canvas1" style={{ maxWidth: "100vw", maxHeight: "50vh", margin: "30px" }}></canvas>
                <div className="controls" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                    <input type="file" id="file" accept=".png,.jpeg,.jpg" style={{ margin: "30px" }} onChange={imageChange}></input>

                    <label>Resolution</label>
                    <Slider aria-label="res" sx={{ width: "20vw" }} min={3} max={40} step={1} value={res} valueLabelDisplay="on" onChange={resChange} />

                    <label>font size</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={3} max={40} step={1} value={font} valueLabelDisplay="on" onChange={fontChange} />

                    <label>bright</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={bright} valueLabelDisplay="on" onChange={brightChange} />

                    <label>contrast</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={contrast} valueLabelDisplay="on" onChange={contrastChange} />

                    <label>gamma</label>
                    <Slider aria-label="font" sx={{ width: "20vw" }} min={0} max={3} step={0.1} value={gamma} valueLabelDisplay="on" onChange={gammaChange} />
                </div>
            </div>
        </div>
    );
}

export default App;
