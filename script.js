const inputList = document.getElementById('inputList');
const renderArea = document.getElementById('renderArea');
const mainTitleInput = document.getElementById('mainTitleInput');
const renderMainTitle = document.getElementById('renderMainTitle');
const titleColor = document.getElementById('titleColor');
const captureTarget = document.getElementById('captureTarget');

// [New] 제목 크기 조절 요소
const titleSizeInput = document.getElementById('titleSize');
const sizeValueDisplay = document.getElementById('sizeValue');

let sections = [
    { 
        title: "3. 사무행정국", 
        desc: "교육계열의 전반적인 행정 업무를 담당합니다.", 
        list: "- 재정 관리, 예결산안 작성\n- 회의록 관리\n- 공개문서 관리" 
    },
    { 
        title: "4. 홍보소통국", 
        desc: "집행 사항과 행사 등을 학우에게 알리는 업무입니다.", 
        list: "- 인스타그램 홍보 카드뉴스 제작\n- 교육계열 달력 제작\n- 링크트리 관리" 
    }
];

// 초기화
renderAll();

// 1. 메인 타이틀 텍스트 & 색상 변경
mainTitleInput.addEventListener('input', (e) => {
    renderMainTitle.innerText = e.target.value;
});
titleColor.addEventListener('input', (e) => {
    renderMainTitle.style.color = e.target.value;
});

// [New] 1-1. 메인 타이틀 크기 변경
titleSizeInput.addEventListener('input', (e) => {
    const size = e.target.value;
    renderMainTitle.style.fontSize = `${size}rem`;
    sizeValueDisplay.innerText = `(${size}rem)`;
});

// 2. 섹션 추가
function addSection() {
    sections.push({ title: "", desc: "", list: "" });
    renderAll();
}

// 3. 섹션 삭제
function removeSection(index) {
    sections.splice(index, 1);
    renderAll();
}

// 4. 데이터 업데이트
function updateSection(index, key, value) {
    sections[index][key] = value;
    renderPreview(); 
}

// 5. 전체 렌더링
function renderAll() {
    renderInputs();
    renderPreview();
}

function renderInputs() {
    inputList.innerHTML = '';
    sections.forEach((section, index) => {
        const div = document.createElement('div');
        div.className = 'input-item';
        div.innerHTML = `
            <h4>섹션 ${index + 1}</h4>
            <input type="text" placeholder="소제목 (예: 3. 사무행정국)" value="${section.title}" oninput="updateSection(${index}, 'title', this.value)">
            <textarea rows="2" placeholder="설명글 (예: 전반적인 행정 업무...)" oninput="updateSection(${index}, 'desc', this.value)">${section.desc}</textarea>
            <textarea rows="3" placeholder="리스트 항목 (줄바꿈으로 구분)" oninput="updateSection(${index}, 'list', this.value)">${section.list}</textarea>
            <button class="remove-btn" onclick="removeSection(${index})"><i class="fas fa-trash"></i></button>
        `;
        inputList.appendChild(div);
    });
}

function renderPreview() {
    renderArea.innerHTML = '';
    
    sections.forEach(section => {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-wrapper';
        
        const listItems = section.list.split('\n').filter(item => item.trim() !== '');
        const listHtml = listItems.map(item => {
            const cleanItem = item.replace(/^-\s*/, ''); 
            return <li>${cleanItem}</li>;
        }).join('');

        // 소제목이 있을 때만 렌더링
        const headerHtml = section.title ? <div class="section-header">${section.title}</div> : '';

        wrapper.innerHTML = `
            ${headerHtml}
            <div class="section-box">
                ${section.desc ? <div class="box-desc">${section.desc}</div> : ''}
                <ul class="box-list">
                    ${listHtml}
                </ul>
            </div>
        `;
        
        renderArea.appendChild(wrapper);
    });
}

// 이미지 다운로드
document.getElementById('downloadBtn').addEventListener('click', () => {
    // 캡처 전에 스크롤을 최상단으로 (혹시 모를 잘림 방지)
    window.scrollTo(0,0);
    
    html2canvas(captureTarget, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f8f9fa" // 투명 배경 방지
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'phoning-notice-card.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    });
});