import UseControl from "./useControl.js";
import Cell from "./CellClass.js";

class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    #bright;
    #contrast;
    #gamma;

    //データの初期化
    constructor(ctx, width, height, image1, font, bright, contrast, gamma) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#bright = bright;
        this.#contrast = contrast;
        this.#gamma = gamma;
        this.#ctx.font = `bold ${font}px Pixelify Sans`;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }

    //アスキーアートとなる文字を決定する
    #convertToSymbol(g) {
        switch (g) {
            case 100:
                return ".";
            case 60:
                return "⁙";
            case 150:
                return "±";
            case 200:
                return "o";
            case 250:
                return "P";
            default:
                return " ";
        }
    }

    //画像の明るさ、コントラスト、ガンマ補正を行う
    #ApplyEffectToRGB(color) {
        //  brightness
        color *= this.#bright;

        //  contrast
        color = Math.round(((color / 255 - 0.5) * this.#contrast + 0.5) * 255);

        //  gamma
        color = Math.pow(color / 255, this.#gamma) * 255;

        return color;
    }

    #ToConstantGragColor(color) {
        if (color < 50) {
            return 0;
        } else if (color < 60) {
            return 60;
        } else if (color < 100) {
            return 100;
        } else if (color < 150) {
            return 150;
        } else if (color < 200) {
            return 200;
        } else if (color < 250) {
            return 250;
        } else {
            return 255;
        }
    }

    //画像をスキャンしてアスキーアートを作成する
    #scanImage(cellSize) {
        this.#imageCellArray = [];

        for (let y = 0; y < this.#pixels.height; y += cellSize) {
            for (let x = 0; x < this.#pixels.width; x += cellSize) {
                const posX = x * 4; // 4 is the number of elements in the array for each pixel (r,g,b,a)
                const posY = y * 4; // 4 is the number of elements in the array for each pixel (r,g,b,a)
                const pos = posY * this.#pixels.width + posX;

                if (this.#pixels.data[pos + 3] > 0) {
                    let red = this.#pixels.data[pos];
                    let green = this.#pixels.data[pos + 1];
                    let blue = this.#pixels.data[pos + 2];

                    red = this.#ApplyEffectToRGB(red);
                    green = this.#ApplyEffectToRGB(green);
                    blue = this.#ApplyEffectToRGB(blue);

                    const total = red + green + blue;
                    const averageColorValue = this.#ToConstantGragColor(total / 3);
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const monochrome = "rgb(" + averageColorValue + "," + averageColorValue + "," + averageColorValue + ")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if (averageColorValue >= 50) this.#imageCellArray.push(new Cell(x * 3, y * 3, symbol, monochrome));
                }
            }
        }
        console.log(this.#imageCellArray.length);
    }

    //アスキーアートを描画する
    #drawAscii() {
        console.log(this.#imageCellArray.length);
        this.#ctx.clearRect(0, 0, 1920, 1080); //clear canvas #initialization
        for (let i = 0; i < this.#imageCellArray.length; i++) {
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }

    //アスキーアートを描画する
    draw(cellSize) {
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}

export default AsciiEffect;
