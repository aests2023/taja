/**
 * 어린이나 지적장애인을 위한 맞춤 타자 프로그램 (app.js)
 * - 학습 모드 제어 (기초자리, 낱말, 짧은글, 4단계 풍선게임)
 * - 2벌식 한글 자소 분석 및 키보드/손가락 하이라이트 동기화
 * - 사운드, 음성 읽기(TTS), 칭찬 스탬프 시스템
 */

class TajaApp {
  constructor() {
    this.currentMode = 'basic'; // 'basic' | 'word' | 'sentence' | 'balloon'
    this.lessonIndex = 0;
    this.itemIndex = 0;
    
    // 타자 상태
    this.targetText = '';
    this.targetKeys = [];
    this.currentKeyIdx = 0;
    this.userTypedChars = '';
    
    // 누적 통계
    this.score = 0;
    this.streak = 0;
    this.totalTyped = 0;
    
    // 설정 옵션
    this.speechEnabled = true;
    this.highContrast = false;
    this.largeFont = false;
    this.isShiftPressed = false;

    // 모듈 초기화
    this.handsRenderer = null;
    this.balloonGame = null;

    this.init();
  }

  init() {
    // PWA 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch((err) => console.log('SW reg error:', err));
    }

    // PWA 설치 이벤트 수신
    this.deferredPrompt = window.deferredPwaPrompt || null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      window.deferredPwaPrompt = e;
      const installBtn = document.getElementById('btnInstallApp');
      if (installBtn) installBtn.classList.add('active');
    });

    // 1. 손가락 안내 SVG 렌더러 생성 (왼손, 오른손, 센터 안내 바)
    this.handsRenderer = new HandsGuideRenderer('leftHandSvgWrap', 'rightHandSvgWrap', 'fingerGuideMsg');

    // 2. 가상 키보드 UI 생성
    this.renderVirtualKeyboard();

    // 3. 이벤트 리스너 바인딩
    this.bindEvents();

    // 4. 초기 모드 (기초 자리 1단계) 로드
    this.setMode('basic');
  }

  getKeyDisplayLabels(k) {
    const keyInfo = window.KEYBOARD_MAP[k];
    if (!keyInfo) return { top: '', bottom: '' };

    const isSpace = k === ' ';
    const isShift = k === 'ShiftLeft' || k === 'ShiftRight';
    const isEnter = k === 'Enter';

    if (isSpace) return { top: '', bottom: '스페이스' };
    if (isShift) return { top: 'Shift', bottom: '' };
    if (isEnter) return { top: 'Enter', bottom: '' };

    const top = keyInfo.hangul || '';
    let bottom = (keyInfo.eng || k).toUpperCase();

    if (keyInfo.shiftHangul && keyInfo.shiftHangul !== keyInfo.hangul) {
      bottom = keyInfo.shiftHangul;
    } else if (keyInfo.shiftEng && keyInfo.shiftEng !== keyInfo.eng) {
      bottom = keyInfo.shiftEng;
    }

    return { top, bottom };
  }

  // 가상 키보드 HTML 구조 동적 생성 및 클릭 이벤트 연동
  renderVirtualKeyboard() {
    const kbContainer = document.getElementById('virtualKeyboard');
    if (!kbContainer) return;

    const keyboardRows = [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
      ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
      [' '] // 스페이스바
    ];

    kbContainer.innerHTML = keyboardRows.map(row => {
      const rowKeysHtml = row.map(k => {
        const keyInfo = window.KEYBOARD_MAP[k];
        if (!keyInfo) return '';

        const fingerId = keyInfo.finger ? keyInfo.finger.id : '';
        const isSpace = k === ' ';
        const isShift = k === 'ShiftLeft' || k === 'ShiftRight';
        const isEnter = k === 'Enter';
        const spaceClass = isSpace ? 'space-key' : (isShift ? 'shift-key' : (isEnter ? 'enter-key' : ''));

        const labels = this.getKeyDisplayLabels(k);

        return `
          <div class="key-cap ${spaceClass}" id="keycap-${k}" data-key="${k}" data-finger="${fingerId}">
            <span class="key-hangul">${labels.top}</span>
            <span class="key-eng">${labels.bottom}</span>
          </div>
        `;
      }).join('');

      return `<div class="kb-row">${rowKeysHtml}</div>`;
    }).join('');

    // 가상 키보드 마우스/터치 클릭 이벤트 연결
    kbContainer.querySelectorAll('.key-cap').forEach(cap => {
      cap.addEventListener('click', (e) => {
        const keyVal = e.currentTarget.dataset.key;

        // 마우스/터치 클릭 시 시각적 피드백 효과
        const capEl = e.currentTarget;
        capEl.classList.add('pressed');
        setTimeout(() => capEl.classList.remove('pressed'), 150);

        if (keyVal === 'ShiftLeft' || keyVal === 'ShiftRight') {
          this.isShiftPressed = !this.isShiftPressed;
          this.updateKeyboardShiftState();
        } else if (keyVal === 'Enter') {
          if (this.currentMode === 'longSentence') {
            this.handleLongSentenceEnter();
          } else {
            this.handleKeyDown({ key: 'Enter', preventDefault: () => {} });
          }
        } else if (keyVal) {
          const keyInfo = window.KEYBOARD_MAP[keyVal];
          let actualKey = keyVal;
          if (this.isShiftPressed && keyInfo) {
            actualKey = keyInfo.shiftHangul || keyInfo.shiftEng || keyVal;
          }

          if (this.currentMode === 'longSentence') {
            const inputEl = document.getElementById('longTypingInput');
            if (inputEl) {
              let charToAppend = keyInfo ? (keyInfo.hangul || keyInfo.eng) : keyVal;
              if (this.isShiftPressed && keyInfo && keyInfo.shiftHangul) {
                charToAppend = keyInfo.shiftHangul;
              }
              if (charToAppend) {
                inputEl.value += charToAppend;
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));
              }
              inputEl.focus();
            }
          } else if (this.currentMode === 'balloon') {
            if (this.balloonGame) {
              this.balloonGame.handleKeyPress(actualKey);
            }
          } else {
            this.handleKeyDown({ key: actualKey, preventDefault: () => {} });
          }
        }
      });
    });
  }

  updateKeyboardShiftState() {
    const kbContainer = document.getElementById('virtualKeyboard');
    if (!kbContainer) return;

    kbContainer.querySelectorAll('.key-cap').forEach(cap => {
      const k = cap.dataset.key;
      const keyInfo = window.KEYBOARD_MAP[k];
      if (!keyInfo) return;

      const isShift = k === 'ShiftLeft' || k === 'ShiftRight';

      if (isShift) {
        cap.classList.toggle('pressed', this.isShiftPressed);
      } else {
        cap.classList.toggle('shift-active', this.isShiftPressed);
      }
    });
  }

  // 이벤트 바인딩
  bindEvents() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // 모드 선택 탭 버튼
    document.querySelectorAll('.mode-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.setMode(mode);
      });
    });

    // 풍선 게임 단계 네비게이션 버튼
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lvl = parseInt(e.currentTarget.dataset.level, 10);
        document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        if (this.balloonGame) {
          this.balloonGame.setLevel(lvl);
        }
      });
    });

    // 헤더 유틸리티 버튼들
    const soundToggle = document.getElementById('btnSoundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.speechEnabled = !this.speechEnabled;
        window.soundSystem.speechEnabled = this.speechEnabled;
        window.soundSystem.soundEnabled = this.speechEnabled;
        soundToggle.classList.toggle('active', this.speechEnabled);
        soundToggle.innerHTML = this.speechEnabled ? '🔊 소리' : '🔇 소리 끔';
        if (this.speechEnabled) {
          window.soundSystem.speak('소리를 켰어요');
        }
      });
    }

    const contrastToggle = document.getElementById('btnContrastToggle');
    if (contrastToggle) {
      contrastToggle.addEventListener('click', () => {
        this.highContrast = !this.highContrast;
        document.body.classList.toggle('high-contrast', this.highContrast);
        contrastToggle.classList.toggle('active', this.highContrast);
      });
    }

    const fontToggle = document.getElementById('btnFontToggle');
    if (fontToggle) {
      fontToggle.addEventListener('click', () => {
        this.largeFont = !this.largeFont;
        document.body.classList.toggle('font-xl', this.largeFont);
        fontToggle.classList.toggle('active', this.largeFont);
      });
    }

    // PWA 앱 설치 버튼 및 모달
    const btnInstall = document.getElementById('btnInstallApp');
    if (btnInstall) {
      btnInstall.addEventListener('click', () => {
        const promptEvent = this.deferredPrompt || window.deferredPwaPrompt;
        if (promptEvent) {
          promptEvent.prompt();
          promptEvent.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              this.deferredPrompt = null;
              window.deferredPwaPrompt = null;
            }
          });
        } else {
          const installModal = document.getElementById('installGuideModal');
          if (installModal) installModal.classList.add('active');
        }
      });
    }

    const btnCloseInstall = document.getElementById('btnCloseInstallModal');
    if (btnCloseInstall) {
      btnCloseInstall.addEventListener('click', () => {
        const installModal = document.getElementById('installGuideModal');
        if (installModal) installModal.classList.remove('active');
      });
    }

    // 스티커 앨범 모달
    const btnAlbum = document.getElementById('btnStickerAlbum');
    if (btnAlbum) {
      btnAlbum.addEventListener('click', () => this.openStickerAlbum());
    }

    const btnCloseModal = document.getElementById('btnCloseModal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        document.getElementById('stickerModal').classList.remove('active');
      });
    }

    // 긴 문장 전용 대형 입력 박스 이벤트
    const longInput = document.getElementById('longTypingInput');
    if (longInput) {
      longInput.addEventListener('input', (e) => this.handleLongSentenceInput(e));
      longInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleLongSentenceEnter();
        }
      });
    }
  }

  // 학습 모드 변경
  setMode(mode) {
    this.currentMode = mode;
    this.lessonIndex = 0;
    this.itemIndex = 0;

    document.querySelectorAll('.mode-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    const compactCard = document.getElementById('practiceCardCompact');
    const longSec = document.getElementById('longSentenceSection');
    const gameSec = document.getElementById('gameSection');
    const topContentArea = document.getElementById('topContentArea');

    if (mode === 'balloon') {
      if (compactCard) compactCard.style.display = 'none';
      if (longSec) longSec.style.display = 'none';
      if (gameSec) gameSec.style.display = 'flex';
      if (topContentArea) topContentArea.classList.add('game-mode');
      this.startBalloonGame();
    } else if (mode === 'longSentence') {
      if (compactCard) compactCard.style.display = 'none';
      if (longSec) longSec.style.display = 'flex';
      if (gameSec) gameSec.style.display = 'none';
      if (topContentArea) topContentArea.classList.remove('game-mode');
      if (this.balloonGame) this.balloonGame.stop();
      this.loadCurrentTarget();
    } else {
      if (compactCard) compactCard.style.display = 'flex';
      if (longSec) longSec.style.display = 'none';
      if (gameSec) gameSec.style.display = 'none';
      if (topContentArea) topContentArea.classList.remove('game-mode');
      if (this.balloonGame) this.balloonGame.stop();
      this.loadCurrentTarget();
    }
  }

  loadCurrentTarget() {
    let emoji = '⭐️';
    let wordText = '';
    let desc = '';

    const compactCard = document.getElementById('practiceCardCompact');
    const longSec = document.getElementById('longSentenceSection');
    const longInput = document.getElementById('longTypingInput');

    if (this.currentMode === 'longSentence') {
      if (compactCard) compactCard.style.display = 'none';
      if (longSec) longSec.style.display = 'flex';

      if (longInput) {
        longInput.value = '';
        setTimeout(() => longInput.focus(), 100);
      }
      this.freeTypingStartTime = null;

      const speedEl = document.getElementById('longSpeed');
      const accEl = document.getElementById('longAccuracy');
      if (speedEl) speedEl.textContent = '0';
      if (accEl) accEl.textContent = '100';

      const totalItems = window.LONG_SENTENCE_LESSONS.length;
      const curItemIdx = (this.itemIndex % totalItems) + 1;
      const numEl = document.getElementById('longSentenceNum');
      const totEl = document.getElementById('longSentenceTotal');
      if (numEl) numEl.textContent = curItemIdx;
      if (totEl) totEl.textContent = totalItems;

      const item = window.LONG_SENTENCE_LESSONS[this.itemIndex % totalItems];
      wordText = item.text;
      emoji = item.emoji;

      const longEmojiEl = document.getElementById('longTargetEmoji');
      const longDisplayEl = document.getElementById('longSentenceDisplay');
      if (longEmojiEl) longEmojiEl.textContent = emoji;
      if (longDisplayEl) {
        longDisplayEl.innerHTML = Array.from(wordText).map((char, i) => {
          let cls = 'word-char';
          if (char === ' ') cls += ' space-char';
          if (i === 0) cls += ' current';
          const displayChar = char === ' ' ? '&nbsp;' : char;
          return `<span class="${cls}">${displayChar}</span>`;
        }).join('');
      }

      this.targetText = wordText;
      this.updateLongSentenceHighlight();

      if (this.speechEnabled) {
        window.soundSystem.speak(wordText);
      }
      return;
    } else {
      if (compactCard) compactCard.style.display = 'flex';
      if (longSec) longSec.style.display = 'none';
    }

    if (this.currentMode === 'basic') {
      const lesson = window.BASIC_LESSONS[this.lessonIndex];
      wordText = lesson.items[this.itemIndex % lesson.items.length];
      desc = lesson.desc;
      emoji = '⌨️';
    } else if (this.currentMode === 'word') {
      const item = window.WORD_LESSONS[this.itemIndex % window.WORD_LESSONS.length];
      wordText = item.word;
      emoji = item.emoji;
      desc = item.desc;
    } else if (this.currentMode === 'sentence') {
      const item = window.SENTENCE_LESSONS[this.itemIndex % window.SENTENCE_LESSONS.length];
      wordText = item.text;
      emoji = item.emoji;
      desc = '천천히 한 글자씩 쳐보아요!';
    }

    this.targetText = wordText;
    this.userTypedChars = '';
    this.currentKeyIdx = 0;

    this.targetKeys = [];
    for (let char of wordText) {
      const keys = window.decomposeSyllableToKeys(char);
      this.targetKeys.push(...keys);
    }

    this.updatePracticeUI(emoji, desc);
    this.updateTargetHighlight();

    if (this.speechEnabled) {
      window.soundSystem.speak(wordText);
    }
  }

  updatePracticeUI(emoji, desc) {
    const emojiEl = document.getElementById('targetEmoji');
    const descEl = document.getElementById('targetDesc');

    if (emojiEl) emojiEl.textContent = emoji;
    if (descEl) descEl.textContent = desc;

    this.updatePracticeWordDisplay();
  }

  updatePracticeWordDisplay() {
    const wordEl = document.getElementById('targetWordDisplay');
    if (!wordEl || !this.targetText) return;

    let keyAccumulator = 0;
    wordEl.innerHTML = Array.from(this.targetText).map((char, i) => {
      const charKeys = window.decomposeSyllableToKeys(char);
      const charKeyLen = charKeys.length;
      const charEndKeyIdx = keyAccumulator + charKeyLen;

      let cls = 'word-char';
      if (char === ' ') cls += ' space-char';

      if (this.currentKeyIdx >= charEndKeyIdx) {
        cls += ' completed';
      } else if (this.currentKeyIdx >= keyAccumulator) {
        cls += ' current';
      }

      keyAccumulator = charEndKeyIdx;
      const displayChar = char === ' ' ? '&nbsp;' : char;
      return `<span class="${cls}">${displayChar}</span>`;
    }).join('');
  }

  updateTargetHighlight() {
    document.querySelectorAll('.key-cap.target-key').forEach(el => {
      el.classList.remove('target-key');
    });

    this.updatePracticeWordDisplay();

    if (this.currentKeyIdx >= this.targetKeys.length) {
      this.onItemCompleted();
      return;
    }

    const nextKey = this.targetKeys[this.currentKeyIdx];
    const keyInfo = window.KEYBOARD_MAP[nextKey] || window.KEYBOARD_MAP[nextKey.toLowerCase()];

    if (keyInfo) {
      const targetCapId = keyInfo.baseKey || (nextKey === 'Enter' ? 'Enter' : (nextKey === 'ShiftLeft' || nextKey === 'ShiftRight' ? nextKey : nextKey.toLowerCase()));
      const keyCapEl = document.getElementById(`keycap-${targetCapId}`);
      if (keyCapEl) keyCapEl.classList.add('target-key');

      if (keyInfo.isShift) {
        const shiftId = keyInfo.shiftSide === 'right' ? 'ShiftLeft' : 'ShiftRight';
        const shiftCapEl = document.getElementById(`keycap-${shiftId}`);
        if (shiftCapEl) shiftCapEl.classList.add('target-key');
      }

      if (this.handsRenderer) {
        const charRepresentation = keyInfo.hangul || keyInfo.eng.toUpperCase();
        this.handsRenderer.highlightFinger(keyInfo.finger, charRepresentation);
      }

      const decompBar = document.getElementById('keyDecompositionBar');
      if (decompBar) {
        const charRepresentation = keyInfo.hangul || keyInfo.eng.toUpperCase();
        const shiftText = keyInfo.isShift ? ' (Shift 조합)' : '';
        decompBar.innerHTML = `다음 누를 키: <span class="next-key-tag">${charRepresentation}</span> (${keyInfo.finger.name}${shiftText})`;
      }
    }
  }

  updateLongSentenceHighlight() {
    document.querySelectorAll('.key-cap.target-key').forEach(el => {
      el.classList.remove('target-key');
    });

    if (this.currentMode !== 'longSentence') return;

    const inputEl = document.getElementById('longTypingInput');
    const typedText = inputEl ? inputEl.value : '';
    const targetText = this.targetText || '';

    let nextKey = null;
    let charRep = '';

    if (typedText.length >= targetText.length) {
      nextKey = 'Enter';
      charRep = 'Enter';
    } else {
      let idx = 0;
      while (idx < typedText.length && idx < targetText.length && typedText[idx] === targetText[idx]) {
        idx++;
      }

      if (idx >= targetText.length) {
        nextKey = 'Enter';
        charRep = 'Enter';
      } else {
        const targetChar = targetText[idx];
        if (targetChar === ' ') {
          nextKey = ' ';
          charRep = '스페이스';
        } else {
          const targetJamos = window.decomposeSyllableToKeys(targetChar);
          const typedChar = typedText[idx] || '';
          if (!typedChar) {
            nextKey = targetJamos[0];
          } else {
            const typedJamos = window.decomposeSyllableToKeys(typedChar);
            let matchCount = 0;
            for (let j = 0; j < typedJamos.length && j < targetJamos.length; j++) {
              if (typedJamos[j] === targetJamos[j]) {
                matchCount++;
              } else {
                break;
              }
            }
            const nextJamoIdx = Math.min(matchCount, targetJamos.length - 1);
            nextKey = targetJamos[nextJamoIdx];
          }
          if (nextKey) {
            const keyInfo = window.KEYBOARD_MAP[nextKey] || window.KEYBOARD_MAP[nextKey.toLowerCase()];
            charRep = keyInfo ? (keyInfo.hangul || keyInfo.eng.toUpperCase()) : nextKey;
          }
        }
      }
    }

    if (nextKey) {
      const keyInfo = window.KEYBOARD_MAP[nextKey] || window.KEYBOARD_MAP[nextKey.toLowerCase()];
      if (keyInfo) {
        const targetCapId = keyInfo.baseKey || (nextKey === 'Enter' ? 'Enter' : (nextKey === 'ShiftLeft' || nextKey === 'ShiftRight' ? nextKey : nextKey.toLowerCase()));
        const keyCapEl = document.getElementById(`keycap-${targetCapId}`);
        if (keyCapEl) keyCapEl.classList.add('target-key');

        if (keyInfo.isShift) {
          const shiftId = keyInfo.shiftSide === 'right' ? 'ShiftLeft' : 'ShiftRight';
          const shiftCapEl = document.getElementById(`keycap-${shiftId}`);
          if (shiftCapEl) shiftCapEl.classList.add('target-key');
        }

        if (this.handsRenderer) {
          this.handsRenderer.highlightFinger(keyInfo.finger, charRep);
        }
      }
    }
  }

  handleLongSentenceInput(e) {
    if (this.currentMode !== 'longSentence') return;

    if (!this.freeTypingStartTime) {
      this.freeTypingStartTime = Date.now();
    }

    const typedText = e.target.value;
    const targetText = this.targetText;

    const longDisplayEl = document.getElementById('longSentenceDisplay');
    if (longDisplayEl) {
      let correctCount = 0;
      longDisplayEl.innerHTML = Array.from(targetText).map((char, i) => {
        let cls = 'word-char';
        if (char === ' ') cls += ' space-char';

        if (i < typedText.length) {
          if (typedText[i] === char) {
            cls += ' completed';
            correctCount++;
          } else {
            cls += ' incorrect';
          }
        } else if (i === typedText.length) {
          cls += ' current';
        }
        const displayChar = char === ' ' ? '&nbsp;' : char;
        return `<span class="${cls}">${displayChar}</span>`;
      }).join('');

      const elapsedMin = Math.max((Date.now() - this.freeTypingStartTime) / 60000, 0.005);
      const speed = Math.round(typedText.length / elapsedMin);
      const accuracy = typedText.length > 0 ? Math.round((correctCount / typedText.length) * 100) : 100;

      const speedEl = document.getElementById('longSpeed');
      const accEl = document.getElementById('longAccuracy');
      if (speedEl) speedEl.textContent = isNaN(speed) ? 0 : Math.min(speed, 999);
      if (accEl) accEl.textContent = isNaN(accuracy) ? 100 : Math.min(accuracy, 100);
    }

    this.updateLongSentenceHighlight();
  }

  handleLongSentenceEnter() {
    if (this.currentMode !== 'longSentence') return;
    const inputEl = document.getElementById('longTypingInput');
    if (!inputEl) return;

    const typedText = inputEl.value.trim();
    if (typedText.length === 0) return;

    window.soundSystem.playCorrect();
    this.score += 20;
    this.updateStatsUI();
    this.checkStickerUnlocks();

    inputEl.value = '';
    this.freeTypingStartTime = null;

    setTimeout(() => {
      this.itemIndex++;
      this.loadCurrentTarget();
      if (inputEl) inputEl.focus();
    }, 400);
  }

  handleKeyDown(e) {
    if (e.key === 'Shift') {
      this.isShiftPressed = true;
      this.updateKeyboardShiftState();
    }

    if (e.key === ' ' && document.activeElement !== document.getElementById('longTypingInput')) {
      e.preventDefault();
    }

    const rawKey = e.key;
    const pressedKeyLower = rawKey.toLowerCase();
    const keyInfo = window.KEYBOARD_MAP[rawKey] || window.KEYBOARD_MAP[pressedKeyLower];
    const capId = (rawKey === 'Enter') ? 'Enter' : (keyInfo ? (keyInfo.baseKey || (rawKey === 'ShiftLeft' || rawKey === 'ShiftRight' ? rawKey : pressedKeyLower)) : pressedKeyLower);
    const keyCapEl = document.getElementById(`keycap-${capId}`);

    if (keyCapEl) {
      keyCapEl.classList.add('pressed');
    }

    if (this.currentMode === 'balloon') {
      if (this.balloonGame) this.balloonGame.handleKeyPress(e);
      return;
    }

    if (this.currentMode === 'longSentence') {
      return;
    }

    if (this.currentKeyIdx < this.targetKeys.length) {
      const expectedKey = this.targetKeys[this.currentKeyIdx];
      const expectedLower = expectedKey.toLowerCase();

      if (rawKey === expectedKey || pressedKeyLower === expectedLower || (keyInfo && (keyInfo.hangul === expectedKey || keyInfo.shiftHangul === expectedKey))) {
        window.soundSystem.playKeyPop();
        this.currentKeyIdx++;
        this.streak++;
        this.totalTyped++;

        this.updateTargetHighlight();
      } else {
        window.soundSystem.playError();
        this.streak = 0;
      }
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Shift') {
      this.isShiftPressed = false;
      this.updateKeyboardShiftState();
    }

    const rawKey = e.key;
    const pressedKeyLower = rawKey.toLowerCase();
    const keyInfo = window.KEYBOARD_MAP[rawKey] || window.KEYBOARD_MAP[pressedKeyLower];
    const capId = (rawKey === 'Enter') ? 'Enter' : (keyInfo ? (keyInfo.baseKey || (rawKey === 'ShiftLeft' || rawKey === 'ShiftRight' ? rawKey : pressedKeyLower)) : pressedKeyLower);
    const keyCapEl = document.getElementById(`keycap-${capId}`);
    if (keyCapEl) {
      keyCapEl.classList.remove('pressed');
    }
  }

  onItemCompleted() {
    window.soundSystem.playCorrect();
    this.score += 10;
    this.updateStatsUI();
    this.checkStickerUnlocks();

    setTimeout(() => {
      this.itemIndex++;
      this.loadCurrentTarget();
    }, 400);
  }

  updateStatsUI() {
    const scoreEl = document.getElementById('statScore');
    const streakEl = document.getElementById('statStreak');
    const fillEl = document.getElementById('progressFill');

    if (scoreEl) scoreEl.textContent = this.score;
    if (streakEl) streakEl.textContent = this.streak;

    if (fillEl) {
      const progressPercent = Math.min(100, (this.score / 200) * 100);
      fillEl.style.width = `${progressPercent}%`;
    }
  }

  checkStickerUnlocks() {
    const stickers = window.STICKER_ALBUM;
    let newUnlocked = false;

    if (this.totalTyped >= 10 && !stickers[1].unlocked) {
      stickers[1].unlocked = true; newUnlocked = true;
    }
    if (this.score >= 50 && !stickers[3].unlocked) {
      stickers[3].unlocked = true; newUnlocked = true;
    }
    if (this.streak >= 5 && !stickers[6].unlocked) {
      stickers[6].unlocked = true; newUnlocked = true;
    }

    if (newUnlocked && this.speechEnabled) {
      window.soundSystem.playFanfare();
    }
  }

  openStickerAlbum() {
    const modal = document.getElementById('stickerModal');
    const grid = document.getElementById('stickerGrid');
    if (!modal || !grid) return;

    grid.innerHTML = window.STICKER_ALBUM.map(stk => `
      <div class="sticker-item ${stk.unlocked ? 'unlocked' : ''}">
        <span class="sticker-emoji">${stk.emoji}</span>
        <span class="sticker-name">${stk.name}</span>
      </div>
    `).join('');

    modal.classList.add('active');
  }

  startBalloonGame() {
    if (!this.balloonGame) {
      this.balloonGame = new BalloonGameManager('gameCanvasWrapper');
    }
    this.balloonGame.start();
  }
}

