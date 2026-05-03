/**
 * Mock data layer — simulates the REST API backend.
 * Replace with real API calls once the C backend is ready.
 */
import type { Project, Version, SDKFile, LoginResponse } from '@/types'

let nextProjectId = 4
let nextVersionId = 4
let nextFileId = 4

const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Xylem',
    description_en:
      'Cross-platform C11 library for networking, data structures, and async I/O. The vascular system of your application.',
    description_zh:
      '跨平台 C11 库，提供网络、数据结构和异步 I/O。应用程序的维管系统。',
    icon: '🌱',
    created_at: 1700000000,
    updated_at: 1700000000,
  },
  {
    id: 2,
    name: 'Stolon',
    description_en:
      'Spreading connections. Lightweight protocols and communication primitives that propagate effortlessly.',
    description_zh: '蔓延连接。轻量级协议与通信原语，无缝传播。',
    icon: '🔗',
    created_at: 1700100000,
    updated_at: 1700100000,
  },
  {
    id: 3,
    name: 'Orbiter',
    description_en:
      'Reaching beyond. Tools and utilities that extend your reach into new platforms and environments.',
    description_zh: '超越边界。将你的能力延伸到新的平台与环境。',
    icon: '🌍',
    created_at: 1700200000,
    updated_at: 1700200000,
  },
]

const mockVersions: Version[] = [
  {
    id: 1,
    project_id: 1,
    version: '0.3.0',
    changelog_en: 'Added async I/O support, improved memory allocator.',
    changelog_zh: '新增异步 I/O 支持，改进内存分配器。',
    platforms: ['windows', 'linux', 'macos'],
    released_at: 1700000000,
    files: [
      {
        id: 1,
        version_id: 1,
        filename: 'xylem-0.3.0-win64.zip',
        file_type: 'lib_static',
        platform: 'windows',
        file_path: '/data/sdk/1/0.3.0/lib/win64/xylem-0.3.0-win64.zip',
        file_size: 2048000,
        uploaded_at: 1700000000,
      },
      {
        id: 2,
        version_id: 1,
        filename: 'xylem-0.3.0-linux64.tar.gz',
        file_type: 'lib_static',
        platform: 'linux',
        file_path: '/data/sdk/1/0.3.0/lib/linux64/xylem-0.3.0-linux64.tar.gz',
        file_size: 1536000,
        uploaded_at: 1700000000,
      },
    ],
  },
  {
    id: 2,
    project_id: 1,
    version: '0.2.1',
    changelog_en: 'Bug fixes for socket handling on Windows.',
    changelog_zh: '修复 Windows 上的 socket 处理 bug。',
    platforms: ['windows', 'linux'],
    released_at: 1699500000,
  },
  {
    id: 3,
    project_id: 2,
    version: '0.1.0',
    changelog_en: 'Initial release with basic protocol support.',
    changelog_zh: '初始版本，支持基础协议。',
    platforms: ['linux', 'macos'],
    released_at: 1700100000,
  },
]

const mockFiles: SDKFile[] = [
  ...mockVersions.flatMap((v) => v.files || []),
]

/** Simulate network delay */
function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function mockLogin(
  username: string,
  password: string
): Promise<LoginResponse> {
  await delay()
  if (username === 'admin' && password === 'admin') {
    return {
      token: 'mock-token-' + Date.now(),
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    }
  }
  throw { error: 'unauthorized', message: 'Invalid credentials' }
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function mockGetProjects(): Promise<Project[]> {
  await delay()
  return [...mockProjects]
}

export async function mockGetProject(id: number): Promise<Project> {
  await delay()
  const p = mockProjects.find((p) => p.id === id)
  if (!p) throw { error: 'not_found', message: 'Project not found' }
  return { ...p }
}

export async function mockCreateProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  await delay()
  const now = Math.floor(Date.now() / 1000)
  const project: Project = {
    ...data,
    id: nextProjectId++,
    created_at: now,
    updated_at: now,
  }
  mockProjects.push(project)
  return { ...project }
}

