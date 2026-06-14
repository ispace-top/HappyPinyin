// 人教版小学语文课本一、二年级汉字对应拼音音节库
// 用于"打字小能手"游戏题目生成，确保汉字难度与年级匹配

// 一年级上册 — 基础简单音节
export const GRADE1A_SYLLABLES: string[] = [
  // 单韵母
  'ba', 'pa', 'ma', 'fa', 'da', 'ta', 'na', 'la',
  'bo', 'po', 'mo', 'fo',
  'de', 'te', 'ne', 'le',
  'bu', 'pu', 'mu', 'fu', 'du', 'tu', 'nu', 'lu',
  // 复韵母
  'bai', 'pai', 'mai', 'dai', 'tai', 'nai', 'lai',
  'bei', 'pei', 'mei', 'fei', 'dei', 'nei', 'lei',
  'bao', 'pao', 'mao', 'dao', 'tao', 'nao', 'lao',
  'ban', 'pan', 'man', 'fan', 'dan', 'tan', 'nan', 'lan',
  'ben', 'pen', 'men', 'fen',
  'bang', 'pang', 'mang', 'fang', 'dang', 'tang', 'nang', 'lang',
  'beng', 'peng', 'meng', 'feng', 'deng', 'teng', 'neng', 'leng',
  // 三拼
  'jia', 'xia', 'hua', 'gua', 'kua',
  'duo', 'tuo', 'nuo', 'luo', 'guo', 'kuo', 'huo', 'zuo', 'cuo', 'suo',
]

// 一年级下册 — 扩展复韵母和三拼音节
export const GRADE1B_SYLLABLES: string[] = [
  ...GRADE1A_SYLLABLES,
  // 更多复韵母
  'ga', 'ka', 'ha',
  'ge', 'ke', 'he',
  'gu', 'ku', 'hu',
  'ji', 'qi', 'xi',
  'zha', 'cha', 'sha',
  'zhe', 'che', 'she', 're',
  'zhu', 'chu', 'shu', 'ru',
  'zi', 'ci', 'si',
  'zu', 'cu', 'su',
  'zai', 'cai', 'sai',
  'zei',
  'zao', 'cao', 'sao', 'rao',
  'zou', 'cou', 'sou', 'rou',
  'zan', 'can', 'san', 'ran',
  'zen', 'cen', 'sen', 'ren',
  'zang', 'cang', 'sang', 'rang',
  'zeng', 'ceng', 'seng', 'reng',
  'zhai', 'chai', 'shai',
  'zhao', 'chao', 'shao',
  'zhou', 'chou', 'shou',
  'zhan', 'chan', 'shan',
  'zhen', 'chen', 'shen',
  'zhang','chang','shang',
  'zheng','cheng','sheng',
  'gao', 'kao', 'hao',
  'gou', 'kou', 'hou',
  'gan', 'kan', 'han',
  'gen', 'ken', 'hen',
  'gang', 'kang', 'hang',
  'geng', 'keng', 'heng',
  'gai', 'kai', 'hai',
  'gei', 'hei',
  'dou', 'tou', 'nou', 'lou',
  // 三拼
  'bie', 'pie', 'mie', 'die', 'tie', 'nie', 'lie',
  'biao','piao','miao','diao','tiao','niao','liao',
  'bian','pian','mian','dian','tian','nian','lian',
  'bin', 'pin', 'min', 'nin', 'lin',
  'bing','ping','ming','ding','ting','ning','ling',
  'jiao','qiao','xiao',
  'jiu', 'qiu', 'xiu',
  'jian','qian','xian',
  'jin', 'qin', 'xin',
  'jiang','qiang','xiang',
  'jing','qing','xing',
  'jiong','qiong','xiong',
  'duan','tuan','nuan','luan','guan','kuan','huan',
  'dun', 'tun', 'lun', 'gun', 'kun', 'hun',
  'zhuai','chuai','shuai',
  'zhuang','chuang','shuang',
  'zhong','chong',
]

// 二年级上册 — 更多复杂韵母
export const GRADE2A_SYLLABLES: string[] = [
  ...GRADE1B_SYLLABLES,
  // ü 系列
  'nü', 'lü', 'jue', 'que', 'xue',
  'juan','quan','xuan',
  'jun', 'qun', 'xun',
  // 鼻韵母
  'nong','long','gong','kong','hong','zong','cong','song','rong',
  'yang','wang',
  'wai', 'wei',
  'wan', 'wen', 'weng',
  'yue', 'yun', 'yuan',
  'yao', 'you', 'yan', 'yin', 'yang', 'ying', 'yong',
  // 整体认读
  'wu', 'yi', 'yu', 'ye', 'ya',
  'wa', 'wo',
  'er',
  'miu', 'diu', 'niu', 'liu',
  'guai','kuai','huai','zhuai',
]

// 二年级下册 — 全覆盖，排除高年级生僻字
export const GRADE2B_SYLLABLES: string[] = [
  ...GRADE2A_SYLLABLES,
  'nve', 'lve',
  'cuan','suan','ruan','zuan',
  'cun', 'sun', 'run', 'zun',
  'chui', 'shui', 'rui', 'zui', 'cui', 'sui',
  'chun', 'shun', 'run',
  'ri', 're',
  'nve', 'lve',
]
