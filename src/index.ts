import Game from './game';

const game = new Game();
const app = game.app;

document.body.appendChild(app.view);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.view.style.height = '100%';
app.renderer.view.style.width = '100%';