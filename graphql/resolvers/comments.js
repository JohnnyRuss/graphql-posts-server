const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const { userName } = checkAuth(context);
      if (body.trim() === '')
        throw new UserInputError('empty comment', {
          errors: {
            body: 'comment body must not be empty',
          },
        });

      const post = await Post.findById(postId);

      if (!post) throw new UserInputError('post not found');

      post.comments.unshift({
        body,
        userName,
      });

      await post.save();

      return post;
    },

    async deleteComment(_, { postId, commentId }, context) {
      const user = checkAuth(context);

      const post = await Post.findById(postId);

      if (!post) throw new UserInputError('post not found');

      const commentIndex = post.comments.findIndex((comm) => comm.id === commentId);

      if (post.comments[commentIndex].userName !== user.userName)
        throw new AuthenticationError('you are not authorized for this operation');

      post.comments.splice(commentIndex, 1);

      await post.save();

      return post;
    },
  },
};
