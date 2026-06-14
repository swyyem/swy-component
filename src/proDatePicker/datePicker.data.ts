import type { DatePickerProps } from 'element-plus'

export type DateType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

export type ProDatePickerProps = Partial<DatePickerProps> & {
  hasIcon?: boolean
  showCalendarIcon?: boolean
  defaultValue?: Date | string | number | [Date | string | number, Date | string | number]
}
