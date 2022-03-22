const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  scrape: {
    get: (exchange)=>{
      return ipcRenderer.invoke('scrape:get', exchange);
    }
  },
  exchange: {
    getBalance: (exchange, symbol)=>{
      return ipcRenderer.invoke('exchange:getBalance', exchange, symbol);
    },
    snipe: (exchange, symbol,leverage, percentage, timestamp) =>{
      return ipcRenderer.invoke('exchange:snipe', exchange, symbol, leverage, percentage, timestamp);
    }
  },
  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  // Any other methods you want to expose in the window object.
  // ...
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
