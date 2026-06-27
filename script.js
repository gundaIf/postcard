// ── Themes ──
const THEMES = [
    { id: 'classic', name: 'Classic', desc: 'Clean & timeless', color: '#f5f5f0', accent: '#78716c' },
    { id: 'polaroid', name: 'Polaroid', desc: 'Instant photo feel', color: '#ffffff', accent: '#e5e5e5' },
    { id: 'vintage', name: 'Vintage', desc: 'Warm & nostalgic', color: '#f5efe6', accent: '#c4a882' },
    { id: 'film', name: 'Film Strip', desc: 'Cinema vibes', color: '#1a1a1a', accent: '#333' },
    { id: 'travel', name: 'Travel', desc: 'Wanderlust postcard', color: '#fff', accent: '#b45309' },
    { id: 'minimal', name: 'Minimal', desc: 'Sharp & modern', color: '#f8f8f8', accent: '#d4d4d4' },
    { id: 'dreamy', name: 'Dreamy', desc: 'Soft & ethereal', color: '#fef1f5', accent: '#f0b6c8' },
    { id: 'noir', name: 'Noir', desc: 'Bold black & white', color: '#111', accent: '#444' },
    { id: 'golden', name: 'Golden', desc: 'Elegant gold frame', color: '#f9f4eb', accent: '#c8a96e' },
    { id: 'torn', name: 'Stacked', desc: 'Layered paper', color: '#fff', accent: '#e6e2dc' },
    { id: 'cinematic', name: 'Cinematic', desc: 'Widescreen drama', color: '#000', accent: '#222' },
];

// ── State ──
let currentTheme = 'classic';
let isFlipped = false;
let imageState = { scale: 100, x: 0, y: 0, dragging: false, startX: 0, startY: 0 };

// ── DOM ──
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const uploadScreen = $('#uploadScreen');
const editorScreen = $('#editorScreen');
const uploadZone = $('#uploadZone');
const fileInput = $('#fileInput');
const postcardCard = $('#postcardCard');
const postcardFront = $('#postcardFront');
const postcardImage = $('#postcardImage');
const imageContainer = $('#imageContainer');
const textOverlay = $('#textOverlay');
const postcardStamp = $('#postcardStamp');
const postcardScene = $('.postcard-scene');
const backMessage = $('#backMessage');

// ── Upload ──
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) loadImage(e.target.files[0]);
});

document.addEventListener('paste', (e) => {
    if (!uploadScreen.classList.contains('active') && !editorScreen.classList.contains('active')) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            loadImage(item.getAsFile());
            return;
        }
    }
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        postcardImage.src = e.target.result;
        postcardImage.onload = () => {
            resetImagePosition();
            showEditor();
        };
    };
    reader.readAsDataURL(file);
}

function showEditor() {
    uploadScreen.classList.remove('active');
    editorScreen.classList.add('active');
}

$('#navBack').addEventListener('click', () => {
    editorScreen.classList.remove('active');
    uploadScreen.classList.add('active');
    if (isFlipped) {
        isFlipped = false;
        postcardCard.classList.remove('flipped');
    }
});

// ── Image Pan & Zoom ──
function resetImagePosition() {
    imageState = { scale: 100, x: 0, y: 0, dragging: false, startX: 0, startY: 0 };
    updateImageTransform();
    $('#imageZoom').value = 100;
}

function updateImageTransform() {
    const s = imageState.scale / 100;
    postcardImage.style.transform = `translate(${imageState.x}px, ${imageState.y}px) scale(${s})`;
}

imageContainer.addEventListener('mousedown', (e) => {
    if (imageState.scale <= 100) return;
    e.preventDefault();
    imageState.dragging = true;
    imageState.startX = e.clientX - imageState.x;
    imageState.startY = e.clientY - imageState.y;
});

document.addEventListener('mousemove', (e) => {
    if (!imageState.dragging) return;
    imageState.x = e.clientX - imageState.startX;
    imageState.y = e.clientY - imageState.startY;
    updateImageTransform();
});

document.addEventListener('mouseup', () => {
    imageState.dragging = false;
});

imageContainer.addEventListener('touchstart', (e) => {
    if (imageState.scale <= 100) return;
    const t = e.touches[0];
    imageState.dragging = true;
    imageState.startX = t.clientX - imageState.x;
    imageState.startY = t.clientY - imageState.y;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!imageState.dragging) return;
    const t = e.touches[0];
    imageState.x = t.clientX - imageState.startX;
    imageState.y = t.clientY - imageState.startY;
    updateImageTransform();
}, { passive: true });

