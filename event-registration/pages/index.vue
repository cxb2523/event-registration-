<template>
  <div class="container">
    <div class="event-card">
      <div class="event-header">
        <h1>{{ event.title }}</h1>
        <p class="tagline">{{ event.tagline }}</p>
        <div class="event-meta">
          <div class="meta-item">
            <span>📅</span>
            <span>{{ event.date }}</span>
          </div>
          <div class="meta-item">
            <span>📍</span>
            <span>{{ event.location }}</span>
          </div>
          <div class="meta-item">
            <span>⏰</span>
            <span>{{ event.time }}</span>
          </div>
        </div>
      </div>

      <div class="event-content">
        <div class="event-description">
          <p>{{ event.description }}</p>
        </div>

        <div class="registration-info">
          <h3>报名信息</h3>
          <p>报名人数上限：{{ event.maxParticipants }} 人</p>
          <div class="registration-status">
            <span>已报名：{{ currentRegistrations }} / {{ event.maxParticipants }}</span>
            <span :class="isFull ? 'status-closed' : 'status-open'">
              {{ isFull ? '报名已满' : '报名进行中' }}
            </span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${(currentRegistrations / event.maxParticipants) * 100}%` }"
            ></div>
          </div>
        </div>

        <div v-if="registrationSuccess" class="success-message">
          <h4>🎉 报名成功！</h4>
          <p>确认邮件已发送至您的邮箱，请查收。</p>
        </div>

        <div v-else-if="isFull" class="closed-message">
          <h4>😢 报名已满</h4>
          <p>非常抱歉，本次活动报名名额已满。</p>
        </div>

        <div v-else class="registration-form">
          <h3>立即报名</h3>
          <form @submit.prevent="submitRegistration">
            <div class="form-group">
              <label for="name">姓名 *</label>
              <input 
                id="name"
                v-model="form.name"
                type="text"
                :class="{ error: errors.name }"
                placeholder="请输入您的姓名"
              >
              <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            </div>

            <div class="form-group">
              <label for="email">邮箱 *</label>
              <input 
                id="email"
                v-model="form.email"
                type="email"
                :class="{ error: errors.email }"
                placeholder="请输入您的邮箱地址"
              >
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label for="phone">手机号 *</label>
              <input 
                id="phone"
                v-model="form.phone"
                type="tel"
                :class="{ error: errors.phone }"
                placeholder="请输入您的手机号码"
              >
              <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '提交报名' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: {
        title: '2024 技术创新峰会',
        tagline: '探索前沿技术，共创美好未来',
        date: '2024年6月15日',
        location: '北京国际会议中心',
        time: '09:00 - 18:00',
        description: '本次技术创新峰会汇聚了来自全球的顶尖技术专家和行业领袖，将深入探讨人工智能、区块链、云计算等前沿技术的最新发展和应用。您将有机会与行业大咖面对面交流，参与精彩的圆桌讨论，还能结识来自各行各业的技术爱好者。无论您是技术从业者、创业者还是投资人，本次峰会都将为您带来宝贵的收获和启发。',
        maxParticipants: 100
      },
      currentRegistrations: 0,
      form: {
        name: '',
        email: '',
        phone: ''
      },
      errors: {},
      isSubmitting: false,
      registrationSuccess: false
    }
  },

  computed: {
    isFull() {
      return this.currentRegistrations >= this.event.maxParticipants
    }
  },

  mounted() {
    this.fetchRegistrationCount()
  },

  methods: {
    async fetchRegistrationCount() {
      try {
        const response = await this.$axios.$get('/registrations/count')
        this.currentRegistrations = response.count
      } catch (error) {
        console.error('获取报名人数失败:', error)
      }
    },

    validateForm() {
      this.errors = {}
      
      if (!this.form.name.trim()) {
        this.errors.name = '请输入姓名'
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email.trim()) {
        this.errors.email = '请输入邮箱'
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = '请输入有效的邮箱地址'
      }

      const phoneRegex = /^1[3-9]\d{9}$/
      if (!this.form.phone.trim()) {
        this.errors.phone = '请输入手机号'
      } else if (!phoneRegex.test(this.form.phone)) {
        this.errors.phone = '请输入有效的手机号码'
      }

      return Object.keys(this.errors).length === 0
    },

    async submitRegistration() {
      if (!this.validateForm()) {
        return
      }

      this.isSubmitting = true

      try {
        await this.$axios.$post('/registrations', this.form)
        this.registrationSuccess = true
        this.fetchRegistrationCount()
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.message === '报名名额已满') {
            alert('报名名额已满')
          } else if (error.response.data.message === '该邮箱已报名') {
            this.errors.email = '该邮箱已报名'
          } else {
            alert('报名失败，请稍后重试')
          }
        } else {
          alert('网络错误，请稍后重试')
        }
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>
