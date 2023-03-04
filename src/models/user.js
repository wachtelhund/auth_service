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
    maxlength: [2000, 'Password must be at most 2000 characters long.'],
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
