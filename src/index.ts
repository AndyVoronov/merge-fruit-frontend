import Phaser from 'phaser';
import i18next from 'i18next';
import { MainScene } from './game/scenes/MainScene';

i18next.init({
  lng: 'ru',
  resources: {
    ru: { translation: { 'game.title': 'Merge Fruit Adventure', 'score': 'Счёт', 'game.over': 'Игра окончена', 'restart': 'Рестарт' } },
    en: { translation: { 'game.title': 'Merge Fruit Adventure', 'score': 'Score', 'game.over': 'Game Over', 'restart': 'Restart' } },
  },
});

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#222',
  parent: 'game',
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 1 }, // 1 = нормальная гравитация Matter
      enableSleeping: true,
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

// --- Telegram Mini App интеграция ---
// Объявляем глобальные переменные для TS
declare global {
  interface Window {
    t?: (key: string) => string;
    game?: any;
  }
}
// @ts-ignore
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  // Кастомизация кнопки
  tg.MainButton.setText('🔄 ' + (window.t ? window.t('restart') : 'Рестарт'));
  tg.MainButton.show();
  tg.MainButton.onClick(() => {
    // Попытка найти сцену и перезапустить
    const game = window.game;
    if (game && game.scene && game.scene.keys && game.scene.keys.MainScene) {
      game.scene.keys.MainScene.scene.restart();
    } else {
      window.location.reload();
    }
  });
  // Адаптация размеров canvas под Telegram viewport
  function resizeGame() {
    const h = tg.viewportHeight || window.innerHeight;
    const w = tg.viewportStableWidth || window.innerWidth;
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    }
  }
  tg.onEvent('viewportChanged', resizeGame);
  window.addEventListener('resize', resizeGame);
  setTimeout(resizeGame, 100);
}

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
}); 