export class InputManager {
  constructor() {
    this.keys = {};
    const keyMap = new Map();

    const setKey = (keyName, pressed) => {
      const keyState = this.keys[keyName];
      keyState.down = pressed;
    };

    const setKeyFromKeyCode = (keyCode, pressed) => {
      const keyName = keyMap.get(keyCode);
      if (!keyName) {
        return;
      }
      setKey(keyName, pressed);
    };

    const addKey = (keyCode, name) => {
        this.keys[name] = { down: false};
        keyMap.set(keyCode, name);
    };

    addKey(87, 'W');
    addKey(65, 'A');
    addKey(83, 'S');
    addKey(68, 'D');

    window.addEventListener('keydown', (e) => {
      setKeyFromKeyCode(e.keyCode, true);
    });
    window.addEventListener('keyup', (e) => {
      setKeyFromKeyCode(e.keyCode, false);
    });
  }
}
