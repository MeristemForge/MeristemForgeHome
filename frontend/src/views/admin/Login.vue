<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/api/auth'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await login({
      username: username.value,
      password: password.value,
    })
    auth.setToken(res.token)
    router.push({ name: 'admin-projects' })
  } catch (e: any) {
    error.value = e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>{{ t('admin.login') }}</h1>
      <div class="field">
        <label for="username">{{ t('admin.username') }}</label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
          required
        />
      </div>
      <div class="field">
        <label for="password">{{ t('admin.password') }}</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? '...' : t('admin.submit') }}
      </button>
      <p class="hint">Mock credentials: admin / admin</p>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-form {
  width: 100%;
  max-width: 380px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2.5rem;
}

.login-form h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.field {
  margin-bottom: 1.2rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
}

.field input {
  width: 100%;
  padding: 0.7rem 1rem;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.3s;
}

.field input:focus {
  border-color: var(--accent);
}

.error {
  color: var(--danger);
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0 20px var(--accent-glow);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  margin-top: 1.2rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
