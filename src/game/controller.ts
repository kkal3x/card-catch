import GameModel from './model';
import GameView from './view';

class GameController {
    private model: GameModel;
    private view: GameView;

    constructor(model: GameModel, view: GameView) {
        this.model = model;
        this.view = view;

        this.view.getApp().ticker.add(() => {
            this.update();
        });
    }

    private update() {
        this.model.updateScore(1);
        this.view.updateScore(this.model.getScore());
    }
}

export default GameController;