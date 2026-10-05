/**
 * 타자 학습용 키보드 및 데이터 정의
 * - 한글 2벌식 자소 분리 데이터
 * - 손가락/손 매핑 및 색상 정의
 * - 어린이/지적장애인 맞춤 단계별 학습 데이터
 */

// 1. 손가락 색상 및 이름 정의
const FINGER_TYPES = {
  L_PINKY: { id: 'L_PINKY', hand: 'left', finger: 'pinky', name: '왼손 새끼손가락', color: '#FF7675', bg: 'rgba(255, 118, 117, 0.25)' },
  L_RING: { id: 'L_RING', hand: 'left', finger: 'ring', name: '왼손 약지손가락', color: '#FAB1A0', bg: 'rgba(250, 177, 160, 0.25)' },
  L_MIDDLE: { id: 'L_MIDDLE', hand: 'left', finger: 'middle', name: '왼손 중지손가락', color: '#FFEAA7', bg: 'rgba(255, 234, 167, 0.35)' },
  L_INDEX: { id: 'L_INDEX', hand: 'left', finger: 'index', name: '왼손 검지손가락', color: '#55E6C1', bg: 'rgba(85, 230, 193, 0.25)' },
  THUMB: { id: 'THUMB', hand: 'both', finger: 'thumb', name: '엄지손가락 (스페이스바)', color: '#A29BFE', bg: 'rgba(162, 155, 254, 0.25)' },
  R_INDEX: { id: 'R_INDEX', hand: 'right', finger: 'index', name: '오른손 검지손가락', color: '#74B9FF', bg: 'rgba(116, 185, 255, 0.25)' },
  R_MIDDLE: { id: 'R_MIDDLE', hand: 'right', finger: 'middle', name: '오른손 중지손가락', color: '#0984E3', bg: 'rgba(9, 132, 227, 0.25)' },
  R_RING: { id: 'R_RING', hand: 'right', finger: 'ring', name: '오른손 약지손가락', color: '#6C5CE7', bg: 'rgba(108, 92, 231, 0.25)' },
  R_PINKY: { id: 'R_PINKY', hand: 'right', finger: 'pinky', name: '오른손 새끼손가락', color: '#FD79A8', bg: 'rgba(253, 121, 168, 0.25)' },
};

