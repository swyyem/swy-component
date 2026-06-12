import dayjs from 'dayjs'
import type { DateType } from '../datePicker.data'

export const partMap: Record<string, DateType> = {
  year: 'year',
  month: 'month',
  day: 'day',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
}

export function getPartRange(part: DateType): [number, number] {
  const map: Record<DateType, [number, number]> = {
    year: [0, 4],
    month: [5, 7],
    day: [8, 10],
    hour: [11, 13],
    minute: [14, 16],
    second: [17, 19],
  }
  return map[part]
}

export function getDynamicPartRange(format: string, part: DateType): [number, number] | null {
  // 支持的分段
  const partTokenMap: Record<DateType, string> = {
    year: 'Y+',
    month: 'M+',
    day: 'D+',
    hour: 'H+',
    minute: 'm+',
    second: 's+',
  }
  const token = partTokenMap[part]
  const reg = new RegExp(token)
  const match = reg.exec(format)
  if (!match) return null
  const start = match.index
  const end = start + match[0].length
  return [start, end]
}

export function formatByType(date: dayjs.Dayjs, type: string) {
  switch (type) {
    case 'date':
    case 'dates':
    case 'week':
    case 'daterange':
      return date.format('YYYY-MM-DD')
    case 'datetime':
    case 'datetimerange':
      return date.format('YYYY-MM-DD HH:mm:ss')
    case 'year':
    case 'years':
    case 'yearrange':
      return date.format('YYYY')
    case 'month':
    case 'months':
    case 'monthrange':
      return date.format('YYYY-MM')
    default:
      return date.format('YYYY-MM-DD')
  }
}

export function updateParts(parts: any, val: string) {
  if (!val) return
  const date = dayjs(val)
  parts.year = date.format('YYYY')
  parts.month = date.format('MM')
  parts.day = date.format('DD')
  parts.hour = date.format('HH')
  parts.minute = date.format('mm')
  parts.second = date.format('ss')
}

export const typeFormatMap: Record<string, string> = {
  year: 'YYYY',
  years: 'YYYY',
  yearrange: 'YYYY',
  month: 'YYYY-MM',
  months: 'YYYY-MM',
  monthrange: 'YYYY-MM',
  date: 'YYYY-MM-DD',
  dates: 'YYYY-MM-DD',
  week: 'YYYY-MM-DD',
  daterange: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  datetimerange: 'YYYY-MM-DD HH:mm:ss',
}

export const ranges = ['yearrange', 'monthrange', 'daterange', 'datetimerange']
