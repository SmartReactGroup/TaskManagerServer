import Dialog from './dialog.model'
import User from '../user/user.model'
import { handleError } from '../utils'

const _createUserDialog = (newDialog, uId) =>
  new Promise((resolve, reject) => {
    User.findById(uId).then((user) => {
      newDialog.avatar = user.avatar
      newDialog.name = user.name
      newDialog.save().then((dialog) => {
        user.dialogs.push(dialog._id)
        user.save().then((savedUser) => resolve(savedUser))
          .catch((err) => reject(err))
      }).catch((err) => reject(err))
    }).catch((err) => reject(err))
  })


const _groupPromiseWrapper = (newDialog, uId) =>
  () => new Promise((resolve, reject) => {
    User.findById(uId).then((user) => {
      newDialog.save().then((dialog) => {
        user.dialogs.push(dialog._id)
        user.save().then((savedUser) => resolve(savedUser))
          .catch((err) => reject(err))
      }).catch((err) => reject(err))
    }).catch((err) => reject(err))
  })


export const createSingle = (req, res) => {
  const { initiator, members } = req.body
  Promise.all([
    _createUserDialog(new Dialog(req.body), members[0]),
    _createUserDialog(new Dialog(req.body), members[1]),
  ])
    .then((users) => {
      res.status(200).json({
        user: users.filter((u) => u._id === initiator),
        message: 'Dialog connected!'
      })
    })
    .catch(handleError(res))
}

export const createGroup = (req, res) => {
  const { initiator, members } = req.body
  const groupPromises = members.map((member) =>
    _groupPromiseWrapper(new Dialog(req.body), member))

  Promise.all(groupPromises)
    .then((users) => {
      res.status(200).json({
        user: users.filter((u) => u._id === initiator),
        message: 'Dialog connected!'
      })
    })
    .catch(handleError(res))
}
