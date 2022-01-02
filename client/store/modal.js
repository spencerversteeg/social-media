export const state = () => ({
  open: [],
});

export const mutations = {
  open: (state, name) => state.open.unshift(name),
  close: (state, name) => {
    state.open = state.open.filter((singleName) => singleName !== name);
  },
};

export const getters = {
  active: (state) => (state.open.length > 0 ? state.open[0] : null),
  allOpen: (state) => state.open,
};
