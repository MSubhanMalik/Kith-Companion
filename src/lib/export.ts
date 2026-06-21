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

function formatTime12(t: string): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

interface ExportBlock {
  day: string
  label: string
  time: { start: string; end: string }
  goalId: number | null
  type: string
  status: string
}

interface ExportGoal {
  id: number | string
  label: string
  colorId: string
  weeklyHours: number
}

export function exportWeeklySchedule(blocks?: ExportBlock[], goals?: ExportGoal[], weekLabel?: string) {
  const wb = XLSX.utils.book_new()
  const ws: XLSX.WorkSheet = {}

  const COLS = 6
  const COL_WIDTHS = [
    { wch: 7 }, { wch: 10 }, { wch: 13 }, { wch: 42 }, { wch: 28 }, { wch: 10 },
  ]

  const title = weekLabel || 'Weekly Schedule'

  setMergedTitle(ws, 0, 'KITH — WEEKLY SCHEDULE', COLS, {
    font: { bold: true, sz: 16, color: { rgb: DARK } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left', vertical: 'center' },
  })

  const taskCount = blocks?.filter(b => b.type !== 'LIFE_BLOCK').length || 0
  const goalCount = goals?.length || 0
  setMergedTitle(ws, 1, `${title}  ·  ${goalCount} Goals  ·  ${taskCount} Tasks`, COLS, {
    font: { sz: 9, color: { rgb: MUTED } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  const headers = ['Day', 'Time', 'Goal', 'Task', 'Output', 'Status']
  headers.forEach((h, c) => setCell(ws, 3, c, h, HEADER_STYLE))

  const sortedBlocks = [...(blocks || [])].sort((a, b) => {
    const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
    if (dayDiff !== 0) return dayDiff
    return (a.time?.start || '').localeCompare(b.time?.start || '')
  })

  let lastDay = ''
  sortedBlocks.forEach((block, ri) => {
    const r = 4 + ri
    const goal = goals?.find(g => Number(g.id) === block.goalId)
    const goalName = goal?.label || (block.type === 'LIFE_BLOCK' ? '' : '')
    const showDay = block.day !== lastDay
    lastDay = block.day

    const row = [
      showDay ? block.day : '',
      formatTime12(block.time?.start || ''),
      goalName,
      block.label,
      '',
      block.status === 'COMPLETED' ? 'Done' : block.status === 'SCHEDULED' ? '—' : block.status,
    ]

    row.forEach((val, c) => {
      let style = dataStyle(ri)
      if (c === 0 && val) style = { ...style, font: { ...style.font, bold: true } }
      if (c === 2 && val) style = { ...style, font: { sz: 10, color: { rgb: DARK }, bold: true } }
      if (c === 5) {
        if (val === 'Done') style = { ...style, font: { sz: 10, color: { rgb: GREEN }, bold: true } }
        style = { ...style, alignment: { horizontal: 'center', vertical: 'center' } }
      }
      setCell(ws, r, c, val, style)
    })
  })

  const totalRows = sortedBlocks.length
  const range = { s: { r: 0, c: 0 }, e: { r: 4 + totalRows, c: COLS - 1 } }
  ws['!ref'] = XLSX.utils.encode_range(range)
  ws['!cols'] = COL_WIDTHS
  ws['!rows'] = [{ hpt: 32 }, { hpt: 18 }, { hpt: 8 }, { hpt: 22 }]

  XLSX.utils.book_append_sheet(wb, ws, 'Weekly Schedule')
  XLSX.writeFile(wb, 'Kith_Weekly_Schedule.xlsx')
}

interface ExportTask {
  text: string
  description: string
  output: string
  day: string
  done: boolean
  weekNumber?: number | null
  estimatedMinutes?: number
}

export function exportGoalSchedule(goalName: string, tasks?: ExportTask[], goalColor?: string) {
  const wb = XLSX.utils.book_new()
  const ws: XLSX.WorkSheet = {}

  const COLS = 6
  const COLOR = goalColor?.replace('#', '') || 'B08455'

  setMergedTitle(ws, 0, `KITH — ${goalName.toUpperCase()}`, COLS, {
    font: { bold: true, sz: 16, color: { rgb: DARK } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const weekCount = new Set((tasks || []).map(t => t.weekNumber || 1)).size
  setMergedTitle(ws, 1, `Generated ${dateStr}  ·  ${weekCount} Weeks  ·  ${tasks?.length || 0} Tasks`, COLS, {
    font: { sz: 9, color: { rgb: MUTED } },
    fill: { fgColor: { rgb: CREAM } },
    alignment: { horizontal: 'left' },
  })

  const taskList = [...(tasks || [])].sort((a, b) => {
    const wDiff = (a.weekNumber || 1) - (b.weekNumber || 1)
    if (wDiff !== 0) return wDiff
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return dayOrder.indexOf(a.day || '') - dayOrder.indexOf(b.day || '')
  })

  let row = 3
  let lastWeek = 0

  for (const task of taskList) {
    const wk = task.weekNumber || 1

    if (wk !== lastWeek) {
      lastWeek = wk
      const doneCount = taskList.filter(t => (t.weekNumber || 1) === wk && t.done).length
      const totalCount = taskList.filter(t => (t.weekNumber || 1) === wk).length

      setMergedTitle(ws, row, `WEEK ${wk}    ${doneCount}/${totalCount} done`, COLS, {
        font: { bold: true, sz: 12, color: { rgb: WHITE } },
        fill: { fgColor: { rgb: COLOR } },
        alignment: { horizontal: 'left', vertical: 'center' },
      })
      row++

      const headers = ['Day', 'Task', 'Details', 'Output', 'Time', 'Status']
      headers.forEach((h, c) => setCell(ws, row, c, h, HEADER_STYLE))
      row++
    }

    const rowData = [
      task.day || '',
      task.text,
      task.description || '',
      task.output || '',
      task.estimatedMinutes ? `${task.estimatedMinutes}m` : '',
      task.done ? 'Done' : '—',
    ]

    const ri = row - 5
    rowData.forEach((val, c) => {
      let style = dataStyle(ri)
      if (c === 0) style = { ...style, font: { ...style.font, bold: true } }
      if (c === 1) style = { ...style, font: { sz: 10, color: { rgb: DARK }, bold: true } }
      if (c === 3) style = { ...style, font: { sz: 10, color: { rgb: COLOR } } }
      if (c === 5) {
        if (val === 'Done') style = { ...style, font: { sz: 10, color: { rgb: GREEN }, bold: true } }
        style = { ...style, alignment: { horizontal: 'center', vertical: 'center' } }
      }
      setCell(ws, row, c, val, style)
    })
    row++
  }

  const range = { s: { r: 0, c: 0 }, e: { r: row - 1, c: COLS - 1 } }
  ws['!ref'] = XLSX.utils.encode_range(range)
  ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 36 }, { wch: 22 }, { wch: 7 }, { wch: 8 }]
  ws['!rows'] = [{ hpt: 32 }, { hpt: 18 }]

  const safeName = goalName.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 25)
  XLSX.utils.book_append_sheet(wb, ws, safeName || 'Goal')
  XLSX.writeFile(wb, `Kith_${safeName.replace(/ /g, '_')}.xlsx`)
}
