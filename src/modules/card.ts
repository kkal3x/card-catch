import * as PIXI from 'pixi.js';

class Card{
    public code: string;
    public imageUrl: string;
    public image: HTMLImageElement = new Image();
    public sprite: PIXI.Sprite;
    public animations: any[] = [];

    constructor(code: string, imageUrl: string) {
        this.code = code;
        this.imageUrl = imageUrl;
        this.sprite = new PIXI.Sprite();
        this.sprite.anchor.set(0.5, 0.5);
    }

    public async loadImage(): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            this.image.crossOrigin = "anonymous";
            this.image.src = this.imageUrl;
            this.image.onload = () => {
                const baseTexture = new PIXI.BaseTexture(this.image);
                this.sprite.texture = new PIXI.Texture(baseTexture);
                resolve(this.image);
            };
            this.image.onerror = reject;
        });
    }

}

export default Card;