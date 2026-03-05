const postcard = document.getElementById('postcard');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const previewImage = document.getElementById('previewImage');
const textOverlay = document.getElementById('textOverlay');
const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const textColor = document.getElementById('textColor');
const fontSize = document.getElementById('fontSize');

// Image Upload
postcard.addEventListener('click', () => fileInput.click());

postcard.addEventListener('dragover', (e) => {
    e.preventDefault();
    postcard.style.opacity = '0.7';
});

postcard.addEventListener('dragleave', () => {
    postcard.style.opacity = '1';
});

postcard.addEventListener('drop', (e) => {
    e.preventDefault();
    postcard.style.opacity = '1';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        loadImage(e.target.files[0]);
    }
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.hidden = false;
        uploadPrompt.hidden = true;
    };
    reader.readAsDataURL(file);
}

// Text Controls
textInput.addEventListener('input', () => {
    textOverlay.textContent = textInput.value;
});

fontSelect.addEventListener('change', () => {
    textOverlay.style.fontFamily = fontSelect.value;
});

textColor.addEventListener('input', () => {
    textOverlay.style.color = textColor.value;
});

fontSize.addEventListener('input', () => {
    textOverlay.style.fontSize = fontSize.value + 'px';
});

// Initialize text styles
textOverlay.style.fontFamily = fontSelect.value;
textOverlay.style.color = textColor.value;
textOverlay.style.fontSize = fontSize.value + 'px';
textOverlay.className = 'text-overlay center';

// Position Grid
document.querySelectorAll('.position-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.position-grid button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        textOverlay.className = 'text-overlay ' + btn.dataset.pos;
    });
});

// Border Options
document.querySelectorAll('.border-options button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.border-options button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        postcard.className = postcard.className.replace(/border-\w+/g, '').trim();
        if (btn.dataset.border !== 'none') {
            postcard.classList.add('border-' + btn.dataset.border);
        }
        // Preserve portrait class
        if (document.querySelector('.orientation-options button.active')?.dataset.orientation === 'portrait') {
            postcard.classList.add('portrait');
        }
    });
});

// Filter Options
document.querySelectorAll('.filter-options button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-options button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        postcard.className = postcard.className.replace(/filter-\w+/g, '').trim();
        if (btn.dataset.filter !== 'none') {
            postcard.classList.add('filter-' + btn.dataset.filter);
        }
        // Preserve portrait class
        if (document.querySelector('.orientation-options button.active')?.dataset.orientation === 'portrait') {
            postcard.classList.add('portrait');
        }
    });
});

// Orientation
document.querySelectorAll('.orientation-options button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.orientation-options button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.orientation === 'portrait') {
            postcard.classList.add('portrait');
        } else {
            postcard.classList.remove('portrait');
        }
    });
});

// Download Functions
function downloadPostcard(format) {
    if (!previewImage.src) {
        alert('Please upload an image first!');
        return;
    }

    html2canvas(postcard, {
        useCORS: true,
        scale: 2,
        backgroundColor: null
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `postcard.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.95);
        link.click();
    });
}

document.getElementById('downloadPng').addEventListener('click', () => downloadPostcard('png'));
document.getElementById('downloadJpg').addEventListener('click', () => downloadPostcard('jpeg'));
