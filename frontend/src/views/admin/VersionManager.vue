<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  getProject,
  getVersions,
  createVersion,
  updateVersion,
  deleteVersion,
  uploadFile,
  deleteFile,
  getDownloadUrl,
} from '@/api/projects'
import Toast from '@/components/Toast.vue'
import type { Project, Version } from '@/types'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const projectId = Number(route.params.id)
const project = ref<Project | null>(null)
const versions = ref<Version[]>([])
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

// Version form (create + edit)
const showVersionForm = ref(false)
const editingVersionId = ref<number | null>(null)
const versionForm = ref({
  version: '',
  changelog_en: '',
  changelog_zh: '',
  platforms: [] as string[],
  released_at: Math.floor(Date.now() / 1000),
})

// Upload form
const showUploadForm = ref(false)
const uploadVersionId = ref<number | null>(null)
const uploadFileRef = ref<File | null>(null)
const uploadFileType = ref('lib_static')
const uploadPlatform = ref('')
const uploading = ref(false)

const allPlatforms = ['windows', 'linux', 'macos']

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    project.value = await getProject(projectId)
    versions.value = await getVersions(projectId)
  } catch {
    // error
  } finally {
    loading.value = false
  }
}

function openCreateVersion() {
  editingVersionId.value = null
  versionForm.value = {
    version: '',
    changelog_en: '',
    changelog_zh: '',
    platforms: [],
    released_at: Math.floor(Date.now() / 1000),
  }
  showVersionForm.value = true
}

function openEditVersion(ver: Version) {
  editingVersionId.value = ver.id
  versionForm.value = {
    version: ver.version,
    changelog_en: ver.changelog_en,
    changelog_zh: ver.changelog_zh,
    platforms: [...ver.platforms],
    released_at: ver.released_at,
  }
  showVersionForm.value = true
}

async function saveVersion() {
  try {
    if (editingVersionId.value) {
      await updateVersion(editingVersionId.value, versionForm.value)
      showToast('Version updated ✓', 'success')
    } else {
      await createVersion(projectId, versionForm.value)
      showToast('Version created ✓', 'success')
    }
    showVersionForm.value = false
    editingVersionId.value = null
    await loadData()
  } catch (e: any) {
    showToast(e?.message || 'Failed to save version')
  }
}

async function handleDeleteVersion(id: number) {
  if (!confirm('Delete this version?')) return
  try {
    await deleteVersion(id)
    showToast('Version deleted ✓', 'success')
    await loadData()
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete version')
  }
}

function openUpload(versionId: number) {
  uploadVersionId.value = versionId
  uploadFileRef.value = null
  uploadFileType.value = 'lib_static'
  uploadPlatform.value = ''
  showUploadForm.value = true
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  uploadFileRef.value = input.files?.[0] || null
}

async function handleUpload() {
  if (!uploadFileRef.value || !uploadVersionId.value) return
  uploading.value = true
  try {
    await uploadFile(
      uploadVersionId.value,
      uploadFileRef.value,
      uploadFileType.value,
      uploadPlatform.value || null
    )
    showUploadForm.value = false
    showToast('File uploaded ✓', 'success')
    await loadData()
  } catch (e: any) {
    showToast(e?.message || 'Upload failed')
  } finally {
    uploading.value = false
  }
}

async function handleDeleteFile(fileId: number) {
  if (!confirm('Delete this file?')) return
  try {
    await deleteFile(fileId)
    showToast('File deleted ✓', 'success')
    await loadData()
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete file')
  }
}

