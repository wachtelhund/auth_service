import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

/**
 * User model.
 */
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long.'],
    maxlength: [200, 'Password must be at most 200 characters long.'],
    required: true
  },
  firstName: {
    type: String,
    minlength: [2, 'First name must be at least 2 characters long.'],
    maxlength: [20, 'First name must be at most 20 characters long.'],
    required: true
  },
  lastName: {
    type: String,
    minlength: [2, 'First name must be at least 2 characters long.'],
    maxlength: [20, 'First name must be at most 20 characters long.'],
    required: true
  },
  email: {
    type: String,
    minlength: [5, 'Email must be at least 5 characters long.'],
    maxlength: [35, 'Email must be at most 35 characters long.'],
    unique: true,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

/**
 * Checks user password against database.
 *
 * @param {string} username - Username to check against database.
 * @param {string} password - Plaintext password to check against database.
 * @returns {boolean} True if user exists, false if not.
 */
schema.statics.isCorrectPassword = async function (username, password) {
  const user = await User.findOne({ username })
  const match = await bcrypt.compare(password, user.password)
  if (!user || !match) {
    throw new Error('Invalid login.')
  }
  return user
}

schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10)
})

export const User = mongoose.model('User', schema)