// 2. 물리적 키보드 배치 및 손가락 매핑 (QWERTY + 한글 2벌식)
const KEYBOARD_MAP = {
  '`': { code: 'Backquote', hangul: '`', eng: '`', shiftHangul: '~', shiftEng: '~', finger: FINGER_TYPES.L_PINKY },
  '1': { code: 'Digit1', hangul: '1', eng: '1', shiftHangul: '!', shiftEng: '!', finger: FINGER_TYPES.L_PINKY },
  '2': { code: 'Digit2', hangul: '2', eng: '2', shiftHangul: '@', shiftEng: '@', finger: FINGER_TYPES.L_RING },
  '3': { code: 'Digit3', hangul: '3', eng: '3', shiftHangul: '#', shiftEng: '#', finger: FINGER_TYPES.L_MIDDLE },
  '4': { code: 'Digit4', hangul: '4', eng: '4', shiftHangul: '$', shiftEng: '$', finger: FINGER_TYPES.L_INDEX },
  '5': { code: 'Digit5', hangul: '5', eng: '5', shiftHangul: '%', shiftEng: '%', finger: FINGER_TYPES.L_INDEX },
  '6': { code: 'Digit6', hangul: '6', eng: '6', shiftHangul: '^', shiftEng: '^', finger: FINGER_TYPES.R_INDEX },
  '7': { code: 'Digit7', hangul: '7', eng: '7', shiftHangul: '&', shiftEng: '&', finger: FINGER_TYPES.R_INDEX },
  '8': { code: 'Digit8', hangul: '8', eng: '8', shiftHangul: '*', shiftEng: '*', finger: FINGER_TYPES.R_MIDDLE },
  '9': { code: 'Digit9', hangul: '9', eng: '9', shiftHangul: '(', shiftEng: '(', finger: FINGER_TYPES.R_RING },
  '0': { code: 'Digit0', hangul: '0', eng: '0', shiftHangul: ')', shiftEng: ')', finger: FINGER_TYPES.R_PINKY },
  '-': { code: 'Minus', hangul: '-', eng: '-', shiftHangul: '_', shiftEng: '_', finger: FINGER_TYPES.R_PINKY },
  '=': { code: 'Equal', hangul: '=', eng: '=', shiftHangul: '+', shiftEng: '+', finger: FINGER_TYPES.R_PINKY },

  'q': { code: 'KeyQ', hangul: 'ㅂ', eng: 'q', shiftHangul: 'ㅃ', shiftEng: 'Q', finger: FINGER_TYPES.L_PINKY },
  'w': { code: 'KeyW', hangul: 'ㅈ', eng: 'w', shiftHangul: 'ㅉ', shiftEng: 'W', finger: FINGER_TYPES.L_RING },
  'e': { code: 'KeyE', hangul: 'ㄷ', eng: 'e', shiftHangul: 'ㄸ', shiftEng: 'E', finger: FINGER_TYPES.L_MIDDLE },
  'r': { code: 'KeyR', hangul: 'ㄱ', eng: 'r', shiftHangul: 'ㄲ', shiftEng: 'R', finger: FINGER_TYPES.L_INDEX },
  't': { code: 'KeyT', hangul: 'ㅅ', eng: 't', shiftHangul: 'ㅆ', shiftEng: 'T', finger: FINGER_TYPES.L_INDEX },
  'y': { code: 'KeyY', hangul: 'ㅛ', eng: 'y', shiftHangul: 'ㅛ', shiftEng: 'Y', finger: FINGER_TYPES.R_INDEX },
  'u': { code: 'KeyU', hangul: 'ㅕ', eng: 'u', shiftHangul: 'ㅕ', shiftEng: 'U', finger: FINGER_TYPES.R_INDEX },
  'i': { code: 'KeyI', hangul: 'ㅑ', eng: 'i', shiftHangul: 'ㅑ', shiftEng: 'I', finger: FINGER_TYPES.R_MIDDLE },
  'o': { code: 'KeyO', hangul: 'ㅐ', eng: 'o', shiftHangul: 'ㅒ', shiftEng: 'O', finger: FINGER_TYPES.R_RING },
  'p': { code: 'KeyP', hangul: 'ㅔ', eng: 'p', shiftHangul: 'ㅖ', shiftEng: 'P', finger: FINGER_TYPES.R_PINKY },
  '[': { code: 'BracketLeft', hangul: '[', eng: '[', shiftHangul: '{', shiftEng: '{', finger: FINGER_TYPES.R_PINKY },
  ']': { code: 'BracketRight', hangul: ']', eng: ']', shiftHangul: '}', shiftEng: '}', finger: FINGER_TYPES.R_PINKY },

  'a': { code: 'KeyA', hangul: 'ㅁ', eng: 'a', shiftHangul: 'ㅁ', shiftEng: 'A', finger: FINGER_TYPES.L_PINKY },
  's': { code: 'KeyS', hangul: 'ㄴ', eng: 's', shiftHangul: 'ㄴ', shiftEng: 'S', finger: FINGER_TYPES.L_RING },
  'd': { code: 'KeyD', hangul: 'ㅇ', eng: 'd', shiftHangul: 'ㅇ', shiftEng: 'D', finger: FINGER_TYPES.L_MIDDLE },
  'f': { code: 'KeyF', hangul: 'ㄹ', eng: 'f', shiftHangul: 'ㄹ', shiftEng: 'F', finger: FINGER_TYPES.L_INDEX },
  'g': { code: 'KeyG', hangul: 'ㅎ', eng: 'g', shiftHangul: 'ㅎ', shiftEng: 'G', finger: FINGER_TYPES.L_INDEX },
  'h': { code: 'KeyH', hangul: 'ㅗ', eng: 'h', shiftHangul: 'ㅗ', shiftEng: 'H', finger: FINGER_TYPES.R_INDEX },
  'j': { code: 'KeyJ', hangul: 'ㅓ', eng: 'j', shiftHangul: 'ㅓ', shiftEng: 'J', finger: FINGER_TYPES.R_INDEX },
  'k': { code: 'KeyK', hangul: 'ㅏ', eng: 'k', shiftHangul: 'ㅏ', shiftEng: 'K', finger: FINGER_TYPES.R_MIDDLE },
  'l': { code: 'KeyL', hangul: 'ㅣ', eng: 'l', shiftHangul: 'ㅣ', shiftEng: 'L', finger: FINGER_TYPES.R_RING },
  ';': { code: 'Semicolon', hangul: ';', eng: ';', shiftHangul: ':', shiftEng: ':', finger: FINGER_TYPES.R_PINKY },
  "'": { code: 'Quote', hangul: "'", eng: "'", shiftHangul: '"', shiftEng: '"', finger: FINGER_TYPES.R_PINKY },

  'z': { code: 'KeyZ', hangul: 'ㅋ', eng: 'z', shiftHangul: 'ㅋ', shiftEng: 'Z', finger: FINGER_TYPES.L_PINKY },
  'x': { code: 'KeyX', hangul: 'ㅌ', eng: 'x', shiftHangul: 'ㅌ', shiftEng: 'X', finger: FINGER_TYPES.L_RING },
  'c': { code: 'KeyC', hangul: 'ㅊ', eng: 'c', shiftHangul: 'ㅊ', shiftEng: 'C', finger: FINGER_TYPES.L_MIDDLE },
  'v': { code: 'KeyV', hangul: 'ㅍ', eng: 'v', shiftHangul: 'ㅍ', shiftEng: 'V', finger: FINGER_TYPES.L_INDEX },
  'b': { code: 'KeyB', hangul: 'ㅠ', eng: 'b', shiftHangul: 'ㅠ', shiftEng: 'B', finger: FINGER_TYPES.L_INDEX },
  'n': { code: 'KeyN', hangul: 'ㅜ', eng: 'n', shiftHangul: 'ㅜ', shiftEng: 'N', finger: FINGER_TYPES.R_INDEX },
  'm': { code: 'KeyM', hangul: 'ㅡ', eng: 'm', shiftHangul: 'ㅡ', shiftEng: 'M', finger: FINGER_TYPES.R_INDEX },
  ',': { code: 'Comma', hangul: ',', eng: ',', shiftHangul: '<', shiftEng: '<', finger: FINGER_TYPES.R_MIDDLE },
  '.': { code: 'Period', hangul: '.', eng: '.', shiftHangul: '>', shiftEng: '>', finger: FINGER_TYPES.R_RING },
  '/': { code: 'Slash', hangul: '/', eng: '/', shiftHangul: '?', shiftEng: '?', finger: FINGER_TYPES.R_PINKY },

  ' ': { code: 'Space', hangul: ' ', eng: ' ', finger: FINGER_TYPES.THUMB },
  'Enter': { code: 'Enter', hangul: 'Enter', eng: 'Enter', finger: FINGER_TYPES.R_PINKY },

  'ShiftLeft': { code: 'ShiftLeft', hangul: 'Shift', eng: 'Shift', finger: FINGER_TYPES.L_PINKY },
  'ShiftRight': { code: 'ShiftRight', hangul: 'Shift', eng: 'Shift', finger: FINGER_TYPES.R_PINKY }
};

