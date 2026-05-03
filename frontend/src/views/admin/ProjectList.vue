<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/api/projects'
import Toast from '@/components/Toast.vue'
import type { Project } from '@/types'

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const projects = ref<Project[]>([])
const loading = ref(true)

// Toast
const toastMsg = ref('')
const toastType = ref<'error' | 'success'>('error')

function showToast(msg: string, type: 'error' | 'success' = 'error') {
  toastMsg.value = ''
  setTimeout(() => {
    toastMsg.value = msg
    toastType.value = type
  }, 10)
}

// Form state
const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = ref({
  name: '',
  icon: '',
  description_en: '',
  description_zh: '',
})

onMounted(async () => {
  await loadProjects()
})

async function loadProjects() {
  loading.value = true
  try {
    projects.value = await getProjects()
  } catch {
    // error
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', icon: '', description_en: '', description_zh: '' }
  showForm.value = true
}

function openEdit(p: Project) {
  editingId.value = p.id
  form.value = {
    name: p.name,
    icon: p.icon,
    description_en: p.description_en,
    description_zh: p.description_zh,
  }
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

async function saveProject() {
  try {
    if (editingId.value) {
      await updateProject(editingId.value, form.value)
      showToast(t('admin.editProject') + ' ✓', 'success')
    } else {
      await createProject(form.value)
      showToast(t('admin.createProject') + ' ✓', 'success')
    }
    showForm.value = false
    editingId.value = null
    await loadProjects()
  } catch (e: any) {
    showToast(e?.message || 'Save failed')
  }
}

async function handleDelete(id: number) {
  if (!confirm(t('admin.confirmDelete'))) return
  try {
    await deleteProject(id)
    showToast(t('admin.deleteProject') + ' ✓', 'success')
    await loadProjects()
  } catch (e: any) {
    showToast(e?.message || 'Delete failed')
  }
}

function goToVersions(projectId: number) {
  router.push({ name: 'admin-versions', params: { id: projectId } })
}

function handleLogout() {
  auth.clearToken()
  router.push({ name: 'admin-login' })
}

function getDesc(p: Project): string {
  return locale.value === 'zh' ? p.description_zh : p.description_en
}
</script>

<template>
  <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" @close="toastMsg = ''" />

  <div class="admin-page">
    <div class="admin-header">
      <h1>{{ t('nav.admin') }}</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openCreate">
          + {{ t('admin.createProject') }}
        </button>
        <button class="btn btn-ghost" @click="handleLogout">
          {{ t('admin.logout') }}
        </button>
      </div>
    </div>

    <!-- Project Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="cancelForm">
      <div class="modal">
        <h2>
          {{ editingId ? t('admin.editProject') : t('admin.createProject') }}
        </h2>
        <form @submit.prevent="saveProject">
          <div class="field">
            <label>{{ t('admin.projectName') }}</label>
            <input v-model="form.name" type="text" required />
          </div>
          <div class="field">
            <label>{{ t('admin.icon') }}</label>
            <input v-model="form.icon" type="text" placeholder="🌱" />
          </div>
          <div class="field">
            <label>{{ t('admin.descriptionEn') }}</label>
            <textarea v-model="form.description_en" rows="3"></textarea>
          </div>
          <div class="field">
            <label>{{ t('admin.descriptionZh') }}</label>
            <textarea v-model="form.description_zh" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" @click="cancelForm">
              {{ t('admin.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary">
              {{ t('admin.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Project List -->
    <div v-if="!loading" class="project-list">
      <div v-for="p in projects" :key="p.id" class="project-row">
        <div class="project-info">
          <span class="project-icon">{{ p.icon }}</span>
          <div>
            <strong>{{ p.name }}</strong>
            <p>{{ getDesc(p) }}</p>
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-sm" @click="goToVersions(p.id)">
            {{ t('admin.manageVersions') }}
          </button>
          <button class="btn btn-sm" @click="openEdit(p)">
            {{ t('admin.editProject') }}
          </button>
          <button class="btn btn-sm btn-danger" @click="handleDelete(p.id)">
            {{ t('admin.deleteProject') }}
          </button>
        </div>
      </div>
      <div v-if="!projects.length" class="empty-state">
        <span class="empty-icon">🌱</span>
        <p>No projects yet. Create your first one!</p>
        <button class="btn btn-primary" @click="openCreate" style="margin-top: 1rem">
          + {{ t('admin.createProject') }}
        </button>
      </div>
    </div>
    <p v-else class="loading">Loading...</p>
  </div>
</template>

<style scoped>
.admin-page {
  padding: 6rem 3rem 4rem;
  max-width: 1000px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

/* Buttons */
.btn {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
  color: #000;
  border: none;
}

.btn-primary:hover {
  box-shadow: 0 0 20px var(--accent-glow);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

.btn-sm {
  padding: 0.35rem 0.8rem;
  font-size: 0.8rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.btn-sm:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-danger {
  color: var(--danger);
}

.btn-danger:hover {
  border-color: var(--danger);
  background: var(--danger);
  color: #fff;
}

/* Project list */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  transition: border-color 0.2s;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-row:hover {
  border-color: var(--accent);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.project-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.project-info strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.project-info p {
  color: var(--text-muted);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.8rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 2rem;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: var(--input-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--accent);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.loading {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 640px) {
  .admin-page {
    padding: 6rem 1.5rem 3rem;
  }

  .project-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-actions {
    width: 100%;
  }

  .project-info p {
    max-width: 100%;
    white-space: normal;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
