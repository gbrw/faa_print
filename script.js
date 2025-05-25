const titleInput = document.getElementById('title');
const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const orientationSelect = document.getElementById('orientation');

// Font Sizes
const titleFontSize = document.getElementById('titleFontSize');
const productFontSize = document.getElementById('productFontSize');
const priceFontSize = document.getElementById('priceFontSize');

document.getElementById('titleFontSizeVal').textContent = titleFontSize.value;
document.getElementById('productFontSizeVal').textContent = productFontSize.value;
document.getElementById('priceFontSizeVal').textContent = priceFontSize.value;

titleFontSize.addEventListener('input', () => {
  document.getElementById('titleFontSizeVal').textContent = titleFontSize.value;
  updateCanvasPreview();
});

productFontSize.addEventListener('input', () => {
  document.getElementById('productFontSizeVal').textContent = productFontSize.value;
  updateCanvasPreview();
});

priceFontSize.addEventListener('input', () => {
  document.getElementById('priceFontSizeVal').textContent = priceFontSize.value;
  updateCanvasPreview();
});

// Colors
const titleColor = document.getElementById('titleColor');
const productColor = document.getElementById('productColor');
const priceColor = document.getElementById('priceColor');

// Background
const backgroundType = document.getElementById('backgroundType');
const backgroundImageInput = document.getElementById('backgroundImage');
const backgroundOpacity = document.getElementById('backgroundOpacity');
const customBackgroundInput = document.getElementById('customBackgroundInput');
let bgImageSrc = '/images/alfajr.png';
let backgroundImageObj = null;

backgroundType.addEventListener('change', () => {
  if (backgroundType.value === 'custom') {
    customBackgroundInput.style.display = 'block';
  } else {
    customBackgroundInput.style.display = 'none';
  }
  updateCanvasPreview();
});

backgroundImageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      bgImageSrc = e.target.result;
      backgroundImageObj = new Image();
      backgroundImageObj.src = bgImageSrc;
      backgroundImageObj.onload = () => updateCanvasPreview();
    };
    reader.readAsDataURL(file);
  }
});

backgroundOpacity.addEventListener('input', () => {
  document.getElementById('opacityVal').textContent = Math.round(backgroundOpacity.value * 100);
  updateCanvasPreview();
});

titleInput.addEventListener('input', updateCanvasPreview);
productInput.addEventListener('input', updateCanvasPreview);
priceInput.addEventListener('input', updateCanvasPreview);

// --- معاينة Canvas ---
function updateCanvasPreview() {
  const poster = document.getElementById('posterPreview');
  const ctx = poster.getContext('2d');
  const isLandscape = orientationSelect.value === 'landscape';

  const widthMM = isLandscape ? 297 : 210;
  const heightMM = isLandscape ? 210 : 297;

  const DPI = 300;
  const MM_TO_INCH = 0.0393701;

  const widthPx = Math.floor(widthMM * MM_TO_INCH * DPI);
  const heightPx = Math.floor(heightMM * MM_TO_INCH * DPI);

  poster.width = widthPx;
  poster.height = heightPx;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // رسم الخلفية
  let bgImg = null;

  if (backgroundType.value === 'default') {
    bgImg = new Image();
    bgImg.src = '/images/alfajr.png';
    bgImg.onload = () => drawPosterOnCanvas(ctx, bgImg, widthPx, heightPx);
  } else if (backgroundType.value === 'custom' && backgroundImageObj && backgroundImageObj.complete) {
    bgImg = backgroundImageObj;
    drawPosterOnCanvas(ctx, bgImg, widthPx, heightPx);
  } else {
    drawPosterOnCanvas(ctx, null, widthPx, heightPx);
  }
}

function drawPosterOnCanvas(ctx, bgImg, widthPx, heightPx) {
  const centerX = widthPx / 2;
  const centerY = heightPx / 2;

  // خلفية بيضاء افتراضية
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // رسم الخلفية
  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = parseFloat(backgroundOpacity.value);

    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = widthPx / heightPx;

    let drawWidth, drawHeight, dx, dy;

    if (imgRatio > canvasRatio) {
      drawWidth = widthPx;
      drawHeight = widthPx / imgRatio;
      dx = 0;
      dy = (heightPx - drawHeight) / 2;
    } else {
      drawHeight = heightPx;
      drawWidth = heightPx * imgRatio;
      dx = (widthPx - drawWidth) / 2;
      dy = 0;
    }

    ctx.drawImage(bgImg, dx, dy, drawWidth, drawHeight);
    ctx.restore();
  } else if (backgroundType.value === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, widthPx, heightPx);
  }

  // رسم النصوص
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // العنوان
  ctx.font = `${parseInt(titleFontSize.value)}pt Cairo, Arial, sans-serif`;
  ctx.fillStyle = titleColor.value;
  ctx.fillText(titleInput.value || 'عرض خاص', centerX, centerY - 300);

  // اسم المادة
  ctx.font = `${parseInt(productFontSize.value)}pt Cairo, Arial, sans-serif`;
  ctx.fillStyle = productColor.value;
  ctx.fillText(productInput.value || 'اسم المادة', centerX, centerY);

  // السعر
  ctx.font = `${parseInt(priceFontSize.value)}pt Cairo, Arial, sans-serif`;
  ctx.fillStyle = priceColor.value;
  ctx.fillText(priceInput.value ? `${priceInput.value} د.ع` : 'السعر', centerX, centerY + 300);
}

