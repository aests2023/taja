/**
 * 자판 일체형 손모양 SVG 렌더러 및 핑거 하이라이트 제어
 * - 왼손/오른손이 키보드 바로 위에 개별 수직 배치되어 키 위치를 직관적으로 지도
 */

class HandsGuideRenderer {
  constructor(leftContainerId, rightContainerId, labelId) {
    this.leftContainer = document.getElementById(leftContainerId);
    this.rightContainer = document.getElementById(rightContainerId);
    this.labelContainer = document.getElementById(labelId);
    this.activeFingerId = null;

    this.render();
  }

  // 왼손 및 오른손 SVG 개별 렌더링
  render() {
    if (this.leftContainer) {
      this.leftContainer.innerHTML = `
        <svg class="hand-svg-mini" viewBox="0 0 240 210" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- 손바닥 -->
          <path d="M 60 110 Q 50 190 120 195 Q 190 190 180 110 Q 180 85 160 85 L 80 85 Q 60 85 60 110 Z" 
                fill="#FFF4EB" stroke="#FFD8BE" stroke-width="4"/>

          <!-- 왼손 1. 새끼손가락 (L_PINKY) -->
          <g class="finger-group" id="finger-L_PINKY" data-finger="L_PINKY">
            <rect x="25" y="70" width="26" height="65" rx="13" fill="#FF7675" stroke="#D63031" stroke-width="2.5" transform="rotate(-16 38 102)"/>
            <circle cx="28" cy="58" r="13" fill="#FF7675"/>
            <text x="28" y="62" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">새끼</text>
          </g>

          <!-- 왼손 2. 약지손가락 (L_RING) -->
          <g class="finger-group" id="finger-L_RING" data-finger="L_RING">
            <rect x="66" y="25" width="28" height="85" rx="14" fill="#FAB1A0" stroke="#E17055" stroke-width="2.5"/>
            <circle cx="80" cy="14" r="14" fill="#FAB1A0"/>
            <text x="80" y="18" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">약지</text>
          </g>

          <!-- 왼손 3. 중지손가락 (L_MIDDLE) -->
          <g class="finger-group" id="finger-L_MIDDLE" data-finger="L_MIDDLE">
            <rect x="106" y="10" width="28" height="98" rx="14" fill="#FFEAA7" stroke="#FDCB6E" stroke-width="2.5"/>
            <circle cx="120" cy="0" r="14" fill="#FFEAA7"/>
            <text x="120" y="4" text-anchor="middle" fill="#795548" font-weight="bold" font-size="11">중지</text>
          </g>

          <!-- 왼손 4. 검지손가락 (L_INDEX) -->
          <g class="finger-group" id="finger-L_INDEX" data-finger="L_INDEX">
            <rect x="146" y="28" width="28" height="82" rx="14" fill="#55E6C1" stroke="#00B894" stroke-width="2.5"/>
            <circle cx="160" cy="16" r="14" fill="#55E6C1"/>
            <text x="160" y="20" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">검지</text>
          </g>

          <!-- 왼손 5. 엄지손가락 (THUMB - 왼쪽) -->
          <g class="finger-group" id="finger-THUMB-L" data-finger="THUMB">
            <rect x="170" y="105" width="28" height="60" rx="14" fill="#A29BFE" stroke="#6C5CE7" stroke-width="2.5" transform="rotate(38 184 135)"/>
            <circle cx="218" cy="145" r="13" fill="#A29BFE"/>
            <text x="218" y="149" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">엄지</text>
          </g>
        </svg>
      `;
    }

    if (this.rightContainer) {
      this.rightContainer.innerHTML = `
        <svg class="hand-svg-mini" viewBox="0 0 240 210" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- 손바닥 -->
          <path d="M 60 110 Q 50 190 120 195 Q 190 190 180 110 Q 180 85 160 85 L 80 85 Q 60 85 60 110 Z" 
                fill="#FFF4EB" stroke="#FFD8BE" stroke-width="4"/>

          <!-- 오른손 5. 엄지손가락 (THUMB - 오른쪽) -->
          <g class="finger-group" id="finger-THUMB-R" data-finger="THUMB">
            <rect x="42" y="105" width="28" height="60" rx="14" fill="#A29BFE" stroke="#6C5CE7" stroke-width="2.5" transform="rotate(-38 56 135)"/>
            <circle cx="22" cy="145" r="13" fill="#A29BFE"/>
            <text x="22" y="149" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">엄지</text>
          </g>

          <!-- 오른손 4. 검지손가락 (R_INDEX) -->
          <g class="finger-group" id="finger-R_INDEX" data-finger="R_INDEX">
            <rect x="66" y="28" width="28" height="82" rx="14" fill="#74B9FF" stroke="#0984E3" stroke-width="2.5"/>
            <circle cx="80" cy="16" r="14" fill="#74B9FF"/>
            <text x="80" y="20" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">검지</text>
          </g>

          <!-- 오른손 3. 중지손가락 (R_MIDDLE) -->
          <g class="finger-group" id="finger-R_MIDDLE" data-finger="R_MIDDLE">
            <rect x="106" y="10" width="28" height="98" rx="14" fill="#0984E3" stroke="#2980B9" stroke-width="2.5"/>
            <circle cx="120" cy="0" r="14" fill="#0984E3"/>
            <text x="120" y="4" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">중지</text>
          </g>

          <!-- 오른손 2. 약지손가락 (R_RING) -->
          <g class="finger-group" id="finger-R_RING" data-finger="R_RING">
            <rect x="146" y="25" width="28" height="85" rx="14" fill="#6C5CE7" stroke="#4834D4" stroke-width="2.5"/>
            <circle cx="160" cy="14" r="14" fill="#6C5CE7"/>
            <text x="160" y="18" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">약지</text>
          </g>

          <!-- 오른손 1. 새끼손가락 (R_PINKY) -->
          <g class="finger-group" id="finger-R_PINKY" data-finger="R_PINKY">
            <rect x="187" y="70" width="26" height="65" rx="13" fill="#FD79A8" stroke="#E84393" stroke-width="2.5" transform="rotate(16 200 102)"/>
            <circle cx="212" cy="58" r="13" fill="#FD79A8"/>
            <text x="212" y="62" text-anchor="middle" fill="#FFF" font-weight="bold" font-size="11">새끼</text>
          </g>
        </svg>
      `;
    }
  }

