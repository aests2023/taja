/**
 * 타자 학습용 사운드 및 음성 읽기(TTS) 시스템
 * - Web Audio API 기반 소프트 효과음
 * - Web Speech API 기반 한국어 음성 읽기
 */

class SoundSystem {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;  // 효과음 온 (기본 켜짐)
    this.speechEnabled = false; // 음성 읽기(TTS) 오프 (소리는 효과음만 내고 글은 읽지 않음)
    this.speechRate = 0.95; // 가장 자연스럽고 온화한 대화 속도
    this.speechPitch = 1.0;  // 기계음 왜곡 없는 사람 고유 피치
    this.koreanVoice = null;
    
    this.initSpeech();
  }

  // AudioContext 지연 초기화 (사용자 첫 클릭 시 활성화)
  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // TTS 음성 엔진 초기화 및 사람이 말하는 듯한 최상급 한국어 신경망 목소리 탐색
  initSpeech() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const koVoices = voices.filter(v => v.lang.includes('ko') || v.lang.includes('KO'));
        if (koVoices.length === 0) return;

        // 한국어 목소리 자연스러움 정밀 점수화 (신경망 Neural / Online / Natural / Google 최우선 선별)
        const scored = koVoices.map(v => {
          let score = 0;
          const name = v.name.toLowerCase();
          if (name.includes('natural')) score += 100;
          if (name.includes('online')) score += 80;
          if (name.includes('neural')) score += 70;
          if (name.includes('google')) score += 60;
          if (name.includes('premium') || name.includes('enhanced')) score += 50;
          if (!v.localService) score += 40; // 온라인 신경망 음성 (사람 소리와 구분 힘듦)
          if (name.includes('heami') || name.includes('sun-hi') || name.includes('yuna') || name.includes('injoon')) score += 20;
          return { voice: v, score };
        });

        scored.sort((a, b) => b.score - a.score);
        this.koreanVoice = scored[0].voice;
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  // 1. 사람처럼 따뜻하고 자연스럽게 단어/문장 읽어주기 (TTS)
  speak(text) {
    if (!this.speechEnabled || !('speechSynthesis' in window) || !text) return;

    // 이전 말하기 취소 후 새로 읽기
    window.speechSynthesis.cancel();

    // 단일 및 연속 자음/모음 발음 보정 (예: 'ㅁㄴㅇㄹ' -> '미음 니은 이응 리을')
    const jamoMap = {
      'ㄱ': '기역', 'ㄴ': '니은', 'ㄷ': '디귿', 'ㄹ': '리을', 'ㅁ': '미음',
      'ㅂ': '비읍', 'ㅅ': '시옷', 'ㅇ': '이응', 'ㅈ': '지읒', 'ㅊ': '치읓',
      'ㅋ': '키읔', 'ㅌ': '티읕', 'ㅍ': '피읖', 'ㅎ': '히읗',
      'ㄲ': '쌍기역', 'ㄸ': '쌍디귿', 'ㅃ': '쌍비읍', 'ㅆ': '쌍시옷', 'ㅉ': '쌍지읒',
      'ㅏ': '아', 'ㅑ': '야', 'ㅓ': '어', 'ㅕ': '여', 'ㅗ': '오',
      'ㅛ': '요', 'ㅜ': '우', 'ㅠ': '유', 'ㅡ': '으', 'ㅣ': '이',
      'ㅐ': '애', 'ㅒ': '얘', 'ㅔ': '에', 'ㅖ': '예',
      'ㅘ': '와', 'ㅙ': '왜', 'ㅚ': '외', 'ㅝ': '워', 'ㅞ': '웨', 'ㅟ': '위', 'ㅢ': '의'
    };

    let textToSpeak = Array.from(text).map(ch => jamoMap[ch] ? jamoMap[ch] + ' ' : ch).join('').trim();

    // 끊김 없이 문장 억양(Prosody)을 살리기 위해 문장 끝 마침표 보정
    if (!/[.!?]$/.test(textToSpeak)) {
      textToSpeak += '.';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95; // 사람이 차근차근 이야기하는 최적의 호흡 속도
    utterance.pitch = 1.0;  // 사람 본연의 부드러운 음높이
    utterance.volume = 1.0;

    if (this.koreanVoice) {
      utterance.voice = this.koreanVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // 2. 키 누름 효과음 (부드러운 노크/버블 소리)
  playKeyPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  // 3. 정답/성공 효과음 (기분 좋은 띵동 멜로디)
  playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // 도, 미, 솔, 높은 도

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.26);
    });
  }

  // 4. 오답 효과음 (부드러운 웅 소리 - 무섭지 않고 친근함)
  playError() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 0.16);
  }

  // 5. 풍선 터뜨리기 게임 팡! 소리
  playBalloonPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 노이즈버스트 (팡 소리)
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.1);
  }

  // 6. 축하 팡파레 멜로디
  playFanfare() {
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // 도-미-솔-도 팡파레
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.50, d: 0.4, t: 0.36 }
    ];

    melody.forEach(item => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now + item.t);

      gain.gain.setValueAtTime(0.25, now + item.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + item.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + item.t);
      osc.stop(now + item.t + item.d + 0.05);
    });
  }
}

// 전역 인스턴스
window.soundSystem = new SoundSystem();
