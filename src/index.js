import Mrujs from './mrujs.js';

const mrujs = {
  start: (config = {}) => {
    // Prevent loading mrujs twice
    if (window._mrujs_loaded === true) {
      return;
    }

    if (!window.mrujs) {
      window.mrujs = new Mrujs(config);
    } else if (!(window.mrujs instanceof Mrujs)) {
      throw new Error(
        'Unable to initialize mrujs. `window.mrujs` is already initialized'
      );
    }

    window.mrujs.start();
  },

  stop: () => {
    window.mrujs.stop();
  },
};

export default mrujs;
