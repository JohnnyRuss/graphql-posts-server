const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

module.exports = {
  Mutation: {
    async login(_, { userName, password }) {
      const { valid, errors } = validateLoginInput(userName, password);
      if (!valid) {
        throw new UserInputError('Errors', errors);
      }
      const user = await User.findOne({ userName });
      if (!user) {
        errors.general = 'user not found';
        throw new UserInputError('wrong username or password', {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'wrong credentials';
        throw new UserInputError('wrong credentials', {
          errors,
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { userName, email, password, confirmPassword } },
      context,
      info
    ) {
      const { valid, errors } = validateRegisterInput(userName, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', errors);
      }

      const user = await User.findOne({ userName });

      if (user)
        throw new UserInputError('username is taken', {
          errors: {
            username: 'this username is taken',
          },
        });

      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        userName,
        password,
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

function generateToken(user) {
  const SECRET = process.env.JWT_SECRET;

  return JWT.sign(
    {
      id: user._id,
      email: user.email,
      userName: user.userName,
    },
    SECRET,
    { expiresIn: '1h' }
  );
}
