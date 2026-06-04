import type { PinyinElement } from '@/types/pinyin'

// pronunciation uses Chinese characters for correct TTS output
export const singleFinals: PinyinElement[] = [
  { id: 'final-a',  text: 'a',  category: 'final', subCategory: 'single', pronunciation: '啊' },
  { id: 'final-o',  text: 'o',  category: 'final', subCategory: 'single', pronunciation: '哦' },
  { id: 'final-e',  text: 'e',  category: 'final', subCategory: 'single', pronunciation: '鹅' },
  { id: 'final-i',  text: 'i',  category: 'final', subCategory: 'single', pronunciation: '衣' },
  { id: 'final-u',  text: 'u',  category: 'final', subCategory: 'single', pronunciation: '乌' },
  { id: 'final-ü',  text: 'ü',  category: 'final', subCategory: 'single', pronunciation: '鱼' },
]

export const compoundFinals: PinyinElement[] = [
  { id: 'final-ai',  text: 'ai',  category: 'final', subCategory: 'compound', pronunciation: '挨' },
  { id: 'final-ei',  text: 'ei',  category: 'final', subCategory: 'compound', pronunciation: '欸' },
  { id: 'final-ui',  text: 'ui',  category: 'final', subCategory: 'compound', pronunciation: '威' },
  { id: 'final-ao',  text: 'ao',  category: 'final', subCategory: 'compound', pronunciation: '凹' },
  { id: 'final-ou',  text: 'ou',  category: 'final', subCategory: 'compound', pronunciation: '欧' },
  { id: 'final-iu',  text: 'iu',  category: 'final', subCategory: 'compound', pronunciation: '优' },
  { id: 'final-ie',  text: 'ie',  category: 'final', subCategory: 'compound', pronunciation: '椰' },
  { id: 'final-üe', text: 'üe',  category: 'final', subCategory: 'compound', pronunciation: '约' },
  { id: 'final-er',  text: 'er',  category: 'final', subCategory: 'compound', pronunciation: '儿' },
  { id: 'final-an',  text: 'an',  category: 'final', subCategory: 'compound', pronunciation: '安' },
  { id: 'final-en',  text: 'en',  category: 'final', subCategory: 'compound', pronunciation: '恩' },
  { id: 'final-in',  text: 'in',  category: 'final', subCategory: 'compound', pronunciation: '音' },
  { id: 'final-un',  text: 'un',  category: 'final', subCategory: 'compound', pronunciation: '温' },
  { id: 'final-ün',  text: 'ün',  category: 'final', subCategory: 'compound', pronunciation: '晕' },
  { id: 'final-ang', text: 'ang', category: 'final', subCategory: 'compound', pronunciation: '昂' },
  { id: 'final-eng', text: 'eng', category: 'final', subCategory: 'compound', pronunciation: '鞥' },
  { id: 'final-ing', text: 'ing', category: 'final', subCategory: 'compound', pronunciation: '英' },
  { id: 'final-ong', text: 'ong', category: 'final', subCategory: 'compound', pronunciation: '翁' },
]

export const allFinals: PinyinElement[] = [...singleFinals, ...compoundFinals]
