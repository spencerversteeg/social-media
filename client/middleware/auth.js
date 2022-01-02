export default async function ({ $axios, store, redirect }) {
  if (!process.server) {
    try {
      const { data } = await $axios.get(
        `${process.env.SERVER_URL}/api/user/me`,
        {
          withCredentials: true,
        }
      );

      store.commit('setUser', data.data);
      store.commit('setLoggedIn', true);
    } catch (error) {
      redirect('/login');
      store.commit('setUser', {});
      store.commit('setLoggedIn', false);
    }
  }
}