/**
 * 풍선 객체 클래스 (음절 및 키 입력 진행도 동적 관리)
 */
class BalloonObj {
  constructor(word, color, posX, parentEl) {
    this.word = word; // 예: '가', '사과', '잘했어요'
    this.syllables = Array.from(word); // 예: ['사', '과']
    this.currentSyllableIdx = 0;
    this.currentJamoKeys = [];
    this.currentJamoProgress = 0;

    this.bottom = -110;
    this.speed = 0.9 + Math.random() * 0.7;

    this.updateTargetJamoKeys();

    this.el = document.createElement('div');
    this.el.className = 'game-balloon';
    this.el.style.backgroundColor = color;
    this.el.style.left = `${posX}px`;
    this.el.style.bottom = '-110px';
    
    this.updateHTML();
    this.el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.tajaApp && window.tajaApp.balloonGame) {
        window.tajaApp.balloonGame.handleKeyPress(this.word);
      }
    });
    parentEl.appendChild(this.el);
  }

  updateTargetJamoKeys() {
    if (this.currentSyllableIdx < this.syllables.length) {
      const curChar = this.syllables[this.currentSyllableIdx];
      this.currentJamoKeys = window.decomposeSyllableToKeys(curChar);
      this.currentJamoProgress = 0;
    }
  }

  updateHTML() {
    const typedStr = this.syllables.slice(0, this.currentSyllableIdx).join('');
    const remainStr = this.syllables.slice(this.currentSyllableIdx).join('');

    if (typedStr) {
      this.el.innerHTML = `<span class="typed-char">${typedStr}</span>${remainStr}`;
    } else {
      this.el.textContent = this.word;
    }
  }

  // 키 입력 매칭 검사
  tryMatchKey(inputKey) {
    if (this.currentSyllableIdx >= this.syllables.length) {
      return { hit: true, finished: true };
    }

    const targetChar = this.syllables[this.currentSyllableIdx]; // 예: '사'
    const lowerInput = inputKey.toLowerCase();
    const keyInfo = window.KEYBOARD_MAP[lowerInput];

    const possibleInputs = new Set([inputKey, lowerInput]);
    if (keyInfo && keyInfo.hangul) possibleInputs.add(keyInfo.hangul);

    // 1. 완성형 음절 자체 일치 (예: '사' 또는 '가')
    if (possibleInputs.has(targetChar)) {
      this.currentSyllableIdx++;
      this.updateTargetJamoKeys();
      this.updateHTML();
      return { hit: true, finished: this.currentSyllableIdx >= this.syllables.length };
    }

    // 2. 자소 키 단계별 일치 (예: '사'의 첫 키 'ㅅ' -> 't')
    if (this.currentJamoProgress < this.currentJamoKeys.length) {
      const expectedKey = this.currentJamoKeys[this.currentJamoProgress].toLowerCase();
      const expectedInfo = window.KEYBOARD_MAP[expectedKey];
      const expectedHangul = expectedInfo ? expectedInfo.hangul : '';

      if (possibleInputs.has(expectedKey) || (expectedHangul && possibleInputs.has(expectedHangul))) {
        this.currentJamoProgress++;

        // 현재 음절의 모든 자소 입력 완료 시 다음 음절로 전진!
        if (this.currentJamoProgress >= this.currentJamoKeys.length) {
          this.currentSyllableIdx++;
          this.updateTargetJamoKeys();
          this.updateHTML();
        }
        return { hit: true, finished: this.currentSyllableIdx >= this.syllables.length };
      }
    }

    return { hit: false, finished: false };
  }
}

