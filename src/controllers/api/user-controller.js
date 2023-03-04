export class UserController {
  async register (req, res, next) {
    console.log('REGISTER');
    next()
  }

  async login (req, res, next) {
    console.log('LOGIN');
    next()
  }
}