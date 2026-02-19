const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export const api = {
  get: (endpoint: string) => fetchAPI(endpoint),
  
  post: (endpoint: string, data: unknown) => fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint: string, data: unknown) => fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint: string) => fetchAPI(endpoint, {
    method: 'DELETE',
  }),
}

export const endpoints = {
  disruptions: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      return `/api/disruptions${query}`
    },
    get: (id: string) => `/api/disruptions/${id}`,
    simulate: (id: string) => `/api/disruptions/simulate`,
  },
  
  risk: {
    heatmap: '/api/risk/heatmap',
    supplier: (id: string) => `/api/risk/suppliers/${id}`,
  },
  
  simulations: {
    list: '/api/simulations',
    get: (id: string) => `/api/simulations/${id}`,
    select: (id: string) => `/api/simulations/${id}/select`,
  },
  
  suppliers: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      return `/api/suppliers${query}`
    },
    get: (id: string) => `/api/suppliers/${id}`,
    backups: (id: string) => `/api/suppliers/${id}/backups`,
    activateBackup: (id: string) => `/api/suppliers/${id}/activate-backup`,
  },
  
  negotiations: {
    start: '/api/negotiations',
    get: (id: string) => `/api/negotiations/${id}`,
  },
  
  compliance: {
    rules: '/api/compliance/rules',
    log: '/api/compliance/log',
  },
  
  learning: {
    accuracy: '/api/learning/accuracy',
    patterns: '/api/learning/patterns',
    trustMovements: '/api/learning/trust-movements',
  },
  
  incidents: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : ''
      return `/api/incidents${query}`
    },
    get: (id: string) => `/api/incidents/${id}`,
  },
  
  health: '/api/health',
  agentStatus: '/api/agent-status',
}
