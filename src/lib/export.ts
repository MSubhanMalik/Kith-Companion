import XLSX from 'xlsx-js-style'

const DARK = '2C2417'
const CREAM = 'F5F0E8'
const WHITE = 'FFFFFF'
const ALT_ROW = 'F8F6F2'
const BORDER_CLR = 'E0D8CC'
const MUTED = '9C8F80'
const GREEN = '2D8B5F'
const CORAL = 'D4735E'

const THIN_BORDER = { style: 'thin', color: { rgb: BORDER_CLR } }
const BORDERS = { top: THIN_BORDER, bottom: THIN_BORDER, left: THIN_BORDER, right: THIN_BORDER }

const HEADER_STYLE = {
  fill: { fgColor: { rgb: DARK } },
  font: { bold: true, sz: 10, color: { rgb: CREAM } },
  border: BORDERS,
  alignment: { horizontal: 'center', vertical: 'center' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dataStyle(row: number, opts?: { fontColor?: string; bold?: boolean }): any {
  return {
    fill: { fgColor: { rgb: row % 2 === 0 ? WHITE : ALT_ROW } },
    font: { sz: 10, color: { rgb: opts?.fontColor ?? DARK }, bold: opts?.bold ?? false },
    border: BORDERS,
    alignment: { vertical: 'center', wrapText: true },
  }
}

function setCell(ws: XLSX.WorkSheet, r: number, c: number, value: string | number, style: Record<string, unknown>) {
  const ref = XLSX.utils.encode_cell({ r, c })
  ws[ref] = { v: value, t: typeof value === 'number' ? 'n' : 's', s: style }
}

function setMergedTitle(ws: XLSX.WorkSheet, r: number, text: string, cols: number, style: Record<string, unknown>) {
  setCell(ws, r, 0, text, style)
  for (let c = 1; c < cols; c++) setCell(ws, r, c, '', style)
  if (!ws['!merges']) ws['!merges'] = []
  ws['!merges'].push({ s: { r, c: 0 }, e: { r, c: cols - 1 } })
}

const GOAL_COLORS: Record<string, string> = {
  'Freelancing': 'C4745C',
  'Startup': '7A9A6D',
  'LinkedIn': 'B08455',
}

export function exportWeeklySchedule() {
  const wb = XLSX.utils.book_new()
  const ws: XLSX.WorkSheet = {}

  const COLS = 6
  const COL_WIDTHS = [
    { wch: 7 },
    { wch: 10 },
    { wch: 13 },
    { wch: 42 },
    { wch: 28 },
    { wch: 10 },
  ]

  setMergedTitle(ws, 0, 'KITH — WEEKLY SCHEDULE', COLS, {
    font: { bold: true, sz: 16, color: { rgb: DARK } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left', vertical: 'center' },
  })

  setMergedTitle(ws, 1, 'Week of Jun 16 – 22, 2026  ·  3 Goals  ·  16 Tasks', COLS, {
    font: { sz: 9, color: { rgb: MUTED } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  const headers = ['Day', 'Time', 'Goal', 'Task', 'Output', 'Status']
  headers.forEach((h, c) => setCell(ws, 3, c, h, HEADER_STYLE))

  const tasks = [
    ['Mon', '5:30 PM', 'Freelancing', 'Send 5 cold DMs to agency founders', '5 personalized DMs sent', 'Done'],
    ['', '9:00 PM', 'Startup', 'Build auth endpoints', 'Auth register + login working', 'Done'],
    ['', '11:00 PM', 'LinkedIn', 'Write "How I automate outreach"', 'Post drafted and scheduled', 'Done'],
    ['Tue', '5:30 PM', 'Freelancing', 'Follow up 3 warm leads', '3 follow-up emails sent', 'Done'],
    ['', '9:00 PM', 'Startup', 'Build session management', 'Session mgmt tested', 'Done'],
    ['Wed', '5:30 PM', 'Freelancing', 'Send 5 cold DMs to CTOs', '5 personalized DMs sent', 'In Progress'],
    ['', '9:30 PM', 'Startup', 'Stripe checkout flow', 'Test payment on staging', '—'],
    ['', '11:30 PM', 'LinkedIn', 'Write "Why I build in public"', 'Post drafted', '—'],
    ['Thu', '5:30 PM', 'Freelancing', 'Prep discovery call deck', 'Deck with pricing ready', '—'],
    ['', '9:00 PM', 'Startup', 'Test payment flow end-to-end', 'All scenarios passing', '—'],
    ['Fri', '5:30 PM', 'Freelancing', 'Send SOW + follow up 2', 'SOW emailed, 2 follow-ups', '—'],
    ['', '11:00 PM', 'LinkedIn', 'Weekly wins recap', 'Post scheduled for Sat', '—'],
    ['Sat', '10:00 AM', 'Startup', 'Fix bugs + deploy to staging', 'MVP deployed', '—'],
  ]

  tasks.forEach((row, ri) => {
    const r = 4 + ri
    row.forEach((val, c) => {
      let style = dataStyle(ri)

      if (c === 0 && val) style = { ...style, font: { ...style.font, bold: true } }

      if (c === 2 && val) {
        const goalClr = GOAL_COLORS[val] ?? DARK
        style = { ...style, font: { sz: 10, color: { rgb: goalClr }, bold: true } }
      }

      if (c === 5) {
        if (val === 'Done') style = { ...style, font: { sz: 10, color: { rgb: GREEN }, bold: true } }
        if (val === 'In Progress') style = { ...style, font: { sz: 10, color: { rgb: 'B08455' }, bold: true } }
        style = { ...style, alignment: { horizontal: 'center', vertical: 'center' } }
      }

      setCell(ws, r, c, val, style)
    })
  })

  const summaryStart = 4 + tasks.length + 2

  setMergedTitle(ws, summaryStart, 'GOAL SUMMARY', COLS, {
    font: { bold: true, sz: 12, color: { rgb: DARK } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  const sumHeaders = ['Goal', 'Tasks Done', 'Total', 'Hours', 'Target', 'Status']
  sumHeaders.forEach((h, c) => setCell(ws, summaryStart + 1, c, h, HEADER_STYLE))

  const summaryRows = [
    ['Freelancing', 4, 7, '12h', '16h', 'On Track'],
    ['Startup', 2, 5, '6h', '10h', 'Behind'],
    ['LinkedIn', 1, 4, '2h', '6h', 'On Track'],
  ]

  summaryRows.forEach((row, ri) => {
    const r = summaryStart + 2 + ri
    row.forEach((val, c) => {
      let style = dataStyle(ri)

      if (c === 0) {
        const goalClr = GOAL_COLORS[String(val)] ?? DARK
        style = { ...style, font: { sz: 10, color: { rgb: goalClr }, bold: true } }
      }

      if (c === 5) {
        const clr = val === 'Behind' ? CORAL : GREEN
        style = { ...style, font: { sz: 10, color: { rgb: clr }, bold: true }, alignment: { horizontal: 'center', vertical: 'center' } }
      }

      if (c === 1 || c === 2) style = { ...style, alignment: { horizontal: 'center', vertical: 'center' } }

      setCell(ws, r, c, val, style)
    })
  })

  const range = { s: { r: 0, c: 0 }, e: { r: summaryStart + 4, c: COLS - 1 } }
  ws['!ref'] = XLSX.utils.encode_range(range)
  ws['!cols'] = COL_WIDTHS
  ws['!rows'] = [{ hpt: 32 }, { hpt: 18 }, { hpt: 8 }, { hpt: 22 }]

  XLSX.utils.book_append_sheet(wb, ws, 'Weekly Schedule')
  XLSX.writeFile(wb, 'Kith_Weekly_Schedule.xlsx')
}

export function exportGoalSchedule(goalName: string) {
  const wb = XLSX.utils.book_new()
  const ws: XLSX.WorkSheet = {}

  const COLS = 5
  const COLOR = GOAL_COLORS[goalName] ?? 'B08455'

  setMergedTitle(ws, 0, `KITH — ${goalName.toUpperCase()}`, COLS, {
    font: { bold: true, sz: 16, color: { rgb: DARK } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  setMergedTitle(ws, 1, 'Generated Jun 18, 2026  ·  3 Weeks  ·  18 Sessions', COLS, {
    font: { sz: 9, color: { rgb: MUTED } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  const headers = ['Week', 'Day', 'Topic', 'Details', 'Output']
  headers.forEach((h, c) => setCell(ws, 3, c, h, HEADER_STYLE))

  const plan = [
    [1, 'Mon', 'Intro + Overview', 'System architecture, project idea, Git', 'Setup environment'],
    [1, 'Tue', 'JavaScript Basics', 'Variables, arrays, objects, functions', 'Small exercises'],
    [1, 'Wed', 'Async + DOM', 'Async/await, promises, DOM basics', 'Manipulate DOM'],
    [1, 'Thu', 'DOM Deep Dive', 'Events, event listeners, manipulation', 'Interactive page'],
    [1, 'Fri', 'HTTP + Server', 'API creation, request/response', 'Node CRUD'],
    [1, 'Sat', 'API Practice', 'Fetch API + Postman', 'Connect to API'],
    [2, 'Mon', 'React Basics', 'Components, JSX', 'Simple UI'],
    [2, 'Tue', 'State + Hooks', 'useState, useEffect', 'Counter app'],
    [2, 'Wed', 'Forms + Events', 'Form handling', 'Input system'],
    [2, 'Thu', 'API Integration', 'Fetch in React', 'Connect backend'],
    [2, 'Fri', 'Routing', 'Pages navigation', 'Multi-page app'],
    [2, 'Sat', 'Mini Project', 'Dashboard UI', 'Student dashboard'],
    [3, 'Mon', 'PostgreSQL', 'Tables, relations', 'DB design'],
    [3, 'Tue', 'Schema Design', 'Entities', 'User/request tables'],
    [3, 'Wed', 'Backend Structure', 'Routes/controllers/services', 'Restructure API'],
    [3, 'Thu', 'CRUD with DB', 'SQL queries', 'Full backend CRUD'],
    [3, 'Fri', 'Authentication', 'JWT', 'Login system'],
    [3, 'Sat', 'Full Integration', 'React + Node + DB', 'Full stack system'],
  ]

  let lastWeek = 0
  plan.forEach((row, ri) => {
    const r = 4 + ri
    const currentWeek = row[0] as number
    const isNewWeek = currentWeek !== lastWeek
    lastWeek = currentWeek

    row.forEach((val, c) => {
      let style = dataStyle(ri)

      if (c === 0) {
        style = {
          ...style,
          font: { sz: 11, color: { rgb: COLOR }, bold: true },
          alignment: { horizontal: 'center', vertical: 'center' },
        }
        if (!isNewWeek) val = ''
      }

      if (c === 2) style = { ...style, font: { sz: 10, color: { rgb: DARK }, bold: true } }

      if (c === 4) style = { ...style, font: { sz: 10, color: { rgb: COLOR } } }

      if (isNewWeek && ri > 0) {
        const thickTop = { style: 'medium', color: { rgb: COLOR } }
        style = { ...style, border: { ...BORDERS, top: thickTop } }
      }

      setCell(ws, r, c, val, style)
    })
  })

  const range = { s: { r: 0, c: 0 }, e: { r: 4 + plan.length - 1, c: COLS - 1 } }
  ws['!ref'] = XLSX.utils.encode_range(range)
  ws['!cols'] = [{ wch: 6 }, { wch: 7 }, { wch: 24 }, { wch: 36 }, { wch: 22 }]
  ws['!rows'] = [{ hpt: 32 }, { hpt: 18 }, { hpt: 8 }, { hpt: 22 }]

  const safeName = goalName.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 25)
  XLSX.utils.book_append_sheet(wb, ws, safeName || 'Goal')
  XLSX.writeFile(wb, `Kith_${safeName.replace(/ /g, '_')}.xlsx`)
}
