/**
 * Projects / Versions / Files API module.
 * Currently uses mock data. Switch to real API by uncommenting the fetch-based
 * implementations and removing the mock imports.
 */
import type { Project, Version, SDKFile } from '@/types'
import {
  mockGetProjects,
  mockGetProject,
  mockCreateProject,
  mockUpdateProject,
  mockDeleteProject,
  mockGetVersions,
  mockCreateVersion,
  mockUpdateVersion,
  mockDeleteVersion,
  mockUploadFile,
  mockDeleteFile,
} from './mock'

// ─── Projects (mock) ─────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  return mockGetProjects()
}

export async function getProject(id: number): Promise<Project> {
  return mockGetProject(id)
}

export async function createProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  return mockCreateProject(data)
}

export async function updateProject(
  id: number,
  data: Partial<Project>
): Promise<Project> {
  return mockUpdateProject(id, data)
}

export async function deleteProject(id: number): Promise<void> {
  return mockDeleteProject(id)
}

// ─── Versions (mock) ─────────────────────────────────────────────────────────

export async function getVersions(projectId: number): Promise<Version[]> {
  return mockGetVersions(projectId)
}

export async function createVersion(
  projectId: number,
  data: Omit<Version, 'id' | 'project_id' | 'files'>
): Promise<Version> {
  return mockCreateVersion(projectId, data)
}

export async function updateVersion(
  id: number,
  data: Partial<Omit<Version, 'id' | 'project_id' | 'files'>>
): Promise<Version> {
  return mockUpdateVersion(id, data)
}

export async function deleteVersion(id: number): Promise<void> {
  return mockDeleteVersion(id)
}

// ─── Files (mock) ────────────────────────────────────────────────────────────

export async function uploadFile(
  versionId: number,
  file: File,
  fileType: string,
  platform: string | null
): Promise<SDKFile> {
  return mockUploadFile(versionId, file, fileType, platform)
}

export async function deleteFile(fileId: number): Promise<void> {
  return mockDeleteFile(fileId)
}

export function getDownloadUrl(fileId: number): string {
  return `/api/v1/files/${fileId}/download`
}

// ─── Real implementations (uncomment when backend is ready) ──────────────────
// import { api } from './client'
//
// export async function getProjects(): Promise<Project[]> {
//   return api.get<Project[]>('/projects')
// }
// export async function getProject(id: number): Promise<Project> {
//   return api.get<Project>(`/projects/${id}`)
// }
// export async function createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
//   return api.post<Project>('/projects', data)
// }
// export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
//   return api.put<Project>(`/projects/${id}`, data)
// }
// export async function deleteProject(id: number): Promise<void> {
//   return api.delete(`/projects/${id}`)
// }
// export async function getVersions(projectId: number): Promise<Version[]> {
//   return api.get<Version[]>(`/projects/${projectId}/versions`)
// }
// export async function createVersion(projectId: number, data: Omit<Version, 'id' | 'project_id' | 'files'>): Promise<Version> {
//   return api.post<Version>(`/projects/${projectId}/versions`, data)
// }
// export async function uploadFile(versionId: number, file: File, fileType: string, platform: string | null): Promise<SDKFile> {
//   const formData = new FormData()
//   formData.append('file', file)
//   formData.append('file_type', fileType)
//   if (platform) formData.append('platform', platform)
//   return api.upload<SDKFile>(`/versions/${versionId}/files`, formData)
// }
// export async function deleteFile(fileId: number): Promise<void> {
//   return api.delete(`/files/${fileId}`)
// }