document.addEventListener('touchend', () => {
    imageState.dragging = false;
});

$('#imageZoom').addEventListener('input', (e) => {
    imageState.scale = parseInt(e.target.value);
    if (imageState.scale <= 100) { imageState.x = 0; imageState.y = 0; }
    updateImageTransform();
});

$('#btnZoomIn').addEventListener('click', () => {
    const slider = $('#imageZoom');
    imageState.scale = Math.min(300, imageState.scale + 20);
    slider.value = imageState.scale;
    updateImageTransform();
});

$('#btnZoomOut').addEventListener('click', () => {
    const slider = $('#imageZoom');
    imageState.scale = Math.max(100, imageState.scale - 20);
    slider.value = imageState.scale;
    if (imageState.scale <= 100) { imageState.x = 0; imageState.y = 0; }
    updateImageTransform();
});

$('#btnResetImage').addEventListener('click', resetImagePosition);

// ── Themes ──
function renderThemes() {
    const grid = $('#themeGrid');
    grid.innerHTML = THEMES.map(t => `
        <div class="theme-card ${t.id === currentTheme ? 'active' : ''}" data-theme="${t.id}">
            <div class="theme-preview" style="background: ${t.color}; border: 3px solid ${t.accent};"></div>
            <div class="theme-name">${t.name}</div>
            <div class="theme-desc">${t.desc}</div>
        </div>
    `).join('');

    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.theme-card');
        if (!card) return;
        currentTheme = card.dataset.theme;
        $$('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === currentTheme));
        applyTheme();
    });
}

function applyTheme() {
    const wrapper = $('#postcardWrapper');
    wrapper.className = 'postcard-wrapper';
    wrapper.classList.add('theme-' + currentTheme);

    postcardStamp.classList.toggle('visible', currentTheme === 'travel');
}

renderThemes();
applyTheme();

// ── Tabs ──
$$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        $$('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $$('.tab-content').forEach(c => c.classList.remove('active'));
        $('#tab-' + tab.dataset.tab).classList.add('active');
    });
});

// ── Text Controls ──
const textInput = $('#textInput');
const fontSelect = $('#fontSelect');
const textColor = $('#textColor');
const fontSizeInput = $('#fontSize');
const backTextInput = $('#backTextInput');

textOverlay.className = 'postcard-text-overlay textbg-none center';
textOverlay.style.fontFamily = fontSelect.value;
textOverlay.style.color = textColor.value;
textOverlay.style.fontSize = fontSizeInput.value + 'px';

textInput.addEventListener('input', () => {
    textOverlay.textContent = textInput.value;
});

fontSelect.addEventListener('change', () => {
    textOverlay.style.fontFamily = fontSelect.value;
});

textColor.addEventListener('input', () => {
    textOverlay.style.color = textColor.value;
});

fontSizeInput.addEventListener('input', () => {
    textOverlay.style.fontSize = fontSizeInput.value + 'px';
});

backTextInput.addEventListener('input', () => {
    backMessage.textContent = backTextInput.value || 'Write your message here...';
});

// Text background
$$('[data-textbg]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('[data-textbg]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        textOverlay.className = textOverlay.className
            .replace(/textbg-\w+/g, '')
            .trim() + ' textbg-' + btn.dataset.textbg;
    });
});

// Position
$$('.position-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('.position-grid button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const pos = btn.dataset.pos;
        const classes = textOverlay.className.replace(
            /\b(top|center|bottom)-(left|center|right)\b|(?<=\s)center(?=\s|$)/g, ''
        ).trim();
        textOverlay.className = classes + ' ' + pos;
    });
});

// ── Filters ──
$$('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        postcardFront.className = postcardFront.className.replace(/filter-\w+/g, '').trim();
        if (btn.dataset.filter !== 'none') {
            postcardFront.classList.add('filter-' + btn.dataset.filter);
        }
        preserveBorderClass();
    });
});

// ── Orientation ──
$$('[data-orientation]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('[data-orientation]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        postcardScene.classList.toggle('portrait', btn.dataset.orientation === 'portrait');
    });
});

