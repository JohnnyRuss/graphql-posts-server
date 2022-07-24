const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) return post;
        else throw new Error('post not found');
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '')
        throw new UserInputError('empty post', {
          errors: {
            body: 'post body must not be empty',
          },
        });

      const newPost = await Post.create({ body, user: user.id, userName: user.userName });

      // context.pubsub.publish('NEW_POST', { newPost });

      return newPost;
    },

    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.id !== post.user.toString())
          throw new AuthenticationError('you are not authorized for this operation');

        const id = post.id;
        await post.delete();

        return { id };
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(_, { postId }, context) {
      const { userName } = checkAuth(context);

      let post = await Post.findById(postId);

      if (!post) throw new UserInputError('there are no post found');

      if (post.likes.some((like) => like.userName === userName))
        post.likes = post.likes.filter((like) => like.userName !== userName);
      else post.likes.push({ userName });

      await post.save();

      return post;
    },
  },

  // Subscription: {
  //   newPost: {
  //     subscribe: (_, args, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
  //   },
  // },
};
