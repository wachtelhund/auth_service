import { User } from '../../models/user.js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
/**
 * Handles the user related requests.
 */
export class UserController {
  /**
   * Handles the registration of a new user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async register (req, res, next) {
    const data = req.body

    try {
      const user = new User({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        permissionLevel: 1
      })

      await user.save()

      console.log('USER SAVED')

      res
        .status(201)
        .json({ id: user._id })
    } catch (error) {
      let e = error
      console.log(error.name);
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
    try {
      const user = await User.isCorrectPassword(req.body.username, req.body.password)

      const payload = {
        sub: user.username,
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.email,
        x_permission_level: user.permissionLevel
      }

      const accessToken = jwt.sign(payload, 'supersecret', {
        algorithm: 'HS256',
        expiresIn: '300s'
      })

      res
        .status(201)
        .json({
          access_token: accessToken
        })
    } catch (error) {
      const err = createError(401, 'Invalid login.')
      err.cause = error
      next(err)
    }
  }

  async refresh (req, res, next) {
    try {
      const [authorizationType, token] = req.headers.authorization?.split(' ')
      console.log(authorizationType, token);
      if (authorizationType !== 'Bearer') {
        throw new Error('Invalid authorization type.')
      } else if (!token) {
        throw new Error('No token provided.')
      }

      const payload = jwt.verify(token, 'supersecret', (err, decoded) => {
        if (err) {
          throw new Error('Invalid token.')
        }
        return decoded
      })
      console.log(payload);
      delete payload.exp
      const newToken = jwt.sign(payload, 'supersecret', {
        algorithm: 'HS256',
        expiresIn: '300s'
      })
      res
        .status(201)
        .json({
          access_token: newToken
        })
    } catch (error) {
      const err = createError(401, error.message)
      err.cause = error
      next(err)
    }
  }
}
