import type { PinyinElement } from '@/types/pinyin'

// pronunciation uses Chinese characters for correct TTS output
export const initials: PinyinElement[] = [
  // 唇音 b p m f
  { id: 'initial-b', text: 'b', category: 'initial', pronunciation: '播',  description: '听广播的b', group: '唇音' },
  { id: 'initial-p', text: 'p', category: 'initial', pronunciation: '坡',  description: '爬山坡的p', group: '唇音' },
  { id: 'initial-m', text: 'm', category: 'initial', pronunciation: '摸',  description: '摸一摸的m', group: '唇音' },
  { id: 'initial-f', text: 'f', category: 'initial', pronunciation: '佛',  description: '大佛像的f', group: '唇音' },
  // 舌尖音 d t n l
  { id: 'initial-d', text: 'd', category: 'initial', pronunciation: '得',  description: '敲小鼓的d', group: '舌尖音' },
  { id: 'initial-t', text: 't', category: 'initial', pronunciation: '特',  description: '小伞把的t', group: '舌尖音' },
  { id: 'initial-n', text: 'n', category: 'initial', pronunciation: '呢',  description: '进门洞的n', group: '舌尖音' },
  { id: 'initial-l', text: 'l', category: 'initial', pronunciation: '了',  description: '快乐了的l', group: '舌尖音' },
  // 舌根音 g k h
  { id: 'initial-g', text: 'g', category: 'initial', pronunciation: '哥',  description: '小白鸽的g', group: '舌根音' },
  { id: 'initial-k', text: 'k', category: 'initial', pronunciation: '科',  description: '小蝌蚪的k', group: '舌根音' },
  { id: 'initial-h', text: 'h', category: 'initial', pronunciation: '喝',  description: '喝水的h',   group: '舌根音' },
  // 舌面音 j q x
  { id: 'initial-j', text: 'j', category: 'initial', pronunciation: '鸡',  description: '小公鸡的j', group: '舌面音' },
  { id: 'initial-q', text: 'q', category: 'initial', pronunciation: '七',  description: '七彩桥的q', group: '舌面音' },
  { id: 'initial-x', text: 'x', category: 'initial', pronunciation: '西',  description: '大西瓜的x', group: '舌面音' },
  // 翘舌音 zh ch sh r
  { id: 'initial-zh',text: 'zh',category: 'initial', pronunciation: '知', description: '织毛衣的zh', group: '翘舌音' },
  { id: 'initial-ch',text: 'ch',category: 'initial', pronunciation: '吃', description: '吃东西的ch', group: '翘舌音' },
  { id: 'initial-sh',text: 'sh',category: 'initial', pronunciation: '师', description: '大狮子的sh', group: '翘舌音' },
  { id: 'initial-r', text: 'r', category: 'initial', pronunciation: '日',  description: '日出的r',   group: '翘舌音' },
  // 平舌音 z c s
  { id: 'initial-z', text: 'z', category: 'initial', pronunciation: '资',  description: '写字的z',   group: '平舌音' },
  { id: 'initial-c', text: 'c', category: 'initial', pronunciation: '词',  description: '小刺猬的c', group: '平舌音' },
  { id: 'initial-s', text: 's', category: 'initial', pronunciation: '思',  description: '蚕吐丝的s', group: '平舌音' },
  // 半元音 y w
  { id: 'initial-y', text: 'y', category: 'initial', pronunciation: '衣',  description: '衣服的y',   group: '半元音' },
  { id: 'initial-w', text: 'w', category: 'initial', pronunciation: '屋',  description: '房屋的w',   group: '半元音' },
]
