document.addEventListener('DOMContentLoaded', () => {
    const figure = document.querySelector('.carousel-figure');
    const cards = figure.querySelectorAll('.card-text'); 
    const numberOfImages = cards.length;
    
    // --- Primary Modal Elements ---
    const modal = document.getElementById('imageModal');
    const modalContentWrapper = document.getElementById('modalContentWrapper'); 
    const modalTitle = document.getElementById('modalTitle');
    const closeButton = modal.querySelector('.close-button');

    // --- Biography Modal Elements ---
    const bioModal = document.getElementById('bioModal');
    const bioModalContentWrapper = document.querySelector('.bio-modal-content');
    const bioModalTitle = document.getElementById('bioModalTitle');
    const closeBioButton = bioModal.querySelector('.close-button');

    // --- Nested Modal Elements ---
    const nestedModal = document.getElementById('nestedModal');
    const nestedModalTitle = document.getElementById('nestedModalTitle');
    const nestedModalText = document.getElementById('nestedModalText');
    const closeNestedButton = nestedModal.querySelector('.close-nested-button');

    // --- Biography Nested Modal Elements ---
    const bioNestedModal = document.getElementById('bioNestedModal');
    const bioNestedModalTitle = document.getElementById('bioNestedModalTitle');
    const bioNestedModalText = document.getElementById('bioNestedModalText');
    const closeBioNestedButton = document.querySelector('.close-bio-nested-button');

    // --- Poem Modal Elements ---
    const poemModal = document.getElementById('poemModal');
    const poemModalContent = document.getElementById('poemModalContent');
    const poemModalTitle = document.getElementById('poemModalTitle');
    const closePoemButton = poemModal.querySelector('.close-poem-button');

    // --- Summary Modal Elements ---
    const summaryModal = document.getElementById('summaryModal');
    const summaryModalTitle = document.getElementById('summaryModalTitle');
    const summaryModalContentWrapper = document.getElementById('summaryModalContentWrapper');
    const closeSummaryButton = summaryModal.querySelector('.close-summary-button');

    // --- Analysis Modal Elements ---
    const analysisModal = document.getElementById('analysisModal');
    const analysisModalTitle = document.getElementById('analysisModalTitle');
    const analysisModalContentWrapper = document.getElementById('analysisModalContentWrapper');
    const closeAnalysisButton = analysisModal.querySelector('.close-analysis-button');

    // --- Merits Modal Elements ---
    const meritsModal = document.getElementById('meritsModal');
    const meritsModalTitle = document.getElementById('meritsModalTitle');
    const meritsModalContentWrapper = document.getElementById('meritsModalContentWrapper');
    const closeMeritsButton = meritsModal.querySelector('.close-merits-button');

    // --- Merits Nested Modal Elements ---
    const meritsNestedModal = document.getElementById('meritsNestedModal');
    const meritsNestedModalTitle = document.getElementById('meritsNestedModalTitle');
    const meritsNestedModalText = document.getElementById('meritsNestedModalText');
    const closeMeritsNestedButton = document.querySelector('.close-merits-nested-button');
    let modalText; 
    let timelineButtonsContainer; 
    
    // --- Function Declarations (hoisted to top) ---
    function closeMainModal() {
        modal.style.display = "none";
        closeNestedModal();
        modalContentWrapper.innerHTML = '';
        modalText = null;
        timelineButtonsContainer = null;
    }
    
    function closeNestedModal() {
        nestedModal.style.display = "none";
        nestedModalTitle.textContent = '';
        nestedModalText.innerHTML = '';
        
        document.querySelectorAll('.school-modal .concept-card.active').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelectorAll('.merits-modal .merit-card.active').forEach(card => {
            card.classList.remove('active');
        });
    }

    function closeBioNestedModal() {
        if (bioNestedModal) {
            bioNestedModal.style.display = "none";
            if (bioNestedModalTitle) bioNestedModalTitle.textContent = '';
            if (bioNestedModalText) bioNestedModalText.textContent = '';
        }
    }
    
    function decodeHTML(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    
    // --- State Variables ---
    let isDragging = false;
    let dragTolerance = 5; 
    let didDrag = false; 
    let lastX = 0;
    let lastY = 0; 
    let currentYRotation = 0; 
    let currentXRotation = -20; 
    let rAF; 

    // --- Utility Functions ---
    function getCurrentCssYRotation() {
        const style = window.getComputedStyle(figure);
        const transform = style.getPropertyValue('transform');
        if (transform && transform !== 'none') {
            const matrix = transform.match(/matrix3d\((.+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ').map(Number);
                const a11 = values[0];
                const a13 = values[2];
                return Math.round(Math.atan2(-a13, a11) * (180 / Math.PI));
            }
        }
        return 0; 
    }

    function updateRotation() {
        if (!isDragging) return;
        figure.style.transform = `rotateX(${currentXRotation}deg) rotateY(${currentYRotation}deg)`;
        rAF = requestAnimationFrame(updateRotation);
    }
    
    // --- Initial 3D Setup ---
    const angle = 360 / numberOfImages; 
    const imageWidth = figure.offsetWidth; 
    const radius = Math.round((imageWidth / 2) / Math.tan(Math.PI / numberOfImages));

    cards.forEach((card, index) => {
        card.style.transform = `rotateY(${index * angle}deg) translateZ(${radius}px)`;
        
        card.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (!didDrag) {
                handleFlashcardClick(e.currentTarget);
            }
        });
    });

    figure.style.transform = `rotateX(${currentXRotation}deg)`;

    // --- Drag and Click Interception Logic ---
    
    figure.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
        e.stopPropagation();

        if (!e.target.closest('.card-text') && !e.target.classList.contains('carousel-figure')) return;
        
        isDragging = true;
        didDrag = false; 
        
        lastX = e.clientX;
        lastY = e.clientY; 
        
        figure.style.transition = 'none'; 
        currentYRotation = getCurrentCssYRotation(); 

        figure.style.cursor = 'grabbing';
        rAF = requestAnimationFrame(updateRotation);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;

        if (Math.abs(e.clientX - lastX) > dragTolerance || Math.abs(e.clientY - lastY) > dragTolerance) {
            didDrag = true;
        }

        currentYRotation += deltaX * 0.4;
        let nextXRotation = currentXRotation + deltaY * 0.2;
        currentXRotation = Math.max(Math.min(nextXRotation, 45), -45); 

        lastX = e.clientX;
        lastY = e.clientY;
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        cancelAnimationFrame(rAF);

        figure.style.transition = 'transform 0.4s ease-out';
        
        if (didDrag) {
            e.preventDefault(); 
        }

        figure.style.transform = `rotateX(${currentXRotation}deg) rotateY(${currentYRotation}deg)`; 
        figure.style.cursor = 'grab'; 
        
        setTimeout(() => didDrag = false, 10);
    });

    figure.addEventListener('dragstart', (e) => e.preventDefault());
    // Touch events for mobile
figure.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.card-text') && !e.target.classList.contains('carousel-figure')) return;
    
    isDragging = true;
    didDrag = false;
    
    const touch = e.touches[0];
    lastX = touch.clientX;
    lastY = touch.clientY;
    
    figure.style.transition = 'none';
    currentYRotation = getCurrentCssYRotation();
    
    figure.style.cursor = 'grabbing';
    rAF = requestAnimationFrame(updateRotation);
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastX;
    const deltaY = touch.clientY - lastY;

    if (Math.abs(touch.clientX - lastX) > dragTolerance || Math.abs(touch.clientY - lastY) > dragTolerance) {
        didDrag = true;
    }

    currentYRotation += deltaX * 0.4;
    let nextXRotation = currentXRotation + deltaY * 0.2;
    currentXRotation = Math.max(Math.min(nextXRotation, 45), -45);

    lastX = touch.clientX;
    lastY = touch.clientY;
});

