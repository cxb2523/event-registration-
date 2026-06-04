const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: parseInt(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendConfirmationEmail = async (registration, eventInfo) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: registration.email,
    subject: `【报名成功】${eventInfo.title}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">报名成功</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333;">尊敬的 <strong>${registration.name}</strong> 女士/先生：</p>
          
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            恭喜您！您已成功报名参加 <strong>${eventInfo.title}</strong>。
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">活动信息</h3>
            <ul style="list-style: none; padding: 0; color: #555;">
              <li style="margin: 10px 0;">
                <strong>📅 活动时间：</strong>${eventInfo.date} ${eventInfo.time}
              </li>
              <li style="margin: 10px 0;">
                <strong>📍 活动地点：</strong>${eventInfo.location}
              </li>
            </ul>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #667eea; margin-top: 0;">报名信息</h3>
            <ul style="list-style: none; padding: 0; color: #555;">
              <li style="margin: 10px 0;">
                <strong>姓名：</strong>${registration.name}
              </li>
              <li style="margin: 10px 0;">
                <strong>邮箱：</strong>${registration.email}
              </li>
              <li style="margin: 10px 0;">
                <strong>手机号：</strong>${registration.phone}
              </li>
              <li style="margin: 10px 0;">
                <strong>报名时间：</strong>${new Date(registration.registeredAt).toLocaleString('zh-CN')}
              </li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #888; margin-top: 30px; text-align: center;">
            如有任何问题，请随时联系我们。<br>
            期待与您相见！
          </p>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 活动报名系统. 保留所有权利.</p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('发送邮件失败:', error)
    return false
  }
}

const verifyConnection = async () => {
  try {
    await transporter.verify()
    console.log('邮件服务器连接成功')
    return true
  } catch (error) {
    console.error('邮件服务器连接失败:', error)
    return false
  }
}

module.exports = {
  sendConfirmationEmail,
  verifyConnection
}