// 기호 및 된소리 Shift 별칭 매핑 (! @ # $ % ^ & * ( ) ㄲ ㅆ ㅃ ㅉ ㄸ ㅒ ㅖ 등)
const SHIFT_KEY_ALIASES = {
  '!': { baseKey: '1', hangul: '!', eng: '!', finger: FINGER_TYPES.L_PINKY, isShift: true, shiftSide: 'right' },
  '@': { baseKey: '2', hangul: '@', eng: '@', finger: FINGER_TYPES.L_RING, isShift: true, shiftSide: 'right' },
  '#': { baseKey: '3', hangul: '#', eng: '#', finger: FINGER_TYPES.L_MIDDLE, isShift: true, shiftSide: 'right' },
  '$': { baseKey: '4', hangul: '$', eng: '$', finger: FINGER_TYPES.L_INDEX, isShift: true, shiftSide: 'right' },
  '%': { baseKey: '5', hangul: '%', eng: '%', finger: FINGER_TYPES.L_INDEX, isShift: true, shiftSide: 'right' },
  '^': { baseKey: '6', hangul: '^', eng: '^', finger: FINGER_TYPES.R_INDEX, isShift: true, shiftSide: 'left' },
  '&': { baseKey: '7', hangul: '&', eng: '&', finger: FINGER_TYPES.R_INDEX, isShift: true, shiftSide: 'left' },
  '*': { baseKey: '8', hangul: '*', eng: '*', finger: FINGER_TYPES.R_MIDDLE, isShift: true, shiftSide: 'left' },
  '(': { baseKey: '9', hangul: '(', eng: '(', finger: FINGER_TYPES.R_RING, isShift: true, shiftSide: 'left' },
  ')': { baseKey: '0', hangul: ')', eng: ')', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },
  '_': { baseKey: '-', hangul: '_', eng: '_', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },
  '+': { baseKey: '=', hangul: '+', eng: '+', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },

  'ㅃ': { baseKey: 'q', hangul: 'ㅃ', eng: 'Q', finger: FINGER_TYPES.L_PINKY, isShift: true, shiftSide: 'right' },
  'ㅉ': { baseKey: 'w', hangul: 'ㅉ', eng: 'W', finger: FINGER_TYPES.L_RING, isShift: true, shiftSide: 'right' },
  'ㄸ': { baseKey: 'e', hangul: 'ㄸ', eng: 'E', finger: FINGER_TYPES.L_MIDDLE, isShift: true, shiftSide: 'right' },
  'ㄲ': { baseKey: 'r', hangul: 'ㄲ', eng: 'R', finger: FINGER_TYPES.L_INDEX, isShift: true, shiftSide: 'right' },
  'ㅆ': { baseKey: 't', hangul: 'ㅆ', eng: 'T', finger: FINGER_TYPES.L_INDEX, isShift: true, shiftSide: 'right' },
  'ㅒ': { baseKey: 'o', hangul: 'ㅒ', eng: 'O', finger: FINGER_TYPES.R_RING, isShift: true, shiftSide: 'left' },
  'ㅖ': { baseKey: 'p', hangul: 'ㅖ', eng: 'P', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },

  'Q': { baseKey: 'q', hangul: 'ㅃ', eng: 'Q', finger: FINGER_TYPES.L_PINKY, isShift: true, shiftSide: 'right' },
  'W': { baseKey: 'w', hangul: 'ㅉ', eng: 'W', finger: FINGER_TYPES.L_RING, isShift: true, shiftSide: 'right' },
  'E': { baseKey: 'e', hangul: 'ㄸ', eng: 'E', finger: FINGER_TYPES.L_MIDDLE, isShift: true, shiftSide: 'right' },
  'R': { baseKey: 'r', hangul: 'ㄲ', eng: 'R', finger: FINGER_TYPES.L_INDEX, isShift: true, shiftSide: 'right' },
  'T': { baseKey: 't', hangul: 'ㅆ', eng: 'T', finger: FINGER_TYPES.L_INDEX, isShift: true, shiftSide: 'right' },
  'O': { baseKey: 'o', hangul: 'ㅒ', eng: 'O', finger: FINGER_TYPES.R_RING, isShift: true, shiftSide: 'left' },
  'P': { baseKey: 'p', hangul: 'ㅖ', eng: 'P', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },

  '<': { baseKey: ',', hangul: '<', eng: '<', finger: FINGER_TYPES.R_MIDDLE, isShift: true, shiftSide: 'left' },
  '>': { baseKey: '.', hangul: '>', eng: '>', finger: FINGER_TYPES.R_RING, isShift: true, shiftSide: 'left' },
  '?': { baseKey: '/', hangul: '?', eng: '?', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },
  ':': { baseKey: ';', hangul: ':', eng: ':', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },
  '"': { baseKey: "'", hangul: '"', eng: '"', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },
  '{': { baseKey: '[', hangul: '{', eng: '{', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' },
  '}': { baseKey: ']', hangul: '}', eng: '}', finger: FINGER_TYPES.R_PINKY, isShift: true, shiftSide: 'left' }
};

Object.assign(KEYBOARD_MAP, SHIFT_KEY_ALIASES);

// 한글 자모 유틸리티
const HANGUL_OFFSET = 0xAC00;
const CHO_DATA = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG_DATA = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ'];
const JONG_DATA = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', '앉', '않', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

const JAMO_KEY_MAP = {
  'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E', 'ㄹ': 'f', 'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q',
  'ㅅ': 't', 'ㅆ': 'T', 'ㅇ': 'd', 'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
  'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j', 'ㅔ': 'p', 'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h',
  'ㅘ': ['h', 'k'], 'ㅙ': ['h', 'o'], 'ㅚ': ['h', 'l'], 'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': ['n', 'j'],
  'ㅞ': ['n', 'p'], 'ㅟ': ['n', 'l'], 'ㅠ': 'b', 'ㅡ': 'm', 'ㅢ': ['m', 'l'], 'ㅣ': 'l'
};

const DOUBLE_JONG_MAP = {
  'ㄳ': ['r', 't'], '앉': ['s', 'w'], '않': ['s', 'g'], 'ㄺ': ['f', 'r'], 'ㄻ': ['f', 'a'],
  'ㄼ': ['f', 'q'], 'ㄽ': ['f', 't'], 'ㄾ': ['f', 'x'], 'ㄿ': ['f', 'v'], 'ㅀ': ['f', 'g'], 'ㅄ': ['q', 't']
};

function decomposeSyllableToKeys(char) {
  const code = char.charCodeAt(0);
  if (JAMO_KEY_MAP[char]) {
    const mapped = JAMO_KEY_MAP[char];
    return Array.isArray(mapped) ? mapped : [mapped];
  }
  if (code >= 0xAC00 && code <= 0xD7A3) {
    const uniIndex = code - HANGUL_OFFSET;
    const choIdx = Math.floor(uniIndex / (21 * 28));
    const jungIdx = Math.floor((uniIndex % (21 * 28)) / 28);
    const jongIdx = uniIndex % 28;

    const cho = CHO_DATA[choIdx];
    const jung = JUNG_DATA[jungIdx];
    const jong = JONG_DATA[jongIdx];

    const keyList = [];
    if (JAMO_KEY_MAP[cho]) {
      const choKey = JAMO_KEY_MAP[cho];
      if (Array.isArray(choKey)) keyList.push(...choKey); else keyList.push(choKey);
    }
    if (JAMO_KEY_MAP[jung]) {
      const jungKey = JAMO_KEY_MAP[jung];
      if (Array.isArray(jungKey)) keyList.push(...jungKey); else keyList.push(jungKey);
    }
    if (jong !== '') {
      if (DOUBLE_JONG_MAP[jong]) {
        keyList.push(...DOUBLE_JONG_MAP[jong]);
      } else if (JAMO_KEY_MAP[jong]) {
        const jongKey = JAMO_KEY_MAP[jong];
        if (Array.isArray(jongKey)) keyList.push(...jongKey); else keyList.push(jongKey);
      }
    }
    return keyList;
  }
  return [char.toLowerCase()];
}

// 3. 연습용 일반 데이터
const BASIC_LESSONS = [
  { id: 'home-left', title: '1단계: 왼손 기본 자리', desc: 'ㅁ, ㄴ, ㅇ, ㄹ 손가락을 올려 놓아봐요.', items: ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅁㄴㅇㄹ', 'ㄹㅇㄴㅁ', 'ㅁㅇㄴㄹ'] },
  { id: 'home-right', title: '2단계: 오른손 기본 자리', desc: 'ㅓ, ㅏ, ㅣ, ; 손가락을 올려 놓아봐요.', items: ['ㅓ', 'ㅏ', 'ㅣ', 'ㅓㅏㅣ', 'ㅣㅏㅓ', 'ㅓㅣㅏ'] },
  { id: 'home-both', title: '3단계: 양손 기본 자리 모음', desc: '왼손과 오른손 기본 자리를 섞어서 쳐보아요.', items: ['ㅁㅏ', 'ㄴㅓ', 'ㅇㅣ', 'ㄹㅏ', '마', '너', '이', '라', '나라', '마음'] },
  { id: 'consonants', title: '4단계: 자음 모음 익히기', desc: 'ㄱ, ㄴ, ㄷ, ㄹ 기본 자음을 하나씩 눌러보아요.', items: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'] },
  { id: 'vowels', title: '5단계: 모음 익히기', desc: 'ㅏ, ㅑ, ㅓ, ㅕ 모음을 눌러보아요.', items: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'] }
];

const WORD_LESSONS = [
  { word: '사과', emoji: '🍎', desc: '새콤달콤 빨간 사과' },
  { word: '바나나', emoji: '🍌', desc: '달콤하고 노란 바나나' },
  { word: '강아지', emoji: '🐶', desc: '멍멍 멍멍 귀여운 강아지' },
  { word: '고양이', emoji: '🐱', desc: '야옹 야옹 폭신한 고양이' },
  { word: '무지개', emoji: '🌈', desc: '알록달록 예쁜 무지개' },
  { word: '별', emoji: '⭐️', desc: '반짝반짝 하늘의 별' },
  { word: '자동차', emoji: '🚗', desc: '부릉부릉 달리는 자동차' },
  { word: '토끼', emoji: '🐰', desc: '깡충깡충 귀여운 토끼' },
  { word: '수박', emoji: '🍉', desc: '시원하고 달콤한 수박' },
  { word: '선물', emoji: '🎁', desc: '기분 좋은 예쁜 선물' }
];

const SENTENCE_LESSONS = [
  { text: '오늘도 참 잘했어요!', emoji: '👏' },
  { text: '나는 멋진 어린이예요', emoji: '🌟' },
  { text: '차근차근 연습해요', emoji: '🐢' },
  { text: '타자 치는 게 참 재미있어요', emoji: '⌨️' },
  { text: '매일 조금씩 발전해요', emoji: '🌱' }
];

// 긴 문장 연습 데이터
const LONG_SENTENCE_LESSONS = [
  { text: '오늘도 차근차근 즐겁게 타자 연습을 해요.', emoji: '🌱' },
  { text: '하늘에는 예쁜 무지개가 알록달록 떠 있어요.', emoji: '🌈' },
  { text: '나는 매일 조금씩 성장하는 멋진 어린이입니다.', emoji: '🌟' },
  { text: '친구와 함께 웃으며 이야기하는 하루가 행복해요.', emoji: '😊' },
  { text: '자신의 힘으로 끝까지 해내는 내가 정말 자랑스러워요.', emoji: '💪' },
  { text: '따뜻한 햇살 아래 아름다운 꽃들이 피어납니다.', emoji: '🌸' },
  { text: '용기를 내어 도전하면 무엇이든 할 수 있어요.', emoji: '✨' }
];

// 4. [풍선 터뜨리기 게임 단계별 라이브러리]
const BALLOON_LEVELS = [
  {
    level: 1,
    name: '1단계: 자음/모음',
    desc: '기초 자음과 모음 키를 1번 눌러 터뜨려요!',
    items: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ']
  },
  {
    level: 2,
    name: '2단계: 한 글자',
    desc: '완성된 한 글자를 타자해서 터뜨려요!',
    items: ['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '별', '달', '해', '꽃', '새', '비', '눈', '꿈', '집', '물', '밥', '공', '빛']
  },
  {
    level: 3,
    name: '3단계: 그림 단어',
    desc: '예쁜 단어를 완성해서 풍선을 터뜨려요!',
    items: ['사과', '토끼', '구름', '나비', '우산', '선물', '사탕', '모자', '아침', '바나나', '수박', '비행기', '무지개']
  },
  {
    level: 4,
    name: '4단계: 칭찬 짧은 글',
    desc: '칭찬 문장을 완성해 풍선을 터뜨려요!',
    items: ['잘했어요', '최고예요', '멋져요', '파이팅', '행복해요', '칭찬해요', '웃어요', '함께해요', '사랑해요']
  }
];

const STICKER_ALBUM = [
  { id: 'stk_bear', name: '새싹 타자 곰돌이', emoji: '🧸', desc: '첫 타자 연습을 완료했어요!', unlocked: true },
  { id: 'stk_star', name: '반짝이는 왕별', emoji: '⭐', desc: '10개의 완벽한 타자를 성공했어요!', unlocked: false },
  { id: 'stk_cat', name: '박수 치는 야옹이', emoji: '🐱', desc: '기초 자리 연습 완료!', unlocked: false },
  { id: 'stk_crown', name: '타자 왕관', emoji: '👑', desc: '낱말 연습 5개 완주!', unlocked: false },
  { id: 'stk_balloon', name: '풍선 마스터', emoji: '🎈', desc: '풍선 게임에서 10개 터뜨리기!', unlocked: false },
  { id: 'stk_rainbow', name: '무지개 날개', emoji: '🌈', desc: '짧은 글 연습 성공!', unlocked: false },
  { id: 'stk_trophy', name: '참 잘했어요 트로피', emoji: '🏆', desc: '연속 5회 정답 달성!', unlocked: false },
  { id: 'stk_heart', name: '따뜻한 마음', emoji: '❤️', desc: '매일 즐겁게 연습해요!', unlocked: false }
];

window.FINGER_TYPES = FINGER_TYPES;
window.KEYBOARD_MAP = KEYBOARD_MAP;
window.BASIC_LESSONS = BASIC_LESSONS;
window.WORD_LESSONS = WORD_LESSONS;
window.SENTENCE_LESSONS = SENTENCE_LESSONS;
window.LONG_SENTENCE_LESSONS = LONG_SENTENCE_LESSONS;
window.BALLOON_LEVELS = BALLOON_LEVELS;
window.STICKER_ALBUM = STICKER_ALBUM;
window.decomposeSyllableToKeys = decomposeSyllableToKeys;
