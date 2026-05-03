export interface Project {
  id: number
  name: string
  description_en: string
  description_zh: string
  icon: string
  created_at: number
  updated_at: number
}

export interface Version {
  id: number
  project_id: number
  version: string
  changelog_en: string
  changelog_zh: string
  platforms: string[]
  released_at: number
  files?: SDKFile[]
}

export interface SDKFile {
  id: number
  version_id: number
  filename: string
  file_type: 'header' | 'lib_static' | 'lib_shared' | 'doc'
  platform: string | null
  file_path: string
  file_size: number
  uploaded_at: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expires_at: number
}

export interface ApiError {
  error: string
  message: string
}