  // 목표 손가락 강조 및 안내 업데이트
  highlightFinger(fingerInfo, targetChar = '') {
    // 이전 강조 제거
    const prevActive = document.querySelectorAll('.finger-group.active-finger');
    prevActive.forEach(el => el.classList.remove('active-finger'));
    
    document.querySelectorAll('.hand-mini-box').forEach(card => card.classList.remove('active-hand'));

    if (!fingerInfo) {
      if (this.labelContainer) {
        this.labelContainer.innerHTML = `
          <div class="finger-guide-box">
            <span class="finger-text">키보드를 눌러 타자 연습을 시작하세요! 👆</span>
          </div>
        `;
      }
      return;
    }

    this.activeFingerId = fingerInfo.id;

    // 해당 손가락 찾기
    let targetEls = [];
    if (fingerInfo.id === 'THUMB') {
      targetEls = [
        document.getElementById('finger-THUMB-L'),
        document.getElementById('finger-THUMB-R')
      ];
    } else {
      const el = document.getElementById(`finger-${fingerInfo.id}`);
      if (el) targetEls.push(el);
    }

    targetEls.forEach(el => {
      if (el) el.classList.add('active-finger');
    });

    // 해당 손 박스 강조
    const lBox = document.getElementById('leftHandCard');
    const rBox = document.getElementById('rightHandCard');

    if (fingerInfo.hand === 'left' && lBox) {
      lBox.classList.add('active-hand');
    } else if (fingerInfo.hand === 'right' && rBox) {
      rBox.classList.add('active-hand');
    } else {
      if (lBox) lBox.classList.add('active-hand');
      if (rBox) rBox.classList.add('active-hand');
    }

    // 중앙 손가락 가이드 문구
    if (this.labelContainer) {
      const fingerName = fingerInfo.name;
      const charBadge = targetChar ? `<span class="target-key-badge">${targetChar}</span>` : '';
      
      const handIcon = fingerInfo.hand === 'left' ? '👈' : (fingerInfo.hand === 'right' ? '👉' : '👇');

      this.labelContainer.innerHTML = `
        <div class="finger-guide-box" style="border-left-color: ${fingerInfo.color};">
          <span class="finger-dot" style="background-color: ${fingerInfo.color};"></span>
          <span class="finger-text">${handIcon} ${charBadge} 키는 <strong style="color: ${fingerInfo.color};">${fingerName}</strong>로 누르세요!</span>
        </div>
      `;
    }
  }
}

window.HandsGuideRenderer = HandsGuideRenderer;