/**
 * 4단계 풍선 터뜨리기 타자 게임 관리자
 */
class BalloonGameManager {
  constructor(canvasWrapperId) {
    this.wrapper = document.getElementById(canvasWrapperId);
    this.balloons = [];
    this.timer = null;
    this.score = 0;
    this.popCount = 0;
    this.isRunning = false;
    this.currentLevel = 1;
  }

  setLevel(lvl) {
    this.currentLevel = lvl;
    if (this.isRunning) {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.wrapper.innerHTML = `
      <div class="game-hud-overlay">
        <div class="hud-item score-hud">⭐ 점수: <span id="gameScore">${this.score}</span>점</div>
        <div class="hud-item pop-hud">🎈 터뜨린 풍선: <span id="gamePopCount">${this.popCount}</span>개</div>
      </div>
    `;
    this.balloons = [];

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.spawnBalloon(), 2500);

    this.spawnBalloon();
    this.updateTargetHighlight();
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearInterval(this.timer);
    this.wrapper.innerHTML = '';
    this.balloons = [];
    document.querySelectorAll('.key-cap.target-key').forEach(el => el.classList.remove('target-key'));
    if (window.tajaApp && window.tajaApp.handsRenderer) {
      window.tajaApp.handsRenderer.highlightFinger(null);
    }
  }

