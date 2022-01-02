export default async function ({ $axios, store, redirect }) {
  if (!process.server) {
    try {
      const { data } = await $axios.get(
        `${process.env.SERVER_URL}/api/user/me`,
        {
          withCredentials: true,
        }
      );

      redirect('/');
      store.commit('setUser', data.data);
      store.commit('setLoggedIn', true);
    } catch (_error) {
      // Continue, only non authenticated users should be able to view these routes.
    }
  }
}
