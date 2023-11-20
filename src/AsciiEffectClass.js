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
        this.#ctx.font = `bold ${font}px Verdana`;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }

    //アスキーアートとなる文字を決定する
    #convertToSymbol(g) {
        const string = ".*/●";
        const asciiChars = ".";
        const index = Math.round((g / 255) * string.length) - 1;
        if (index < 0) return string[0];
        if (index >= string.length) return string[string.length - 1];
        return string[index];
        /*
        if (g > 200) {
            const index = Math.floor(Math.random() * string.length);
            return string[index];
        } else if (g > 100) {
            const index = Math.floor(Math.random() * string2.length);
            return string2[index];
        } else {
            const index = Math.floor(Math.random() * asciiChars.length);
            return asciiChars[index];
        }//*/
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
                    const monochrome = "rgb(" + averageColorValue + "," + averageColorValue + "," + averageColorValue + ")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if (total > 20) this.#imageCellArray.push(new Cell(x, y, symbol, monochrome));
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
