const gql = require('graphql-tag');

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    userName: String!
    comments: [Comment]!
    likes: [Like]
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    userName: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    userName: String!
  }

  type User {
    id: ID!
    token: String!
    email: String!
    userName: String!
    createdAt: String!
  }

  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Id {
    id: ID!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(userName: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): Id!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: String!): Post!
    likePost(postId: String!): Post!
  }

  # type Subscription {
  #   newPost: Post!
  # }
`;

module.exports = typeDefs;