// ── Border ──
$$('[data-border]').forEach(btn => {
    btn.addEventListener('click', () => {
        $$('[data-border]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        postcardFront.className = postcardFront.className.replace(/border-\w+/g, '').trim();
        if (btn.dataset.border !== 'none') {
            postcardFront.classList.add('border-' + btn.dataset.border);
        }
    });
});

function preserveBorderClass() {
    const activeBorder = $('[data-border].active');
    if (activeBorder && activeBorder.dataset.border !== 'none') {
        postcardFront.classList.add('border-' + activeBorder.dataset.border);
    }
}

// ── Brightness / Contrast / Saturation ──
const brightness = $('#brightness');
const contrast = $('#contrast');
const saturation = $('#saturation');

function updateAdjustments() {
    const b = brightness.value / 100;
    const c = contrast.value / 100;
    const s = saturation.value / 100;

    const existing = postcardImage.style.filter;
    const themeFilter = getComputedStyle(postcardImage).filter;
    const base = (themeFilter && themeFilter !== 'none') ? '' : '';

    postcardImage.style.filter = `brightness(${b}) contrast(${c}) saturate(${s})`;
}

brightness.addEventListener('input', updateAdjustments);
contrast.addEventListener('input', updateAdjustments);
saturation.addEventListener('input', updateAdjustments);

// ── Flip ──
$('#btnFlip').addEventListener('click', () => {
    isFlipped = !isFlipped;
    postcardCard.classList.toggle('flipped', isFlipped);
});

// ── Capture Postcard ──
function capturePostcard() {
    const wasFlipped = isFlipped;
    if (wasFlipped) {
        postcardCard.classList.remove('flipped');
    }

    return html2canvas(postcardFront, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
    }).then(canvas => {
        if (wasFlipped) {
            postcardCard.classList.add('flipped');
        }
        return canvas;
    });
}

function downloadAs(format) {
    capturePostcard().then(canvas => {
        const ext = format === 'jpeg' ? 'jpg' : 'png';
        const link = document.createElement('a');
        link.download = `postcard.${ext}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.95);
        link.click();
    });
}

// ── Download ──
$('#btnDownload').addEventListener('click', () => {
    $('#downloadModal').classList.add('active');
});

$('#dlModalClose').addEventListener('click', () => {
    $('#downloadModal').classList.remove('active');
});

$('#dlPng').addEventListener('click', () => {
    $('#downloadModal').classList.remove('active');
    downloadAs('png');
});

$('#dlJpg').addEventListener('click', () => {
    $('#downloadModal').classList.remove('active');
    downloadAs('jpeg');
});

// ── Share ──
$('#btnShare').addEventListener('click', () => {
    $('#shareModal').classList.add('active');
});

$('#modalClose').addEventListener('click', () => {
    $('#shareModal').classList.remove('active');
});

$('#shareCopy').addEventListener('click', async () => {
    const canvas = await capturePostcard();
    canvas.toBlob(async (blob) => {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            showToast();
        } catch {
            showToast('Could not copy — try Save PNG instead');
        }
    }, 'image/png');
});

$('#shareNative').addEventListener('click', async () => {
    if (!navigator.share) {
        showToast('Sharing not supported — try Copy or Save');
        return;
    }
    const canvas = await capturePostcard();
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'postcard.png', { type: 'image/png' });
        try {
            await navigator.share({ files: [file], title: 'My Postcard' });
        } catch {
            // user cancelled
        }
    }, 'image/png');
});

$('#sharePng').addEventListener('click', () => {
    $('#shareModal').classList.remove('active');
    downloadAs('png');
});

$('#shareJpg').addEventListener('click', () => {
    $('#shareModal').classList.remove('active');
    downloadAs('jpeg');
});

function showToast(msg) {
    const toast = $('#shareToast');
    if (msg) toast.textContent = msg;
    else toast.textContent = 'Copied to clipboard!';
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2000);
}

// Close modals on overlay click
$$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
});

// ── Print ──
$('#btnPrint').addEventListener('click', () => {
    if (isFlipped) {
        postcardCard.classList.remove('flipped');
        setTimeout(() => window.print(), 100);
        setTimeout(() => {
            if (isFlipped) postcardCard.classList.add('flipped');
        }, 200);
    } else {
        window.print();
    }
});

// ── Keyboard shortcut: Escape closes modals ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        $$('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
});
