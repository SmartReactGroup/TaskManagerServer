'use strict'

import User from './user.model'
import config from '../../config/environment'
import jwt from 'jsonwebtoken'

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity)
    }
    return null
  }
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422
  return function(err) {
    return res.status(statusCode).json(err)
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500
  return function(err) {
    return res.status(statusCode).send(err)
  }
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password')
    .exec()
    .then((users) => {
      res.status(200).json(users)
    })
    .catch(handleError(res))
}

/**
 * Creates a new user
 */
export function create(req, res) {
  const newUser = new User(req.body)
  newUser.provider = 'local'
  newUser.role = 'user'
  return newUser
    .save()
    .then(function(user) {
      const token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      })
      res.json({ token })
    })
    .catch(validationError(res))
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  const userId = req.params.id

  return User.findById(userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).end()
      }
      res.json(user.profile)
    })
    .catch((err) => next(err))
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id)
    .exec()
    .then(function() {
      res.status(204).end()
    })
    .catch(handleError(res))
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  const userId = req.user._id
  const oldPass = String(req.body.oldPassword)
  const newPass = String(req.body.newPassword)
  User.findById(userId)
    .exec()
    .then((user) => {
      if (user.authenticate(oldPass)) {
        user.password = newPass
        user
          .save()
          .then(() => {
            res.status(200).json({ message: 'Password changed successfully!!' })
          })
          .catch(validationError(res))
      } else {
        res.status(403).json({ message: 'Old password is not correct!' })
      }
    })
}

// Upserts the given Thing in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id')
  }
  return User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res))
}

/**
 * Get my info
 */
export function me(req, res, next) {
  const userId = req.user._id

  return User.findOne({ _id: userId }, '-salt -password')
    .exec()
    .then((user) => {
      // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end()
      }
      return res.json(user)
    })
    .catch((err) => next(err))
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/')
}
