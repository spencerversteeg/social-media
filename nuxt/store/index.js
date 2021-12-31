export const state = () => ({
  user: {},
  loggedIn: false,
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setLoggedIn(state, loggedIn) {
    state.loggedIn = loggedIn;
  },
};
