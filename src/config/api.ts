export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    google: '/auth/google',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  goals: {
    list: '/goals',
    create: '/goals',
    update: (id: number) => `/goals/${id}`,
    delete: (id: number) => `/goals/${id}`,
    reorder: '/goals/reorder',
  },
  tasks: {
    list: (goalId: number) => `/goals/${goalId}/tasks`,
    create: (goalId: number) => `/goals/${goalId}/tasks`,
    update: (goalId: number, taskId: number) => `/goals/${goalId}/tasks/${taskId}`,
    delete: (goalId: number, taskId: number) => `/goals/${goalId}/tasks/${taskId}`,
  },
  schedule: {
    week: (weekOf: string) => `/schedule/week/${weekOf}`,
    generate: '/schedule/generate',
    lock: (weekOf: string) => `/schedule/lock/${weekOf}`,
    reschedule: (weekOf: string) => `/schedule/reschedule/${weekOf}`,
    moveBlock: (blockId: number) => `/schedule/block/${blockId}/move`,
    lifeBlocks: '/schedule/life-blocks',
    deleteLifeBlock: (id: number) => `/schedule/life-blocks/${id}`,
  },
  today: {
    get: '/today',
    complete: (blockId: number) => `/today/complete/${blockId}`,
    closeDay: '/today/close-day',
  },
  chat: {
    send: '/chat/send',
    history: '/chat/history',
  },
  export: {
    week: (weekOf: string) => `/export/week/${weekOf}`,
    goal: (goalId: number) => `/export/goal/${goalId}`,
  },
}