document.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    cancelAnimationFrame(rAF);

    figure.style.transition = 'transform 0.4s ease-out';
    
    if (didDrag) {
        e.preventDefault();
    }

    figure.style.transform = `rotateX(${currentXRotation}deg) rotateY(${currentYRotation}deg)`;
    figure.style.cursor = 'grab';
    
    setTimeout(() => didDrag = false, 10);
});

    // ---------------------------------------------------------------- 
    // --- CUSTOM SVG ICONS ---
    // ----------------------------------------------------------------
    const customIconSVGs = {
        // School of Thought Icons
        "Modernism: Innovation and Irony": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <rect x="20" y="15" width="80" height="90" rx="5" fill="none" stroke="#7b684c" stroke-width="3"/>
                <line x1="40" y1="40" x2="60" y2="40" stroke="#a8916d" stroke-width="2"/>
                <path d="M 60 40 Q 70 30, 80 40 Q 70 50, 60 40" fill="none" stroke="#5d4029" stroke-width="2.5"/>
                <path d="M 60 40 L 65 45 M 60 40 L 65 35" stroke="#5d4029" stroke-width="1.5" fill="none"/>
                <circle cx="40" cy="65" r="3" fill="#7b684c" opacity="0.6"/>
                <circle cx="80" cy="75" r="4" fill="#5d4029" opacity="0.5"/>
            </svg>
        `,
        "Connection to Transcendentalism": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <circle cx="60" cy="35" r="8" fill="#7b684c"/>
                <path d="M 60 43 L 60 70 M 60 50 L 50 60 M 60 50 L 70 60 M 60 70 L 50 90 M 60 70 L 70 90" 
                      stroke="#7b684c" stroke-width="3" stroke-linecap="round"/>
                <path d="M 45 30 Q 40 25, 35 30 Q 40 35, 45 30" fill="#8b6f47" opacity="0.7"/>
                <path d="M 75 30 Q 80 25, 85 30 Q 80 35, 75 30" fill="#8b6f47" opacity="0.7"/>
                <path d="M 40 60 Q 35 55, 30 60 Q 35 65, 40 60" fill="#8b6f47" opacity="0.6"/>
                <path d="M 80 60 Q 85 55, 90 60 Q 85 65, 80 60" fill="#8b6f47" opacity="0.6"/>
                <path d="M 55 90 Q 50 95, 45 100" stroke="#8b6f47" stroke-width="2" opacity="0.7"/>
                <path d="M 65 90 Q 70 95, 75 100" stroke="#8b6f47" stroke-width="2" opacity="0.7"/>
            </svg>
        `,
        "Symbolism and Allegorical Tradition": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <rect x="45" y="45" width="40" height="40" rx="5" 
                      fill="#5d4029" opacity="0.3" transform="rotate(15 65 65)"/>
                <circle cx="60" cy="60" r="25" fill="#7b684c" opacity="0.4"/>
                <polygon points="60,35 75,55 70,75 50,75 45,55" 
                         fill="#a8916d" opacity="0.5"/>
                <circle cx="60" cy="60" r="5" fill="#3a251b"/>
                <line x1="60" y1="60" x2="40" y2="40" stroke="#b58863" stroke-width="1" opacity="0.5" stroke-dasharray="2,2"/>
                <line x1="60" y1="60" x2="80" y2="80" stroke="#b58863" stroke-width="1" opacity="0.5" stroke-dasharray="2,2"/>
            </svg>
        `,
        "Traditional Form with Modern Content": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M 40 20 L 80 20 L 80 25 L 75 25 L 75 85 L 80 85 L 80 90 L 40 90 L 40 85 L 45 85 L 45 25 L 40 25 Z" 
                      fill="none" stroke="#7b684c" stroke-width="2.5"/>
                <rect x="40" y="20" width="40" height="5" fill="#7b684c" opacity="0.3"/>
                <rect x="40" y="85" width="40" height="5" fill="#7b684c" opacity="0.3"/>
                <line x1="50" y1="35" x2="70" y2="35" stroke="#5d4029" stroke-width="1.5"/>
                <circle cx="50" cy="35" r="2" fill="#5d4029"/>
                <circle cx="70" cy="35" r="2" fill="#5d4029"/>
                <line x1="55" y1="45" x2="65" y2="45" stroke="#5d4029" stroke-width="1.5"/>
                <circle cx="55" cy="45" r="2" fill="#5d4029"/>
                <circle cx="65" cy="45" r="2" fill="#5d4029"/>
                <line x1="50" y1="55" x2="70" y2="55" stroke="#5d4029" stroke-width="1.5"/>
                <line x1="60" y1="50" x2="60" y2="60" stroke="#5d4029" stroke-width="1.5"/>
                <circle cx="60" cy="55" r="2" fill="#5d4029"/>
                <line x1="52" y1="65" x2="68" y2="65" stroke="#5d4029" stroke-width="1.5"/>
                <circle cx="52" cy="65" r="2" fill="#5d4029"/>
                <circle cx="68" cy="65" r="2" fill="#5d4029"/>
                <line x1="50" y1="75" x2="70" y2="75" stroke="#5d4029" stroke-width="1.5"/>
                <line x1="55" y1="70" x2="55" y2="80" stroke="#5d4029" stroke-width="1.5"/>
                <circle cx="55" cy="75" r="2" fill="#5d4029"/>
            </svg>
        `,
        "Rejection of Didacticism": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M 60 40 Q 75 40, 75 55 Q 75 65, 60 70" 
                      stroke="#7b684c" stroke-width="4" fill="none" stroke-linecap="round"/>
                <circle cx="60" cy="80" r="3" fill="#7b684c"/>
                <path d="M 85 65 A 30 30 0 1 0 35 65" 
                      stroke="#5d4029" stroke-width="2.5" fill="none" opacity="0.6" stroke-dasharray="5,3"/>
                <text x="75" y="50" font-size="20" fill="#a8916d" opacity="0.3">?</text>
                <text x="40" y="55" font-size="18" fill="#a8916d" opacity="0.25">?</text>
                <text x="70" y="85" font-size="16" fill="#a8916d" opacity="0.2">?</text>
            </svg>
        `,
        
        // Literary Merits Icons
        "Masterful Use of Irony and Ambiguity": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <circle cx="40" cy="45" r="18" fill="none" stroke="#7b684c" stroke-width="3"/>
                <circle cx="80" cy="45" r="18" fill="none" stroke="#7b684c" stroke-width="3"/>
                <path d="M 35 42 Q 40 38, 45 42" stroke="#5d4029" stroke-width="2" fill="none"/>
                <path d="M 75 48 Q 80 52, 85 48" stroke="#5d4029" stroke-width="2" fill="none"/>
                <circle cx="36" cy="48" r="2" fill="#5d4029"/>
                <circle cx="44" cy="48" r="2" fill="#5d4029"/>
                <circle cx="76" cy="42" r="2" fill="#5d4029"/>
                <circle cx="84" cy="42" r="2" fill="#5d4029"/>
                <path d="M 45 75 Q 60 88, 75 75" stroke="#7b684c" stroke-width="2.5" fill="none" stroke-dasharray="4,3"/>
                <text x="55" y="105" font-size="16" fill="#5d4029" font-weight="bold">?</text>
            </svg>
        `,
        "Technical Excellence in Form and Structure": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <rect x="25" y="15" width="70" height="90" rx="4" fill="none" stroke="#7b684c" stroke-width="3"/>
                <line x1="35" y1="30" x2="85" y2="30" stroke="#5d4029" stroke-width="2.5"/>
                <line x1="35" y1="42" x2="78" y2="42" stroke="#a8916d" stroke-width="1.5"/>
                <line x1="35" y1="52" x2="82" y2="52" stroke="#a8916d" stroke-width="1.5"/>
                <line x1="35" y1="62" x2="75" y2="62" stroke="#a8916d" stroke-width="1.5"/>
                <line x1="35" y1="75" x2="85" y2="75" stroke="#5d4029" stroke-width="2.5"/>
                <line x1="35" y1="87" x2="80" y2="87" stroke="#a8916d" stroke-width="1.5"/>
                <circle cx="30" cy="30" r="2" fill="#5d4029"/>
                <circle cx="30" cy="75" r="2" fill="#5d4029"/>
            </svg>
        `,
        "Linguistic Complexity and Multiple Meanings": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <text x="30" y="50" font-size="32" fill="#7b684c" font-family="serif" font-weight="bold">A</text>
                <text x="55" y="65" font-size="28" fill="#5d4029" font-family="serif" font-style="italic">a</text>
                <text x="75" y="45" font-size="24" fill="#a8916d" font-family="serif">á</text>
                <path d="M 25 75 Q 60 95, 95 75" stroke="#7b684c" stroke-width="2" fill="none"/>
                <path d="M 35 80 Q 60 65, 85 80" stroke="#5d4029" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
                <circle cx="60" cy="85" r="4" fill="#7b684c" opacity="0.5"/>
                <circle cx="45" cy="78" r="2" fill="#5d4029" opacity="0.6"/>
                <circle cx="75" cy="78" r="2" fill="#5d4029" opacity="0.6"/>
            </svg>
        `,
        "Cultural and Historical Significance": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <circle cx="60" cy="55" r="35" fill="none" stroke="#7b684c" stroke-width="3"/>
                <ellipse cx="60" cy="55" rx="35" ry="12" fill="none" stroke="#5d4029" stroke-width="1.5"/>
                <path d="M 25 55 Q 25 35, 60 35 Q 95 35, 95 55" fill="none" stroke="#5d4029" stroke-width="1.5"/>
                <line x1="60" y1="20" x2="60" y2="90" stroke="#a8916d" stroke-width="1.5"/>
                <line x1="25" y1="55" x2="95" y2="55" stroke="#a8916d" stroke-width="1.5"/>
                <circle cx="60" cy="55" r="5" fill="#5d4029"/>
                <circle cx="45" cy="45" r="3" fill="#7b684c" opacity="0.6"/>
                <circle cx="75" cy="65" r="3" fill="#7b684c" opacity="0.6"/>
            </svg>
        `,
        "Sophisticated Use of Symbolism": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M 60 25 L 60 55 M 60 55 L 35 85 M 60 55 L 85 85" stroke="#7b684c" stroke-width="4" stroke-linecap="round"/>
                <circle cx="60" cy="25" r="8" fill="#5d4029"/>
                <path d="M 30 85 Q 35 75, 40 85" stroke="#a8916d" stroke-width="2" fill="none"/>
                <path d="M 80 85 Q 85 75, 90 85" stroke="#a8916d" stroke-width="2" fill="none"/>
                <circle cx="35" cy="90" r="4" fill="#7b684c" opacity="0.5"/>
                <circle cx="85" cy="90" r="4" fill="#7b684c" opacity="0.5"/>
                <path d="M 50 40 L 45 35 M 70 40 L 75 35" stroke="#a8916d" stroke-width="2"/>
            </svg>
        `,
        "Universal Relatability and Emotional Complexity": `
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
                <path d="M 60 30 C 45 30, 35 45, 35 55 C 35 75, 60 90, 60 90 C 60 90, 85 75, 85 55 C 85 45, 75 30, 60 30" 
                      fill="none" stroke="#7b684c" stroke-width="3"/>
                <circle cx="50" cy="50" r="3" fill="#5d4029"/>
                <circle cx="70" cy="50" r="3" fill="#5d4029"/>
                <path d="M 50 65 Q 60 72, 70 65" stroke="#5d4029" stroke-width="2" fill="none"/>
                <path d="M 30 35 Q 35 25, 45 30" stroke="#a8916d" stroke-width="1.5" fill="none"/>
                <path d="M 90 35 Q 85 25, 75 30" stroke="#a8916d" stroke-width="1.5" fill="none"/>
                <circle cx="60" cy="105" r="3" fill="#7b684c" opacity="0.5"/>
            </svg>
        `
    };

    // ---------------------------------------------------------------- 
    // --- MODAL POP-UP LOGIC (Timeline and Icons) ---
    // ----------------------------------------------------------------

    function handleFlashcardClick(clickedCard) {
        closeNestedModal(); 
        closeBioNestedModal();
        
        const cardTitle = clickedCard.getAttribute('data-title');
        const cardInfo = clickedCard.getAttribute('data-info');
        
        const isTimeline = cardTitle.includes('Historical Timeline');
        const isIcons = cardTitle.includes('School of Thought');
        const isBiography = cardTitle.includes("Author");
        const isPoem = cardTitle.includes('The Poem');
        const isSummary = cardTitle.includes('Summary of the Work');
        const isAnalysis = cardTitle.includes('Analysis of the Literary Piece');
        const isLiteraryMerits = cardTitle.includes('Literary Standards') || cardTitle.includes('Literary Merits');

        // Handle biography modal separately
        if (isBiography) {
            bioModalTitle.textContent = cardTitle;
            const bioContent = document.createElement('div');
            bioContent.innerHTML = cardInfo;
            
            const existingContent = bioModalContentWrapper.querySelector('#bioModalContent');
            if (existingContent) {
                existingContent.innerHTML = '';
                existingContent.appendChild(bioContent);
            } else {
                bioModalContentWrapper.appendChild(bioContent);
            }
            
            bioModal.style.display = "block";
            initBioCarousel();
            return;
        }

        // Handle poem modal separately
        if (isPoem) {
            poemModalTitle.textContent = cardTitle;
            poemModalContent.innerHTML = cardInfo;
            poemModal.style.display = "block";
            return;
        }

        // Handle summary modal with carousel
        if (isSummary) {
            summaryModalTitle.textContent = cardTitle;
            summaryModalContentWrapper.innerHTML = '';
            
            const summaryContainer = document.createElement('div');
            summaryContainer.className = 'summary-modal';
            
            const summaryItems = cardInfo.trim().split('||').map(item => {
                const parts = item.trim().split('|');
                return { 
                    title: parts[0] ? parts[0].trim() : '', 
                    description: parts[1] ? parts[1].trim() : '' 
                };
            }).filter(item => item.title);
            
            summaryContainer.innerHTML = `
                <div class="summary-carousel">
                    <button class="summary-arrow summary-arrow-left">&lt;</button>
                    <div class="summary-carousel-container" data-slide="1 / ${summaryItems.length}">
                        <div class="summary-carousel-track">
                            ${summaryItems.map((item, index) => {
                                const paragraphs = item.description
                                    .split(/<br\s*\/?>\s*(&nbsp;\s*){4}/)
                                    .filter(p => p && p.trim() && !p.includes('&nbsp;'));
                                    
                                const paragraphsHTML = paragraphs
                                    .map(p => `<p class="summary-slide-text">${p.trim()}</p>`)
                                    .join('');
                                    
                                return `
                                <div class="summary-slide">
                                    <div class="summary-slide-header">
                                        <h3 class="summary-slide-title">${item.title}</h3>
                                    </div>
                                    <div class="summary-slide-text-wrapper">
                                    ${paragraphsHTML}
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                    <button class="summary-arrow summary-arrow-right">&gt;</button>
                    <div class="summary-dots"></div>
                </div>
            `;
            summaryModalContentWrapper.appendChild(summaryContainer);
            summaryModal.style.display = "block";
            initSummaryCarousel(summaryItems.length);
            return;
        }

        // Handle analysis modal with carousel
        if (isAnalysis) {
            analysisModalTitle.textContent = cardTitle;
            analysisModalContentWrapper.innerHTML = '';

            const analysisContainer = document.createElement('div');
            analysisContainer.className = 'analysis-modal';

            const analysisItems = cardInfo.trim().split('||').map(item => {
                const parts = item.trim().split('|');
                return { 
                    title: parts[0] ? parts[0].trim() : '', 
                    description: parts[1] ? parts[1].trim() : '' 
                };
            }).filter(item => item.title);

            analysisContainer.innerHTML = `
                <div class="analysis-carousel">
                    <div class="analysis-carousel-container">
                        <div class="analysis-carousel-track">
                            ${analysisItems.map((item, index) => {
                                const paragraphs = item.description
                                    .split(/<br\s*\/?>\s*(&nbsp;\s*){4}/)
                                    .filter(p => p && p.trim() && !p.includes('&nbsp;'));
                                const paragraphsHTML = paragraphs
                                    .map(p => `<p class="analysis-slide-text${index === 0 ? ' no-indent' : ''}">${p.trim()}</p>`)
                                    .join('');
                            
                                return `
                                <div class="analysis-slide">
                                    ${index > 0 ? `<div class="analysis-slide-header">
                                        <h3 class="analysis-slide-title">${item.title}</h3>
                                    </div>` : ''}
                                    <div class="analysis-slide-text-wrapper">
                                        ${paragraphsHTML}
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                    <div class="analysis-navigation">
                        <button class="analysis-arrow analysis-arrow-left">&lt;</button>
                        <div class="analysis-dots"></div>
                        <button class="analysis-arrow analysis-arrow-right">&gt;</button>
                    </div>
                </div>
            `;
            analysisModalContentWrapper.appendChild(analysisContainer);
            analysisModal.style.display = "block";
            initAnalysisCarousel(analysisItems.length);
            return;
        }

        // Handle literary merits modal separately
        if (isLiteraryMerits) {
            meritsModalTitle.textContent = cardTitle;
            meritsModalContentWrapper.innerHTML = '';
            
            const meritsContainer = document.createElement('div');
            meritsContainer.className = 'merits-modal';
            
            const meritsList = document.createElement('div');
            meritsList.className = 'merit-icon-list';
            meritsContainer.appendChild(meritsList);
            
            const meritItems = cardInfo.trim().split('||').map(item => {
                const parts = item.trim().split('|');
                return { 
                    title: parts[0] ? parts[0].trim() : '', 
                    description: parts[1] ? parts[1].trim() : '' 
                };
            }).filter(item => item.title);
            
            meritItems.forEach((item) => {
                const card = document.createElement('div');
                card.className = 'merit-card';
                
                const iconElement = document.createElement('div');
                iconElement.className = 'merit-icon';
                iconElement.innerHTML = customIconSVGs[item.title] || '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="30" fill="#7b684c"/></svg>';
                
                const titleElement = document.createElement('div');
                titleElement.className = 'merit-title';
                titleElement.textContent = item.title;

                card.appendChild(iconElement);
                card.appendChild(titleElement);
                meritsList.appendChild(card);
                
                card.addEventListener('click', () => {
                    displayMeritDescription(item, card, meritsList);
                });
            });
            
            meritsModalContentWrapper.appendChild(meritsContainer);
            meritsModal.style.display = "block";
            return;
        }

        // Continue with regular modal for other cards
        modalTitle.textContent = cardTitle;
        modalContentWrapper.innerHTML = ''; 

        const contentContainer = document.createElement('div');
        const textElement = document.createElement('p');
        textElement.id = 'modalText'; 
        
        modalText = textElement;
        
        if (isTimeline) {
            // Card 1: Historical Timeline
            contentContainer.className = 'historical-modal';
            
            timelineButtonsContainer = document.createElement('div');
            timelineButtonsContainer.className = 'timeline-container';
            
            contentContainer.appendChild(timelineButtonsContainer);
            contentContainer.appendChild(modalText);
            
            const timelineItems = cardInfo.trim().split('||').map(item => {
                const parts = item.trim().split('|');
                return { year: parts[0].trim(), description: parts[1].trim() };
            }).filter(item => item.year); 

            const timelineData = timelineItems;
            
            timelineData.forEach((item, index) => {
                const button = document.createElement('button');
                button.className = 'timeline-period';
                button.textContent = item.year;
                
                button.addEventListener('click', () => {
                    displayTimelineDescription(index, button, timelineData);
                });
                
                timelineButtonsContainer.appendChild(button);
            });
            
            timelineButtonsContainer.style.display = 'flex';
            
            if (timelineData.length > 0) {
                 displayTimelineDescription(0, timelineButtonsContainer.firstChild, timelineData);
            }

        } else if (isIcons) {
            // Card 2: School of Thought
            contentContainer.className = 'school-modal';
            
            const conceptList = document.createElement('div');
            conceptList.className = 'concept-icon-list';

            contentContainer.appendChild(conceptList);
            
            const conceptItems = cardInfo.trim().split('||').map(item => {
                const parts = item.trim().split('|');
                return { 
                    title: parts[0] ? parts[0].trim() : '', 
                    description: parts[1] ? parts[1].trim() : '' 
                };
            }).filter(item => item.title);
            
            conceptItems.forEach((item) => {
                const card = document.createElement('div');
                card.className = 'concept-card';
                
                const iconElement = document.createElement('div');
                iconElement.className = 'concept-icon';
                iconElement.innerHTML = customIconSVGs[item.title] || '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="30" fill="#7b684c"/></svg>';
                
                const titleElement = document.createElement('div');
                titleElement.className = 'concept-title';
                titleElement.textContent = item.title;

                card.appendChild(iconElement);
                card.appendChild(titleElement);
                conceptList.appendChild(card);
                
                card.addEventListener('click', () => {
                    displayConceptDescription(item, card, conceptList);
                });
            });

        } else {
            contentContainer.className = 'simple-modal'; 
            contentContainer.appendChild(modalText);
            modalText.innerHTML = cardInfo || "No information available for this section.";
        }

        modalContentWrapper.appendChild(contentContainer);
        modal.style.display = "block";
    }

    function displayTimelineDescription(index, clickedButton, timelineData) {
        const btnContainer = clickedButton.closest('.timeline-container');
        if (!btnContainer) return;
        
        btnContainer.querySelectorAll('.timeline-period').forEach(btn => {
            btn.classList.remove('active');
        });

        clickedButton.classList.add('active');

        const item = timelineData[index];
        if (item && modalText) {
            modalText.innerHTML = '';
            const paragraphs = item.description.split('\n');
            
            paragraphs.forEach((para, i) => {
                const p = document.createElement('p');
                p.textContent = para.trim();
                if (i > 0) {
                    p.classList.add('timeline-indent');
                }
                modalText.appendChild(p);
            });

            modalText.scrollTop = 0;
        }
    }

    function displayConceptDescription(item, clickedCard, container) {
        container.querySelectorAll('.concept-card').forEach(card => {
            card.classList.remove('active');
        });
    
        clickedCard.classList.add('active');

        nestedModalTitle.textContent = item.title;
        nestedModalText.innerHTML = item.description;
    
        nestedModal.style.display = "block";
    }

    function displayMeritDescription(item, clickedCard, container) {
    container.querySelectorAll('.merit-card').forEach(card => {
        card.classList.remove('active');
    });

    clickedCard.classList.add('active');

    // Use the separate merits nested modal instead of the general one
    meritsNestedModalTitle.textContent = item.title;
    meritsNestedModalText.innerHTML = item.description;

    meritsNestedModal.style.display = "block";
}
    function closeMeritsNestedModal() {
    if (meritsNestedModal) {
        meritsNestedModal.style.display = "none";
        if (meritsNestedModalTitle) meritsNestedModalTitle.textContent = '';
        if (meritsNestedModalText) meritsNestedModalText.innerHTML = '';
    }
    
    document.querySelectorAll('.merits-modal .merit-card.active').forEach(card => {
        card.classList.remove('active');
    });
    }


    // --- Summary Icon Generator ---
    function getSummaryIcon(index) {
        const icons = [
            `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <path d="M 30 60 L 60 30 L 90 60 M 60 30 L 60 90" stroke="#7b684c" stroke-width="4" fill="none" stroke-linecap="round"/>
                <circle cx="30" cy="60" r="5" fill="#5d4029"/>
                <circle cx="90" cy="60" r="5" fill="#5d4029"/>
            </svg>`,
            `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="30" fill="none" stroke="#7b684c" stroke-width="4"/>
                <circle cx="60" cy="60" r="5" fill="#5d4029"/>
                <line x1="60" y1="60" x2="60" y2="35" stroke="#5d4029" stroke-width="3" stroke-linecap="round"/>
                <line x1="60" y1="60" x2="75" y2="65" stroke="#5d4029" stroke-width="3" stroke-linecap="round"/>
            </svg>`,
            `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <path d="M 40 80 Q 40 40, 60 40 Q 80 40, 80 60" fill="none" stroke="#7b684c" stroke-width="4" stroke-linecap="round"/>
                <circle cx="80" cy="60" r="5" fill="#5d4029"/>
                <path d="M 70 75 L 80 60 L 90 75" fill="none" stroke="#5d4029" stroke-width="3" stroke-linecap="round"/>
            </svg>`
        ];
        return icons[index] || icons[0];
    }
    
    // --- Summary Carousel Functions ---
    function initSummaryCarousel(totalSlides) {
        setTimeout(() => {
            const track = document.querySelector('.summary-carousel-track');
            const slides = document.querySelectorAll('.summary-slide');
            const leftArrow = document.querySelector('.summary-arrow-left');
            const rightArrow = document.querySelector('.summary-arrow-right');
            const dotsContainer = document.querySelector('.summary-dots');
            const carouselContainer = document.querySelector('.summary-carousel-container');
            
            if (!track || !slides.length || !leftArrow || !rightArrow) {
                console.error('Summary carousel elements not found');
                return;
            }
            
            let currentIndex = 0;
            
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'summary-dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            const dots = document.querySelectorAll('.summary-dot');
            
            function updateCarousel() {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                carouselContainer.setAttribute('data-slide', `${currentIndex + 1} / ${totalSlides}`);
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                leftArrow.disabled = currentIndex === 0;
                rightArrow.disabled = currentIndex === totalSlides - 1;
            }
            
            function goToSlide(index) {
                currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
                updateCarousel();
            }
            
            function nextSlide() {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            }
            
            function prevSlide() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
            
            leftArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
            });
            
            rightArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
            });
            
            const keyHandler = (e) => {
                if (summaryModal.style.display === "block" && document.querySelector('.summary-carousel')) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextSlide();
                    }
                }
            };          
            document.addEventListener('keydown', keyHandler);
            
            updateCarousel();
        }, 100);
    }
    
    // --- Biography Carousel Functions ---
    function initBioCarousel() {
        setTimeout(() => {
            const track = document.querySelector('.bio-carousel-track');
            const items = document.querySelectorAll('.bio-item');
            const leftArrow = document.querySelector('.bio-arrow-left');
            const rightArrow = document.querySelector('.bio-arrow-right');
            const dotsContainer = document.querySelector('.bio-dots');
            
            if (!track || !items.length || !leftArrow || !rightArrow) {
                console.error('Carousel elements not found');
                return;
            }
        
            let currentIndex = 0;
            const totalItems = items.length;
            
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'bio-dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            const dots = document.querySelectorAll('.bio-dot');
            
            function updateCarousel() {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                leftArrow.disabled = currentIndex === 0;
                rightArrow.disabled = currentIndex === totalItems - 1;
            }
            
            function goToSlide(index) {
                currentIndex = Math.max(0, Math.min(index, totalItems - 1));
                updateCarousel();
            }
            
            function nextSlide() {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            }
            
            function prevSlide() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
            
            leftArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                prevSlide();
            });
            
            rightArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                nextSlide();
            });
            
            leftArrow.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            rightArrow.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            
            items.forEach(item => {
                item.style.cursor = 'pointer';
                
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.bio-arrow') || e.target.closest('.bio-dot')) {
                        e.stopPropagation();
                        return;
                    }
                    
                    const title = item.getAttribute('data-title');
                    const text = item.getAttribute('data-text');
                    
                    if (!title) {
                        console.error('Missing title attribute');
                        return;
                    }
                    
                    if (!text) {
                        console.error('Missing text attribute');
                        bioNestedModalTitle.textContent = title;
                        bioNestedModalText.textContent = "No information available for this section.";
                        bioNestedModal.style.display = "block";
                        return;
                    }
                    
                    bioNestedModalTitle.textContent = title;
                    bioNestedModalText.innerHTML = decodeHTML(text);
                    bioNestedModal.style.display = "block";
                });
            });
            
            const keyHandler = (e) => {
                if (bioModal.style.display === "block" && document.querySelector('.bio-carousel')) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextSlide();
                    }
                }
            };
            
            document.addEventListener('keydown', keyHandler);
            
            updateCarousel();
        }, 100);
    }

    // --- Analysis Carousel Functions ---
    function initAnalysisCarousel(totalSlides) {
        setTimeout(() => {
            const track = document.querySelector('.analysis-carousel-track');
            const slides = document.querySelectorAll('.analysis-slide');
            const leftArrow = document.querySelector('.analysis-arrow-left');
            const rightArrow = document.querySelector('.analysis-arrow-right');
            const dotsContainer = document.querySelector('.analysis-dots');
            const carouselContainer = document.querySelector('.analysis-carousel-container');
            
            if (!track || !slides.length || !leftArrow || !rightArrow) {
                console.error('Analysis carousel elements not found');
                return;
            }
            
            let currentIndex = 0;
            
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'analysis-dot' + (index === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            const dots = document.querySelectorAll('.analysis-dot');
            
            function updateCarousel() {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                carouselContainer.setAttribute('data-slide', `${currentIndex + 1} / ${totalSlides}`);
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                leftArrow.disabled = currentIndex === 0;
                rightArrow.disabled = currentIndex === totalSlides - 1;
            }
            
            function goToSlide(index) {
                currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
                updateCarousel();
            }
            
            function nextSlide() {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            }
            
            function prevSlide() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            }
            
            leftArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
            });
            
            rightArrow.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
            });
            
            const keyHandler = (e) => {
                if (analysisModal.style.display === "block" && document.querySelector('.analysis-carousel')) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextSlide();
                    }
                }
            };          
            document.addEventListener('keydown', keyHandler);
            
            updateCarousel();
        }, 100);
    }

    // --- Event Listeners for Closing ---
    
    closeButton.addEventListener('click', closeMainModal);
    
    closeBioButton.addEventListener('click', () => {
        bioModal.style.display = "none";
    });
    
    closeNestedButton.addEventListener('click', closeNestedModal);
    
    if (closeBioNestedButton) {
        closeBioNestedButton.addEventListener('click', closeBioNestedModal);
    }

    if (closePoemButton) {
        closePoemButton.addEventListener('click', () => {
            poemModal.style.display = "none";
        });
    }
    
    if (closeSummaryButton) {
        closeSummaryButton.addEventListener('click', () => {
            summaryModal.style.display = "none";
        });
    }

    if (closeAnalysisButton) {
        closeAnalysisButton.addEventListener('click', () => {
            analysisModal.style.display = "none";
        });
    }

    if (closeMeritsButton) {
        closeMeritsButton.addEventListener('click', () => {
            meritsModal.style.display = "none";
            closeNestedModal();
        });
    }
    if (closeMeritsNestedButton) {
    closeMeritsNestedButton.addEventListener('click', closeMeritsNestedModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeMainModal();
        }
        if (event.target == bioModal) {
            bioModal.style.display = "none";
        }
        if (event.target == nestedModal) {
            closeNestedModal();
        }
        if (event.target == bioNestedModal) {
            closeBioNestedModal();
        }
        if (event.target == poemModal) {
            poemModal.style.display = "none";
        }
        if (event.target == summaryModal) {
            summaryModal.style.display = "none";
        }
        if (event.target == analysisModal) {
            analysisModal.style.display = "none";
        }
        if (event.target == meritsModal) {
            meritsModal.style.display = "none";
            closeNestedModal();
        }
        if (event.target == meritsNestedModal) {
        closeMeritsNestedModal();
        }
    });

    document.addEventListener('keydown', (event) => {
    if (event.key === "Escape") {
        if (bioNestedModal && bioNestedModal.style.display === "block") {
            closeBioNestedModal();
        } else if (nestedModal.style.display === "block") {
            closeNestedModal();
        } else if (bioModal.style.display === "block") {
            bioModal.style.display = "none";
        } else if (poemModal && poemModal.style.display === "block") {
            poemModal.style.display = "none";
        } else if (summaryModal && summaryModal.style.display === "block") {
            summaryModal.style.display = "none";
        } else if (analysisModal && analysisModal.style.display === "block") {
            analysisModal.style.display = "none";
        } else if (meritsNestedModal && meritsNestedModal.style.display === "block") {
            closeMeritsNestedModal();
        } else if (meritsModal && meritsModal.style.display === "block") {
            meritsModal.style.display = "none";
            closeNestedModal();
        } else if (modal.style.display === "block") {
            closeMainModal();
        }
    }
    });
});