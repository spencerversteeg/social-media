export const likePost = async (id) => {
  try {
    if (!id) {
      throw new Error('Missing ID ');
    }
    const newLike = await this.$axios.post(
      `${process.env.SERVER_URL}/api/post/${id}/like`,
      {},
      { withCrendentials: true }
    );

    return newLike;
  } catch (error) {
    console.log(error);
    // TODO: Err handl
  }
};
