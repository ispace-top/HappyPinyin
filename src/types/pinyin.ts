export type PinyinCategory = 'initial' | 'final' | 'wholeSyllable'
export type FinalSubCategory = 'single' | 'compound'

export interface PinyinElement {
  id: string
  text: string
  category: PinyinCategory
  subCategory?: FinalSubCategory
  pronunciation: string
  description?: string
  group?: string
  canBeMedial?: boolean
  emoji?: string
}

export interface SyllableComponent {
  syllable: string
  initial: string
  medial: string | null
  final: string
  toneVariants: [string, string, string, string]
}

export type BuilderStep = 'initial' | 'final' | 'tone' | 'result'

export interface BuilderState {
  step: BuilderStep
  selectedInitial: string | null
  selectedMedial: string | null
  selectedFinal: string | null
  selectedTone: number | null
  medialChosen: boolean
}

export type BuilderAction =
  | { type: 'SELECT_INITIAL'; initial: string }
  | { type: 'SELECT_MEDIAL'; medial: string | null }
  | { type: 'SELECT_FINAL'; final: string }
  | { type: 'SELECT_TONE'; tone: number }
  | { type: 'GO_BACK' }
  | { type: 'RESET' }

export interface ToneOption {
  value: number
  label: string
  symbol: string
}
