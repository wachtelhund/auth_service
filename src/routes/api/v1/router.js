/**
 * Main router.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */
import express from 'express'
import createError from 'http-errors'
import { UserController } from '../../../controllers/api/user-controller.js'

export const router = express.Router()

router.post('/register', (req, res, next) => UserController.register(req, res, next))
router.post('/login', (req, res, next) => UserController.register(req, res, next))