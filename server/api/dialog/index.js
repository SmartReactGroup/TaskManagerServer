import { Router } from 'express'
import * as controller from './dialog.controller'
// import * as auth from '../../auth/auth.service'

const router = Router()

router.post('/single', controller.createSingle)
router.post('/group', controller.createGroup)

export default router
