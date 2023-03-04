import { User } from '../../models/user.js'
import createError from 'http-errors'
export class UserController {
  async register (req, res, next) {
    console.log('REGISTER');
    const data = req.body
    console.log(data);
    try {
      const user = new User({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      })

      await user.save()

      res
        .status(201)
        .json({ id: user._id })
    } catch (error) {
      let e = error
      if (e.code === 11000) {
        e = createError(409, 'Username or email already exists.')
        e.cause = error
      } else if (error.name === 'ValidationError') {
        e = createError(400, 'Invalid data.')
        e.cause = error
      }
      next(e)
    }
  }

  async login (req, res, next) {
    console.log('LOGIN');
    next()
  }
}