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
        this.#ctx.font = `${font}px Verdana`;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }

    //アスキーアートとなる文字を決定する
    #convertToSymbol(g) {
        const asciiChars = "@%#abcdefghi*+=-:.";
        const index = asciiChars.length - 1 - Math.floor((g / 255) * asciiChars.length - 1);
        return asciiChars[index];
    }

    //画像の明るさ、コントラスト、ガンマ補正を行う
    #ApplyEffectToRGB(color) {
        //  brightness
        color *= this.#bright;

        //  contrast
        color = (color - 0.5) * this.#contrast + 0.5;

        //  gamma
        color = Math.pow(color, 1 / this.#gamma);

        return color;
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
                    const averageColorValue = total / 3;
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if (total > 20) this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
    }

    //アスキーアートを描画する
    #drawAscii() {
        console.log(this.#imageCellArray.length);
        this.#ctx.clearRect(0, 0, this.#width, this.#height); //clear canvas #initialization
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
