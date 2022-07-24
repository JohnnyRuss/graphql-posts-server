const { model, Schema } = require('mongoose');

const postSchema = new Schema(
  {
    body: String,
    userName: String,
    comments: [
      {
        body: String,
        userName: String,
        createdAt: Date,
      },
    ],
    likes: [
      {
        userName: String,
        createdAt: Date,
      },
    ],
    user: {
      type: Schema.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

module.exports = model('Post', postSchema);
