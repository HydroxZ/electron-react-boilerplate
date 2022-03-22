import create from 'zustand';

const useStore = create((set) => ({
  watchlist: [],
  kucoinBalance: 0,
  bybitBalance: 0,

  addToWatchlist: (obj) => {
    set((state) => {
      return {
        watchlist: [...state.watchlist, obj],
      };
    });
  },

  editFromWatchlist: (obj) => {
    set((state) => {
      return {
        watchlist: state.watchlist.map((item) => {
          if (item.id === obj.id) {
            return obj;
          }
          return item;
        }),
      };
    });
  },
  removeFromWatchlist: (id) => {
    set((state) => {
      return {
        watchlist: state.watchlist.filter((item) => item.id !== id),
      };
    });
  },
}));
export default useStore;
