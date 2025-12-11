// 초기 데이터
let state = {
    themeColor: "#b9fbc0", // 초기 초록색
    mainTitle: "안내사항",
    titleSize: 48,
    items: [
        { title: "모집 대상", content: "연세대학교 교육과학대학 교육학부 누구나" },
        { title: "활동 기간", content: "2026년 4월 선거 종료 시까지" },
        { title: "모집 인원", content: "4명" },
        { title: "모집 분야", content: "교육권리국(2), 문화복지국(1), 사무행정국(1)" }
    ]
};

// 초기 실행
window.onload = () => {
    renderInputs();
    updatePreview();
};

// 1. 화면 업데이트 (State -> DOM)
function updatePreview() {
    // 값 가져오기
    state.themeColor = document.getElementById('themeColor').value;
    state.mainTitle = document.getElementById('mainTitle').value;
    state.titleSize = document.getElementById('titleSize').value;

    // --- 스타일 적용 ---
    
    // 1) 전체 카드 배경 (위: 흰색 -> 아래: 테마색)
    const card = document.getElementById('cardCanvas');
    card.style.background = `linear-gradient(180deg, #ffffff 20%, ${state.themeColor} 100%)`;

    // 2) 제목
    const titleEl = document.getElementById('renderTitle');
    titleEl.innerText = state.mainTitle;
    titleEl.style.fontSize = `${state.titleSize}px`;

    // 3) 리스트 렌더링
    const listEl = document.getElementById('renderList');
    listEl.innerHTML = ''; // 초기화

    state.items.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'card-item';

        // 스티커 그라데이션 (위: 테마색 -> 아래: 흰색)
        // 참고 이미지처럼 위쪽이 진하고 아래가 연하게
        const stickerStyle = `background: linear-gradient(180deg, ${state.themeColor} 0%, #ffffff 100%);`;

        wrapper.innerHTML = `
            <div class="sticker" style="${stickerStyle}">
                ${item.title}
            </div>
            <div class="content-box">
                <div class="content-text">${item.content.replace(/\n/g, '<br>')}</div>
            </div>
        `;
        listEl.appendChild(wrapper);
    });
}

// 2. 입력창 렌더링 (State -> Input Elements)
function renderInputs() {
    const container = document.getElementById('inputsContainer');
    container.innerHTML = '';

    state.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'input-card';
        div.innerHTML = `
            <button class="btn-remove" onclick="removeItem(${index})"><i class="fas fa-times"></i></button>
            <label>알약 스티커 (제목)</label>
            <input type="text" value="${item.title}" oninput="updateItem(${index}, 'title', this.value)">
            <label>내용</label>
            <textarea rows="2" oninput="updateItem(${index}, 'content', this.value)">${item.content}</textarea>
        `;
        container.appendChild(div);
    });
}

// 3. 데이터 조작
window.updateItem = (index, key, val) => {
    state.items[index][key] = val;
    updatePreview();
};

window.addItem = () => {
    state.items.push({ title: "새 항목", content: "내용을 입력하세요" });
    renderInputs();
    updatePreview();
};

window.removeItem = (index) => {
    state.items.splice(index, 1);
    renderInputs();
    updatePreview();
};

// 4. 다운로드
window.downloadCard = () => {
    const target = document.getElementById('cardCanvas');
    target.scrollTop = 0; // 스크롤 맨 위로
    
    html2canvas(target, {
        scale: 2, // 고화질
        useCORS: true,
        backgroundColor: null // 배경색 투명 방지(이미 CSS로 지정됨)
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `phoning_notice.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    });
};