  updateGameHUD() {
    const scoreEl = document.getElementById('gameScore');
    const popEl = document.getElementById('gamePopCount');

    if (scoreEl) scoreEl.textContent = this.score;
    if (popEl) popEl.textContent = this.popCount;

    if (window.tajaApp) {
      window.tajaApp.score = Math.max(window.tajaApp.score, this.score);
      window.tajaApp.updateStatsUI();
    }
  }

  updateTargetHighlight() {
    if (!window.tajaApp || window.tajaApp.currentMode !== 'balloon') return;

    document.querySelectorAll('.key-cap.target-key').forEach(el => {
      el.classList.remove('target-key');
    });

    if (!this.isRunning || this.balloons.length === 0) {
      if (window.tajaApp.handsRenderer) {
        window.tajaApp.handsRenderer.highlightFinger(null);
      }
      return;
    }

    // 입력 중인 풍선을 최우선 강조, 없으면 가장 높이(위쪽으로) 올라온 풍선 강조
    let activeBalloon = this.balloons.find(b => b.currentSyllableIdx > 0 || b.currentJamoProgress > 0);
    if (!activeBalloon) {
      activeBalloon = [...this.balloons].sort((a, b) => b.bottom - a.bottom)[0];
    }

    if (!activeBalloon) return;

    let targetKey = null;
    let charRep = '';

    if (activeBalloon.currentJamoProgress < activeBalloon.currentJamoKeys.length) {
      targetKey = activeBalloon.currentJamoKeys[activeBalloon.currentJamoProgress];
    } else if (activeBalloon.currentSyllableIdx < activeBalloon.syllables.length) {
      const curChar = activeBalloon.syllables[activeBalloon.currentSyllableIdx];
      const jamos = window.decomposeSyllableToKeys(curChar);
      if (jamos.length > 0) targetKey = jamos[0];
    }

    if (targetKey) {
      const keyInfo = window.KEYBOARD_MAP[targetKey] || window.KEYBOARD_MAP[targetKey.toLowerCase()];
      if (keyInfo) {
        charRep = keyInfo.hangul || keyInfo.eng.toUpperCase();
        const targetCapId = keyInfo.baseKey || (targetKey === 'Enter' ? 'Enter' : (targetKey === 'ShiftLeft' || targetKey === 'ShiftRight' ? targetKey : targetKey.toLowerCase()));
        const keyCapEl = document.getElementById(`keycap-${targetCapId}`);
        if (keyCapEl) keyCapEl.classList.add('target-key');

        if (keyInfo.isShift) {
          const shiftId = keyInfo.shiftSide === 'right' ? 'ShiftLeft' : 'ShiftRight';
          const shiftCapEl = document.getElementById(`keycap-${shiftId}`);
          if (shiftCapEl) shiftCapEl.classList.add('target-key');
        }

        if (window.tajaApp.handsRenderer) {
          window.tajaApp.handsRenderer.highlightFinger(keyInfo.finger, `${activeBalloon.word} (풍선: ${charRep})`);
        }
      }
    }
  }