function togglePlatform(p: string) {
  const idx = versionForm.value.platforms.indexOf(p)
  if (idx >= 0) {
    versionForm.value.platforms.splice(idx, 1)
  } else {
    versionForm.value.platforms.push(p)
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString()
}

function getChangelog(v: Version): string {
  return locale.value === 'zh' ? v.changelog_zh : v.changelog_en
}
</script>

<template>
  <Toast v-if="toastMsg" :message="toastMsg" :type="toastType" @close="toastMsg = ''" />

  <div class="admin-page">
    <button class="back-link" @click="router.push({ name: 'admin-projects' })">
      {{ t('admin.backToProjects') }}
    </button>

    <div v-if="project" class="admin-header">
      <div class="project-title">
        <span class="icon">{{ project.icon }}</span>
        <h1>{{ project.name }}</h1>
      </div>
      <button class="btn btn-primary" @click="openCreateVersion">
        + {{ t('admin.createVersion') }}
      </button>
    </div>

    <!-- Version Form Modal (create + edit) -->
    <div
      v-if="showVersionForm"
      class="modal-overlay"
      @click.self="showVersionForm = false"
    >
      <div class="modal">
        <h2>
          {{
            editingVersionId
              ? t('admin.editProject')
              : t('admin.createVersion')
          }}
        </h2>
        <form @submit.prevent="saveVersion">
          <div class="field">
            <label>{{ t('admin.versionNumber') }}</label>
            <input
              v-model="versionForm.version"
              type="text"
              placeholder="1.0.0"
              required
              :disabled="!!editingVersionId"
            />
          </div>
          <div class="field">
            <label>{{ t('admin.changelogEn') }}</label>
            <textarea v-model="versionForm.changelog_en" rows="3"></textarea>
          </div>
          <div class="field">
            <label>{{ t('admin.changelogZh') }}</label>
            <textarea v-model="versionForm.changelog_zh" rows="3"></textarea>
          </div>
          <div class="field">
            <label>{{ t('projects.platforms') }}</label>
            <div class="platform-checks">
              <label
                v-for="p in allPlatforms"
                :key="p"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  :checked="versionForm.platforms.includes(p)"
                  @change="togglePlatform(p)"
                />
                {{ p }}
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button
              type="button"
              class="btn btn-ghost"
              @click="showVersionForm = false"
            >
              {{ t('admin.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary">
              {{ t('admin.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Upload File Modal -->
    <div
      v-if="showUploadForm"
      class="modal-overlay"
      @click.self="showUploadForm = false"
    >
      <div class="modal">
        <h2>{{ t('admin.uploadFiles') }}</h2>
        <form @submit.prevent="handleUpload">
          <div class="field">
            <label>{{ t('admin.selectFile') }}</label>
            <input type="file" @change="onFileChange" required />
          </div>
          <div class="field">
            <label>{{ t('admin.fileType') }}</label>
            <select v-model="uploadFileType">
              <option value="header">Header (.h)</option>
              <option value="lib_static">Static Library</option>
              <option value="lib_shared">Shared Library</option>
              <option value="doc">Documentation</option>
            </select>
          </div>
          <div class="field">
            <label>{{ t('admin.platform') }}</label>
            <select v-model="uploadPlatform">
              <option value="">Cross-platform</option>
              <option value="windows">Windows</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          <div class="form-actions">
            <button
              type="button"
              class="btn btn-ghost"
              @click="showUploadForm = false"
            >
              {{ t('admin.cancel') }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="uploading"
            >
              {{ uploading ? '...' : t('admin.upload') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Version List -->
    <div v-if="!loading" class="version-list">
      <div v-for="ver in versions" :key="ver.id" class="version-card">
        <div class="version-header">
          <div>
            <strong>v{{ ver.version }}</strong>
            <span class="date">{{ formatDate(ver.released_at) }}</span>
          </div>
          <div class="version-actions">
            <button class="btn btn-sm" @click="openUpload(ver.id)">
              {{ t('admin.uploadFiles') }}
            </button>
            <button class="btn btn-sm" @click="openEditVersion(ver)">
              {{ t('admin.editProject') }}
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="handleDeleteVersion(ver.id)"
            >
              Delete
            </button>
          </div>
        </div>

        <p class="changelog" v-if="getChangelog(ver)">
          {{ getChangelog(ver) }}
        </p>

        <div class="platforms" v-if="ver.platforms?.length">
          <span v-for="p in ver.platforms" :key="p" class="platform-badge">{{
            p
          }}</span>
        </div>

        <div class="files" v-if="ver.files?.length">
          <div v-for="f in ver.files" :key="f.id" class="file-row">
            <a :href="getDownloadUrl(f.id)" class="file-link">
              📦 {{ f.filename }}
              <span class="size">({{ formatSize(f.file_size) }})</span>
            </a>
            <button
              class="btn btn-sm btn-danger"
              @click="handleDeleteFile(f.id)"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div v-if="!versions.length" class="empty-state">
        <span class="empty-icon">📦</span>
        <p>No versions yet. Create the first release!</p>
        <button class="btn btn-primary" @click="openCreateVersion" style="margin-top: 1rem">
          + {{ t('admin.createVersion') }}
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

.back-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 0;
}

.back-link:hover {
  opacity: 0.8;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.project-title .icon {
  font-size: 2rem;
}

.project-title h1 {
  font-size: 2rem;
  font-weight: 700;
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

/* Version list */
.version-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.version-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.version-header strong {
  font-size: 1.1rem;
  color: var(--accent);
  margin-right: 0.8rem;
}

.date {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.version-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.changelog {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.platforms {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
}

.platform-badge {
  display: inline-block;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.files {
  margin-top: 0.8rem;
  border-top: 1px solid var(--border);
  padding-top: 0.8rem;
}

.file-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
}

.file-link {
  color: var(--accent);
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.file-link:hover {
  opacity: 0.8;
}

.size {
  color: var(--text-muted);
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
.field textarea,
.field select {
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
.field textarea:focus,
.field select:focus {
  border-color: var(--accent);
}

.field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.field input[type='file'] {
  padding: 0.5rem;
}

.platform-checks {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: auto;
  accent-color: var(--accent);
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

  .version-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .version-actions {
    width: 100%;
  }

  .file-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
}
</style>
