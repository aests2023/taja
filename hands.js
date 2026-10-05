/**
 * 자판 일체형 손모양 SVG 렌더러 및 핑거 하이라이트 제어
 * - 왼손/오른손이 키보드 바로 옆 수직 배치되어 키 위치를 직관적으로 지도
 * - 입력할 손가락만 선명하게 발광 강조 (비활성 손가락은 중립 은은한 색상)
 * - 뷰포트 여백(viewBox -22) 확답으로 5손가락 마디 잘림 현상 100% 해결
 */

class HandsGuideRenderer {
  constructor(leftContainerId, rightContainerId, labelId) {
    this.leftContainer = document.getElementById(leftContainerId);
    this.rightContainer = document.getElementById(rightContainerId);
    this.labelContainer = document.getElementById(labelId);
    this.activeFingerId = null;

    this.render();
  }

  // 왼손 및 오른손 SVG 개별 렌더링 (viewBox 여백 넉넉히 확보로 5손가락 원형 완벽 보존)
  render() {
    if (this.leftContainer) {
      this.leftContainer.innerHTML = `
        <svg class="hand-svg-mini" viewBox="0 -22 250 230" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <!-- 손바닥 -->
          <path d="M 65 115 Q 55 195 125 200 Q 195 195 185 115 Q 185 90 165 90 L 85 90 Q 65 90 65 115 Z" 
                fill="#FFF8F3" stroke="#FFE0CF" stroke-width="3.5"/>

          <!-- 왼손 1. 새끼손가락 (L_PINKY) -->
          <g class="finger-group" id="finger-L_PINKY" data-finger="L_PINKY">
            <rect class="finger-body" x="25" y="70" width="26" height="65" rx="13" transform="rotate(-16 38 102)"/>
            <circle class="finger-tip" cx="28" cy="58" r="13"/>
            <text class="finger-label" x="28" y="62" text-anchor="middle">새끼</text>
          </g>

          <!-- 왼손 2. 약지손가락 (L_RING) -->
          <g class="finger-group" id="finger-L_RING" data-finger="L_RING">
            <rect class="finger-body" x="66" y="25" width="28" height="85" rx="14"/>
            <circle class="finger-tip" cx="80" cy="14" r="14"/>
            <text class="finger-label" x="80" y="18" text-anchor="middle">약지</text>
          </g>

          <!-- 왼손 3. 중지손가락 (L_MIDDLE) -->
          <g class="finger-group" id="finger-L_MIDDLE" data-finger="L_MIDDLE">
            <rect class="finger-body" x="106" y="10" width="28" height="98" rx="14"/>
            <circle class="finger-tip" cx="120" cy="0" r="14"/>
            <text class="finger-label" x="120" y="4" text-anchor="middle">중지</text>
          </g>

          <!-- 왼손 4. 검지손가락 (L_INDEX) -->
          <g class="finger-group" id="finger-L_INDEX" data-finger="L_INDEX">
            <rect class="finger-body" x="146" y="28" width="28" height="82" rx="14"/>
            <circle class="finger-tip" cx="160" cy="16" r="14"/>
            <text class="finger-label" x="160" y="20" text-anchor="middle">검지</text>
          </g>

          <!-- 왼손 5. 엄지손가락 (THUMB - 왼쪽) -->
          <g class="finger-group" id="finger-THUMB-L" data-finger="THUMB">
            <rect class="finger-body" x="170" y="105" width="28" height="60" rx="14" transform="rotate(38 184 135)"/>
            <circle class="finger-tip" cx="218" cy="145" r="13"/>
            <text class="finger-label" x="218" y="149" text-anchor="middle">엄지</text>
          </g>
        </svg>
      `;
    }

    if (this.rightContainer) {
      this.rightContainer.innerHTML = `
        <svg class="hand-svg-mini" viewBox="0 -22 250 230" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <!-- 손바닥 -->
          <path d="M 65 115 Q 55 195 125 200 Q 195 195 185 115 Q 185 90 165 90 L 85 90 Q 65 90 65 115 Z" 
                fill="#FFF8F3" stroke="#FFE0CF" stroke-width="3.5"/>

          <!-- 오른손 5. 엄지손가락 (THUMB - 오른쪽) -->
          <g class="finger-group" id="finger-THUMB-R" data-finger="THUMB">
            <rect class="finger-body" x="42" y="105" width="28" height="60" rx="14" transform="rotate(-38 56 135)"/>
            <circle class="finger-tip" cx="22" cy="145" r="13"/>
            <text class="finger-label" x="22" y="149" text-anchor="middle">엄지</text>
          </g>

          <!-- 오른손 4. 검지손가락 (R_INDEX) -->
          <g class="finger-group" id="finger-R_INDEX" data-finger="R_INDEX">
            <rect class="finger-body" x="66" y="28" width="28" height="82" rx="14"/>
            <circle class="finger-tip" cx="80" cy="16" r="14"/>
            <text class="finger-label" x="80" y="20" text-anchor="middle">검지</text>
          </g>

          <!-- 오른손 3. 중지손가락 (R_MIDDLE) -->
          <g class="finger-group" id="finger-R_MIDDLE" data-finger="R_MIDDLE">
            <rect class="finger-body" x="106" y="10" width="28" height="98" rx="14"/>
            <circle class="finger-tip" cx="120" cy="0" r="14"/>
            <text class="finger-label" x="120" y="4" text-anchor="middle">중지</text>
          </g>

          <!-- 오른손 2. 약지손가락 (R_RING) -->
          <g class="finger-group" id="finger-R_RING" data-finger="R_RING">
            <rect class="finger-body" x="146" y="25" width="28" height="85" rx="14"/>
            <circle class="finger-tip" cx="160" cy="14" r="14"/>
            <text class="finger-label" x="160" y="18" text-anchor="middle">약지</text>
          </g>

          <!-- 오른손 1. 새끼손가락 (R_PINKY) -->
          <g class="finger-group" id="finger-R_PINKY" data-finger="R_PINKY">
            <rect class="finger-body" x="187" y="70" width="26" height="65" rx="13" transform="rotate(16 200 102)"/>
            <circle class="finger-tip" cx="212" cy="58" r="13"/>
            <text class="finger-label" x="212" y="62" text-anchor="middle">새끼</text>
          </g>
        </svg>
      `;
    }
  }

  // 목표 손가락만 선명하게 하이라이트 발광
  highlightFinger(fingerInfo, targetChar = '') {
    // 이전 강조 제거
    const prevActive = document.querySelectorAll('.finger-group.active-finger');
    prevActive.forEach(el => el.classList.remove('active-finger'));
    
    document.querySelectorAll('.side-hand-card').forEach(card => card.classList.remove('active-hand'));

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
