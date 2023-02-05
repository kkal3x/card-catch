import GameModel from './game/model';
import GameView from './game/view';
import GameController from './game/controller';

const model = new GameModel();
const view = new GameView();
const controller = new GameController(model, view);

const app = view.getApp();

document.body.appendChild(app.view);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';