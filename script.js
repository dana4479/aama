// --- 1. 초기 데이터 및 상태 설정 ---
let cardData = {
    mainTitle: "국서 안내",
    titleSize: 2.8,
    subTitleSize: 1.1,
    titleColor: "#0021b0",
    sections: [
        { 
            title: "3. 사무행정국", 
            desc: "교육계열의 전반적인 행정 업무를 담당합니다.", 
            list: "- 재정 관리, 예결산안 작성\n- 회의록 관리" 
        },
        { 
            title: "4. 홍보소통국", 
            desc: "학우들에게 행사와 소식을 알리는 업무를 담당합니다.", 
            list: "- 인스타그램 카드뉴스 제작\n- 링크트리 관리" 
        }
    ]
};

// --- 2. 초기 렌더링 실행 ---
window.onload = function() {
    renderInputs();   // 입력창 그리기
    renderPreview();  // 미리보기 그리기
    syncGlobalSettings(); // 슬라이더 등 설정값 동기화
};

// 설정값 UI 동기화 (새로고침 시 값 유지용)
function syncGlobalSettings() {
    document.getElementById('mainTitleInput').value = cardData.mainTitle;
    document.getElementById('titleSize').value = cardData.titleSize;
    document.getElementById('subTitleSize').value = cardData.subTitleSize;
    document.getElementById('titleColor').value = cardData.titleColor;
    
    // 텍스트 표시 업데이트
    document.getElementById('titleSizeValue').innerText = `(${cardData.titleSize}rem)`;
    document.getElementById('subTitleSizeValue').innerText = `(${cardData.subTitleSize}rem)`;
}


// --- 3. 이벤트 핸들러 (사용자 입력 처리) ---

// 메인 타이틀 변경
window.updateMainTitle = function(val) {
    cardData.mainTitle = val;
    renderPreview(); // 미리보기만 갱신
};

// 메인 타이틀 크기 변경
window.updateTitleSize = function(val) {
    cardData.titleSize = val;
    document.getElementById('titleSizeValue').innerText = `(${val}rem)`;
    renderPreview();
};

// 소제목 크기 변경
window.updateSubTitleSize = function(val) {
    cardData.subTitleSize = val;
    document.getElementById('subTitleSizeValue').innerText = `(${val}rem)`;
    renderPreview();
};

// 타이틀 색상 변경
window.updateTitleColor = function(val) {
    cardData.titleColor = val;
    renderPreview();
};

// 섹션 내용 변경 (인덱스, 키, 값)
window.updateSectionData = function(index, key, val) {
    cardData.sections[index][key] = val;
    renderPreview(); // 중요: 입력창을 다시 그리지 않고 미리보기만 갱신!
};

// 섹션 추가
window.addSection = function() {
    cardData.sections.push({ title: "", desc: "", list: "" });
    renderInputs(); // 입력창 개수가 바뀌었으니 다시 그림
    renderPreview();
};

// 섹션 삭제
window.removeSection = function(index) {
    cardData.sections.splice(index, 1);
    renderInputs(); // 입력창 개수가 바뀌었으니 다시 그림
    renderPreview();
};


// --- 4. 렌더링 함수 (화면 그리기) ---

// [왼쪽] 입력창 렌더링
function renderInputs() {
    const inputList = document.getElementById('inputList');
    inputList.innerHTML = ''; // 초기화

    cardData.sections.forEach((section, index) => {
        const div = document.createElement('div');
        div.className = 'input-item';
        div.innerHTML = `
            <button class="remove-btn" onclick="removeSection(${index})"><i class="fas fa-times"></i></button>
            
            <label>소제목 (부서명)</label>
            <input type="text" value="${section.title}" 
                   placeholder="예: 3. 사무행정국"
                   oninput="updateSectionData(${index}, 'title', this.value)">
            
            <label>설명글</label>
            <textarea placeholder="설명 내용을 입력하세요"
                      oninput="updateSectionData(${index}, 'desc', this.value)">${section.desc}</textarea>
            
            <label>리스트 (줄바꿈으로 구분)</label>
            <textarea placeholder="- 항목 1\n- 항목 2"
                      rows="3"
                      oninput="updateSectionData(${index}, 'list', this.value)">${section.list}</textarea>
        `;
        inputList.appendChild(div);
    });
}

// [오른쪽] 미리보기 렌더링
function renderPreview() {
    // 1. 메인 타이틀 적용
    const mainTitle = document.getElementById('renderMainTitle');
    mainTitle.innerText = cardData.mainTitle;
    mainTitle.style.fontSize = `${cardData.titleSize}rem`;
    mainTitle.style.color = cardData.titleColor;

    // 2. 섹션 리스트 적용
    const renderArea = document.getElementById('renderArea');
    renderArea.innerHTML = ''; // 초기화

    cardData.sections.forEach(section => {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-wrapper';

        // 리스트 줄바꿈 처리
        const listItems = section.list.split('\n').filter(t => t.trim() !== '');
        const listHtml = listItems.map(item => {
            const cleanItem = item.replace(/^-\s*/, ''); // 앞에 -가 있다면 제거 (CSS로 붙임)
            return `<li>${cleanItem}</li>`;
        }).join('');

        // 소제목 HTML (값이 있을 때만 생성)
        let headerHtml = '';
        if(section.title) {
            headerHtml = `
                <div class="section-header-box" style="font-size: ${cardData.subTitleSize}rem;">
                    ${section.title}
                </div>
            `;
        }

        // 박스 HTML
        wrapper.innerHTML = `
            ${headerHtml}
            <div class="section-content-box">
                ${section.desc ? `<div class="box-desc">${section.desc}</div>` : ''}
                ${listHtml ? `<ul class="box-list">${listHtml}</ul>` : ''}
            </div>
        `;

        renderArea.appendChild(wrapper);
    });
}


// --- 5. 이미지 다운로드 ---
window.downloadImage = function() {
    const target = document.getElementById('captureTarget');
    window.scrollTo(0,0); // 스크롤 이슈 방지

    html2canvas(target, {
        scale: 2, // 2배 해상도 (선명하게)
        backgroundColor: "#f8f9fa", // 배경색 강제 지정
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `phoning_card_${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    });
};