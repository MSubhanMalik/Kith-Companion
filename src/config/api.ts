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
    breakdown: (id: number) => `/goals/${id}/breakdown`,
  },
  tasks: {
    list: (goalId: number) => `/goals/${goalId}/tasks`,
    create: (goalId: number) => `/goals/${goalId}/tasks`,
    update: (goalId: number, taskId: number) => `/goals/${goalId}/tasks/${taskId}`,
    delete: (goalId: number, taskId: number) => `/goals/${goalId}/tasks/${taskId}`,
    reorder: (goalId: number) => `/goals/${goalId}/tasks/reorder`,
  },
  notes: {
    list: (goalId: number) => `/goals/${goalId}/notes`,
    create: (goalId: number) => `/goals/${goalId}/notes`,
    update: (goalId: number, noteId: number) => `/goals/${goalId}/notes/${noteId}`,
    delete: (goalId: number, noteId: number) => `/goals/${goalId}/notes/${noteId}`,
  },
  schedule: {
    week: (weekOf: string) => `/schedule/week/${weekOf}`,
    weekSummary: (weekOf: string) => `/schedule/week/${weekOf}/summary`,
    generate: '/schedule/generate',
    lock: (weekOf: string) => `/schedule/lock/${weekOf}`,
    reschedule: (weekOf: string) => `/schedule/reschedule/${weekOf}`,
    moveBlock: (blockId: number) => `/schedule/block/${blockId}/move`,
    lifeBlocks: '/schedule/life-blocks',
    updateLifeBlock: (id: number) => `/schedule/life-blocks/${id}`,
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
    nudge: '/chat/nudge',
  },
  export: {
    week: (weekOf: string) => `/export/week/${weekOf}`,
    goal: (goalId: number) => `/export/goal/${goalId}`,
  },
}