// --- إنشاء Canvas بدقة A4 حقيقية ---
function generateA4Canvas(resolve, isLandscape = false) {
  const widthMM = isLandscape ? 297 : 210;
  const heightMM = isLandscape ? 210 : 297;

  const DPI = 300;
  const MM_TO_INCH = 0.0393701;

  const widthPx = Math.floor(widthMM * MM_TO_INCH * DPI);
  const heightPx = Math.floor(heightMM * MM_TO_INCH * DPI);

  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  // تحميل الصورة
  let bgImg = null;

  if (backgroundType.value === 'default') {
    bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = '/images/alfajr.png';
    bgImg.onload = () => {
      drawPosterOnCanvasInternal(ctx, bgImg, widthPx, heightPx);
      resolve(canvas);
    };
  } else if (backgroundType.value === 'custom' && bgImageSrc) {
    bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = bgImageSrc;
    bgImg.onload = () => {
      drawPosterOnCanvasInternal(ctx, bgImg, widthPx, heightPx);
      resolve(canvas);
    };
  } else {
    drawPosterOnCanvasInternal(ctx, null, widthPx, heightPx);
    resolve(canvas);
  }
}

function drawPosterOnCanvasInternal(ctx, bgImg, widthPx, heightPx) {
  const centerX = widthPx / 2;
  const centerY = heightPx / 2;

  // رسم الخلفية
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = parseFloat(backgroundOpacity.value);

    const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = widthPx / heightPx;

    let drawWidth, drawHeight, dx, dy;

    if (imgRatio > canvasRatio) {
      drawWidth = widthPx;
      drawHeight = widthPx / imgRatio;
      dx = 0;
      dy = (heightPx - drawHeight) / 2;
    } else {
      drawHeight = heightPx;
      drawWidth = heightPx * imgRatio;
      dx = (widthPx - drawWidth) / 2;
      dy = 0;
    }

    ctx.drawImage(bgImg, dx, dy, drawWidth, drawHeight);
    ctx.restore();
  }

  // رسم النصوص
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // العنوان
  ctx.font = `${parseInt(titleFontSize.value)}pt Cairo, Arial, sans-serif`;
  ctx.fillStyle = titleColor.value;
  ctx.fillText(titleInput.value || 'عرض خاص', centerX, centerY - 300);

  // اسم المادة
  ctx.font = `${parseInt(productFontSize.value)}pt Cairo, Arial, sans-serif`;
  ctx.fillStyle = productColor.value;
  ctx.fillText(productInput.value || 'اسم المادة', centerX, centerY);

  // السعر
  ctx.font = `${parseInt(priceFontSize.value)}pt Cairo, Arial, sans-serif`;
  ctx.fillStyle = priceColor.value;
  ctx.fillText(priceInput.value ? `${priceInput.value} د.ع` : 'السعر', centerX, centerY + 300);
}

// --- زر الطباعة ---
function printPoster() {
  const isLandscape = orientationSelect.value === 'landscape';

  new Promise((resolve) => generateA4Canvas(resolve, isLandscape)).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>طباعة</title></head>
        <style>
          @media print {
            @page {
              size: A4 ${isLandscape ? 'landscape' : 'portrait'};
              margin: 0;
            }
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          img {
            width: ${isLandscape ? '297mm' : '210mm'};
            height: ${isLandscape ? '210mm' : '297mm'};
            image-rendering: optimizeQuality;
          }
        </style>
        <body onload="window.print(); window.close();">
          <img src="${imgData}" />
        </body>
      </html>
    `);

    printWindow.document.close();
  });
}

// --- تنزيل كصورة ---
function downloadPosterAsImage() {
  const isLandscape = orientationSelect.value === 'landscape';
  new Promise((resolve) => generateA4Canvas(resolve, isLandscape)).then(canvas => {
    const link = document.createElement('a');
    link.download = 'poster.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// --- تنزيل كـ PDF ---
function downloadPosterAsPDF() {
  const isLandscape = orientationSelect.value === 'landscape';
  new Promise((resolve) => generateA4Canvas(resolve, isLandscape)).then(canvas => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('poster.pdf');
  });
}
