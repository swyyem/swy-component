import type { Ref } from 'vue'
export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Responsive = {
  span?: number
  offset?: number
  xs?: Responsive
  sm?: Responsive
  md?: Responsive
  lg?: Responsive
  xl?: Responsive
  isCol?: boolean
  colStyle?: object
}

export type GridConifgType = {
  breakPoint: Ref<BreakPoint>
  shouldHiddenIndex: Ref<number>
  cols: Ref<number>
}