  spawnBalloon() {
    if (!this.isRunning) return;

    const levelData = window.BALLOON_LEVELS[this.currentLevel - 1] || window.BALLOON_LEVELS[0];
    const items = levelData.items;
    const randomWord = items[Math.floor(Math.random() * items.length)];
    
    const colors = ['#FF7675', '#74B9FF', '#55E6C1', '#FDCB6E', '#A29BFE', '#FD79A8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const posX = Math.random() * (this.wrapper.clientWidth - 140) + 10;
    const balloonObj = new BalloonObj(randomWord, randomColor, posX, this.wrapper);

    this.balloons.push(balloonObj);
    this.animateBalloon(balloonObj);
    this.updateTargetHighlight();
  }

  animateBalloon(bObj) {
    const step = () => {
      if (!this.isRunning || !bObj.el.parentNode) return;

      bObj.bottom += bObj.speed;
      bObj.el.style.bottom = `${bObj.bottom}px`;

      if (bObj.bottom > this.wrapper.clientHeight + 100) {
        if (bObj.el.parentNode) bObj.el.parentNode.removeChild(bObj.el);
        this.balloons = this.balloons.filter(b => b !== bObj);
        this.updateTargetHighlight();
      } else {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  handleKeyPress(keyEvent) {
    if (!this.isRunning || this.balloons.length === 0) return;

    const rawKey = (typeof keyEvent === 'object' && keyEvent.key) ? keyEvent.key : String(keyEvent);
    if (!rawKey) return;

    // 높이순(가장 위쪽에 위험하게 올라온 풍선부터) 정렬
    const sortedBalloons = this.balloons
      .map((b, idx) => ({ b, idx }))
      .sort((a, b) => b.b.bottom - a.b.bottom);

    let matchedIdx = -1;
    let isFinished = false;

    for (let item of sortedBalloons) {
      const result = item.b.tryMatchKey(rawKey);
      if (result.hit) {
        matchedIdx = item.idx;
        isFinished = result.finished;
        break;
      }
    }

    if (matchedIdx !== -1) {
      const bObj = this.balloons[matchedIdx];

      if (isFinished) {
        // 풍선 완벽 터뜨리기 정답! (마지막 글자 색상 변화 적용 후 팝 애니메이션)
        bObj.updateHTML();
        window.soundSystem.playBalloonPop();

        bObj.el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        bObj.el.style.transform = 'scale(1.4)';
        bObj.el.style.opacity = '0';

        setTimeout(() => {
          if (bObj.el && bObj.el.parentNode) bObj.el.parentNode.removeChild(bObj.el);
        }, 200);

        this.balloons.splice(matchedIdx, 1);
        this.score += 10;
        this.popCount += 1;
        
        this.updateGameHUD();

        if (window.soundSystem.speechEnabled) {
          window.soundSystem.speak(bObj.word);
        }
      } else {
        // 단어/문장 입력 진행 중 기분 좋은 톡 효과음
        window.soundSystem.playKeyPop();
      }

      this.updateTargetHighlight();
    } else {
      // 불일치 키 오답 처리
      window.soundSystem.playError();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.tajaApp = new TajaApp();
});
