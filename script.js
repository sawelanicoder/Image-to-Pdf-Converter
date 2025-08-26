const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const themeToggle = document.getElementById('themeToggle');
const loading = document.getElementById('loading');
let filesArray = [];

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', e => handleFiles(e.target.files));

function handleFiles(files) {
    [...files].forEach(file => {
        if (file.type.startsWith('image/')) {
            filesArray.push(file);
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement('img');
                img.src = e.target.result;
                const remove = document.createElement('button');
                remove.innerHTML = '×';
                remove.classList.add('remove-btn');
                remove.onclick = () => {
                    filesArray = filesArray.filter(f => f !== file);
                    preview.removeChild(wrapper);
                };
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.appendChild(img);
                wrapper.appendChild(remove);
                preview.appendChild(wrapper);
            };
            reader.readAsDataURL(file);
        }
    });
}

document.getElementById('convertBtn').addEventListener('click', async () => {
    if (!filesArray.length) {
        alert("Please select images first.");
        return;
    }
    loading.style.display = 'block';
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: document.getElementById('orientation').value,
        unit: 'pt',
        format: document.getElementById('pageSize').value
    });
    for (let i = 0; i < filesArray.length; i++) {
        const imgData = await readFileAsDataURL(filesArray[i]);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const img = new Image();
        img.src = imgData;
        await new Promise(res => img.onload = res);
        let ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        let imgWidth = img.width * ratio;
        let imgHeight = img.height * ratio;
        let x = (pageWidth - imgWidth) / 2;
        let y = (pageHeight - imgHeight) / 2;
        pdf.addImage(img, 'JPEG', x, y, imgWidth, imgHeight);
        if (i < filesArray.length - 1) pdf.addPage();
    }
    pdf.save('converted.pdf');
    loading.style.display = 'none';
});

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

