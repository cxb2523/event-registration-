const express = require('express')
const router = express.Router()
const {
  getRegistrationCount,
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  deleteRegistration
} = require('../controllers/registrationController')

router.get('/count', getRegistrationCount)
router.post('/', createRegistration)
router.get('/', getAllRegistrations)
router.get('/:id', getRegistrationById)
router.delete('/:id', deleteRegistration)

module.exports = router
