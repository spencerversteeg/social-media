export default async function ({ $axios, store, redirect }) {
  if (!process.server) {
    try {
      const { data } = await $axios.get(`http://localhost:8080/api/user/me`, {
        withCredentials: true,
      });

      store.commit('setUser', data.data);
      store.commit('setLoggedIn', true);
    } catch (error) {
      redirect('/login');
      store.commit('setUser', {});
      store.commit('setLoggedIn', false);
    }
  }
}