export async function mockUpdateProject(
  id: number,
  data: Partial<Project>
): Promise<Project> {
  await delay()
  const idx = mockProjects.findIndex((p) => p.id === id)
  if (idx === -1) throw { error: 'not_found', message: 'Project not found' }
  const updated = {
    ...mockProjects[idx],
    ...data,
    updated_at: Math.floor(Date.now() / 1000),
  }
  mockProjects[idx] = updated
  return { ...updated }
}

export async function mockDeleteProject(id: number): Promise<void> {
  await delay()
  const idx = mockProjects.findIndex((p) => p.id === id)
  if (idx === -1) throw { error: 'not_found', message: 'Project not found' }
  mockProjects.splice(idx, 1)
  // Also remove associated versions and files
  const versionIds = mockVersions
    .filter((v) => v.project_id === id)
    .map((v) => v.id)
  for (let i = mockVersions.length - 1; i >= 0; i--) {
    if (mockVersions[i].project_id === id) mockVersions.splice(i, 1)
  }
  for (let i = mockFiles.length - 1; i >= 0; i--) {
    if (versionIds.includes(mockFiles[i].version_id)) mockFiles.splice(i, 1)
  }
}

// ─── Versions ────────────────────────────────────────────────────────────────

export async function mockGetVersions(projectId: number): Promise<Version[]> {
  await delay()
  return mockVersions
    .filter((v) => v.project_id === projectId)
    .map((v) => ({
      ...v,
      files: mockFiles.filter((f) => f.version_id === v.id),
    }))
}

export async function mockCreateVersion(
  projectId: number,
  data: Omit<Version, 'id' | 'project_id' | 'files'>
): Promise<Version> {
  await delay()
  const version: Version = {
    ...data,
    id: nextVersionId++,
    project_id: projectId,
    files: [],
  }
  mockVersions.push(version)
  return { ...version }
}

export async function mockUpdateVersion(
  id: number,
  data: Partial<Omit<Version, 'id' | 'project_id' | 'files'>>
): Promise<Version> {
  await delay()
  const idx = mockVersions.findIndex((v) => v.id === id)
  if (idx === -1) throw { error: 'not_found', message: 'Version not found' }
  const updated = { ...mockVersions[idx], ...data }
  mockVersions[idx] = updated
  return {
    ...updated,
    files: mockFiles.filter((f) => f.version_id === id),
  }
}

export async function mockDeleteVersion(id: number): Promise<void> {
  await delay()
  const idx = mockVersions.findIndex((v) => v.id === id)
  if (idx === -1) throw { error: 'not_found', message: 'Version not found' }
  mockVersions.splice(idx, 1)
  for (let i = mockFiles.length - 1; i >= 0; i--) {
    if (mockFiles[i].version_id === id) mockFiles.splice(i, 1)
  }
}

// ─── Files ───────────────────────────────────────────────────────────────────

export async function mockUploadFile(
  versionId: number,
  file: File,
  fileType: string,
  platform: string | null
): Promise<SDKFile> {
  await delay(500)
  const sdkFile: SDKFile = {
    id: nextFileId++,
    version_id: versionId,
    filename: file.name,
    file_type: fileType as SDKFile['file_type'],
    platform,
    file_path: `/data/sdk/mock/${versionId}/${file.name}`,
    file_size: file.size,
    uploaded_at: Math.floor(Date.now() / 1000),
  }
  mockFiles.push(sdkFile)
  // Also add to the version's files array
  const ver = mockVersions.find((v) => v.id === versionId)
  if (ver) {
    if (!ver.files) ver.files = []
    ver.files.push(sdkFile)
  }
  return { ...sdkFile }
}

export async function mockDeleteFile(fileId: number): Promise<void> {
  await delay()
  const idx = mockFiles.findIndex((f) => f.id === fileId)
  if (idx === -1) throw { error: 'not_found', message: 'File not found' }
  mockFiles.splice(idx, 1)
}
