const Registration = require('../models/Registration')
const Event = require('../models/Event')
const { sendConfirmationEmail } = require('../services/emailService')

const MAX_PARTICIPANTS = 100

const getRegistrationCount = async (req, res) => {
  try {
    const count = await Registration.countDocuments()
    res.json({ count })
  } catch (error) {
    console.error('获取报名人数失败:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

const createRegistration = async (req, res) => {
  try {
    const { name, email, phone } = req.body

    const currentCount = await Registration.countDocuments()
    if (currentCount >= MAX_PARTICIPANTS) {
      return res.status(400).json({ message: '报名名额已满' })
    }

    const existingRegistration = await Registration.findOne({ email })
    if (existingRegistration) {
      return res.status(400).json({ message: '该邮箱已报名' })
    }

    const registration = new Registration({
      name,
      email,
      phone
    })

    await registration.save()

    const eventInfo = {
      title: '2024 技术创新峰会',
      date: '2024年6月15日',
      time: '09:00 - 18:00',
      location: '北京国际会议中心'
    }

    const emailSent = await sendConfirmationEmail(registration, eventInfo)
    if (emailSent) {
      registration.emailSent = true
      await registration.save()
    }

    res.status(201).json({
      message: '报名成功',
      registration: {
        id: registration._id,
        name: registration.name,
        email: registration.email
      }
    })
  } catch (error) {
    console.error('创建报名失败:', error)
    if (error.name === 'ValidationError') {
      const errors = {}
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message
      })
      return res.status(400).json({ message: '数据验证失败', errors })
    }
    res.status(500).json({ message: '服务器错误' })
  }
}

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 })
    res.json(registrations)
  } catch (error) {
    console.error('获取报名列表失败:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
    if (!registration) {
      return res.status(404).json({ message: '报名记录不存在' })
    }
    res.json(registration)
  } catch (error) {
    console.error('获取报名详情失败:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id)
    if (!registration) {
      return res.status(404).json({ message: '报名记录不存在' })
    }
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除报名失败:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

module.exports = {
  getRegistrationCount,
  createRegistration,
  getAllRegistrations,
  getRegistrationById,
  deleteRegistration
}
