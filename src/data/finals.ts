import type { PinyinElement } from '@/types/pinyin'

// pronunciation uses Chinese characters for correct TTS output
export const singleFinals: PinyinElement[] = [
  { id: 'final-a',  text: 'a',  category: 'final', subCategory: 'single', pronunciation: '阿', description: '张大嘴巴a a a', emoji: '😮' },
  { id: 'final-o',  text: 'o',  category: 'final', subCategory: 'single', pronunciation: '喔', description: '公鸡打鸣o o o', emoji: '🐓' },
  { id: 'final-e',  text: 'e',  category: 'final', subCategory: 'single', pronunciation: '鹅', description: '白鹅倒影e e e', emoji: '🦢' },
  { id: 'final-i',  text: 'i',  category: 'final', subCategory: 'single', pronunciation: '衣', description: '一件衣服i i i', emoji: '👗' },
  { id: 'final-u',  text: 'u',  category: 'final', subCategory: 'single', pronunciation: '乌', description: '一只乌鸦u u u', emoji: '🐦' },
  { id: 'final-ü',  text: 'ü',  category: 'final', subCategory: 'single', pronunciation: '鱼', description: '一条小鱼ü ü ü', emoji: '🐟' },
]

export const compoundFinals: PinyinElement[] = [
  { id: 'final-ai',  text: 'ai',  category: 'final', subCategory: 'compound', pronunciation: '挨', description: '挨在一起ai ai ai', emoji: '🤗' },
  { id: 'final-ei',  text: 'ei',  category: 'final', subCategory: 'compound', pronunciation: '欸', description: '用力砍柴ei ei ei', emoji: '🪓' },
  { id: 'final-ui',  text: 'ui',  category: 'final', subCategory: 'compound', pronunciation: '威', description: '围巾围巾ui ui ui', emoji: '🧣' },
  { id: 'final-ao',  text: 'ao',  category: 'final', subCategory: 'compound', pronunciation: '凹', description: '冬天棉袄ao ao ao', emoji: '🧥' },
  { id: 'final-ou',  text: 'ou',  category: 'final', subCategory: 'compound', pronunciation: '欧', description: '海鸥飞翔ou ou ou', emoji: '🕊️' },
  { id: 'final-iu',  text: 'iu',  category: 'final', subCategory: 'compound', pronunciation: '优', description: '一张邮票iu iu iu', emoji: '📮' },
  { id: 'final-ie',  text: 'ie',  category: 'final', subCategory: 'compound', pronunciation: '椰', description: '椰子树叶ie ie ie', emoji: '🥥' },
  { id: 'final-üe',  text: 'üe',  category: 'final', subCategory: 'compound', pronunciation: '约', description: '月儿弯弯üe üe üe', emoji: '🌙' },
  { id: 'final-er',  text: 'er',  category: 'final', subCategory: 'compound', pronunciation: '儿', description: '一只耳朵er er er', emoji: '👂' },
  { id: 'final-an',  text: 'an',  category: 'final', subCategory: 'compound', pronunciation: '安', description: '安全第一an an an', emoji: '🛡️' },
  { id: 'final-en',  text: 'en',  category: 'final', subCategory: 'compound', pronunciation: '恩', description: '摁下门铃en en en', emoji: '🔔' },
  { id: 'final-in',  text: 'in',  category: 'final', subCategory: 'compound', pronunciation: '音', description: '美妙声音in in in', emoji: '🎵' },
  { id: 'final-un',  text: 'un',  category: 'final', subCategory: 'compound', pronunciation: '温', description: '温暖春天un un un', emoji: '🌸' },
  { id: 'final-ün',  text: 'ün',  category: 'final', subCategory: 'compound', pronunciation: '晕', description: '云朵飘飘ün ün ün', emoji: '☁️' },
  { id: 'final-ang', text: 'ang', category: 'final', subCategory: 'compound', pronunciation: '昂', description: '昂首挺胸ang ang ang', emoji: '🦚' },
  { id: 'final-eng', text: 'eng', category: 'final', subCategory: 'compound', pronunciation: '鞥', description: '一盏台灯eng eng eng', emoji: '💡' },
  { id: 'final-ing', text: 'ing', category: 'final', subCategory: 'compound', pronunciation: '英', description: '一只老鹰ing ing ing', emoji: '🦅' },
  { id: 'final-ong', text: 'ong', category: 'final', subCategory: 'compound', pronunciation: '翁', description: '闹钟叮咚ong ong ong', emoji: '⏰' },
]

export const allFinals: PinyinElement[] = [...singleFinals, ...compoundFinals]
