import { reactive, computed } from 'vue'
import type { BuilderState, BuilderAction } from '@/types/pinyin'
import { getAvailableMedials, getAvailableFinals, getResultSyllable } from '@/utils/pinyinFilter'
import { syllableCombinations } from '@/data/syllableCombinations'
import { getSyllableInfo } from '@/utils/syllableChars'

const initialState: BuilderState = {
  step: 'initial',
  selectedInitial: null,
  selectedMedial: null,
  selectedFinal: null,
  selectedTone: null,
  medialChosen: false,
}

const stepOrder = ['initial', 'medial', 'final', 'tone', 'result'] as const

export function useBuilder() {
  const state = reactive<BuilderState>({ ...initialState })

  const availableMedials = computed(() => {
    if (!state.selectedInitial) return []
    return getAvailableMedials(state.selectedInitial)
  })

  const availableFinals = computed(() => {
    if (!state.selectedInitial || !state.medialChosen) return []
    return getAvailableFinals(state.selectedInitial, state.selectedMedial)
  })

  const resultSyllable = computed(() => {
    if (!state.selectedInitial || !state.medialChosen || !state.selectedFinal || state.selectedTone === null) {
      return null
    }
    return getResultSyllable(
      state.selectedInitial,
      state.selectedMedial,
      state.selectedFinal,
      state.selectedTone
    )
  })

  const availableTones = computed(() => {
    if (!state.selectedInitial || !state.medialChosen || !state.selectedFinal) return []
    const match = syllableCombinations.find(
      s => s.initial === state.selectedInitial && s.medial === state.selectedMedial && s.final === state.selectedFinal
    )
    if (!match) return []
    return [1, 2, 3, 4].filter(tone => {
      const toneMarked = match.toneVariants[tone - 1]
      return toneMarked ? getSyllableInfo(toneMarked) !== null : false
    })
  })

  const stepIndex = computed(() => stepOrder.indexOf(state.step))

  function dispatch(action: BuilderAction) {
    switch (action.type) {
      case 'SELECT_INITIAL':
        state.step = 'medial'
        state.selectedInitial = action.initial
        state.selectedMedial = null
        state.selectedFinal = null
        state.selectedTone = null
        state.medialChosen = false
        break

      case 'SELECT_MEDIAL':
        state.step = 'final'
        state.selectedMedial = action.medial
        state.selectedFinal = null
        state.selectedTone = null
        state.medialChosen = true
        break

      case 'SELECT_FINAL':
        state.step = 'tone'
        state.selectedFinal = action.final
        state.selectedTone = null
        break

      case 'SELECT_TONE':
        state.step = 'result'
        state.selectedTone = action.tone
        break

      case 'GO_BACK': {
        const currentIdx = stepOrder.indexOf(state.step)
        if (currentIdx <= 0) return
        const prevStep = stepOrder[currentIdx - 1]!
        state.step = prevStep
        if (prevStep === 'initial') {
          state.selectedInitial = null
          state.selectedMedial = null
          state.selectedFinal = null
          state.selectedTone = null
          state.medialChosen = false
        } else if (prevStep === 'medial') {
          state.selectedMedial = null
          state.selectedFinal = null
          state.selectedTone = null
          state.medialChosen = false
        } else if (prevStep === 'final') {
          state.selectedFinal = null
          state.selectedTone = null
        } else if (prevStep === 'tone') {
          state.selectedTone = null
        }
        break
      }

      case 'RESET':
        Object.assign(state, { ...initialState })
        break
    }
  }

  return {
    state,
    availableMedials,
    availableFinals,
    availableTones,
    resultSyllable,
    stepIndex,
    dispatch,
  }
}
