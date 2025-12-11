const inputList = document.getElementById('inputList');
const renderArea = document.getElementById('renderArea');
const mainTitleInput = document.getElementById('mainTitleInput');
const renderMainTitle = document.getElementById('renderMainTitle');
const titleColor = document.getElementById('titleColor');
const captureTarget = document.getElementById('captureTarget');

// 크기 조절 요소들
const titleSizeInput = document.getElementById('titleSize');
const titleSizeValue = document.getElementById('titleSizeValue');
const subTitleSizeInput = document.getElementById('subTitleSize'); // [추가됨]
const subTitleSizeValue = document.getElementById('subTitleSizeValue'); // [추가됨]

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

// 1. 메인 타이틀 변경
mainTitleInput.addEventListener('input', (e) => {
    renderMainTitle.innerText = e.target.value;
});
titleColor.addEventListener('input', (e) => {
    renderMainTitle.style.color = e.target.value;
});

// 2. 메인 타이틀 크기 조절
titleSizeInput.addEventListener('input', (e) => {
    const size = e.target.value;
    renderMainTitle.style.fontSize = `${size}rem`;
    titleSizeValue.innerText = `(${size}rem)`;
});

// [추가됨] 3. 소제목 크기 조절
subTitleSizeInput.addEventListener('input', (e) => {
    const size = e.target.value;
    subTitleSizeValue.innerText = `(${size}rem)`;
    
    // 현재 있는 모든 소제목의 크기를 변경
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
        header.style.fontSize = `${size}rem`;
    });
});

// 4. 섹션 관리 함수들
function addSection() {
    sections.push({ title: "", desc: "", list: "" });
    renderAll();
}

function removeSection(index) {
    sections.splice(index, 1);
    renderAll();
}

function updateSection(index, key, value) {
    sections[index][key] = value;
    renderPreview(); 
}

// 5. 렌더링
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
    
    // 현재 설정된 소제목 크기 가져오기
    const currentSubSize = subTitleSizeInput.value;

    sections.forEach(section => {
        const wrapper = document.createElement('div');
        wrapper.className = 'section-wrapper';
        
        const listItems = section.list.split('\n').filter(item => item.trim() !== '');
        const listHtml = listItems.map(item => {
            const cleanItem = item.replace(/^-\s*/, ''); 
            return `<li>${cleanItem}</li>`;
        }).join('');

        // 소제목 렌더링 (크기 스타일 적용 포함)
        let headerHtml = '';
        if (section.title) {
            headerHtml = `<div class="section-header" style="font-size: ${currentSubSize}rem;">${section.title}</div>`;
        }

        wrapper.innerHTML = `
            ${headerHtml}
            <div class="section-box">
                ${section.desc ? `<div class="box-desc">${section.desc}</div>` : ''}
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
    window.scrollTo(0,0);
    html2canvas(captureTarget, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f8f9fa"
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'phoning-notice-card.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    });
});