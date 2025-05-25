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
  updatePreview();
});

productFontSize.addEventListener('input', () => {
  document.getElementById('productFontSizeVal').textContent = productFontSize.value;
  updatePreview();
});

priceFontSize.addEventListener('input', () => {
  document.getElementById('priceFontSizeVal').textContent = priceFontSize.value;
  updatePreview();
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
  updatePreview();
});

backgroundImageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      bgImageSrc = e.target.result;
      backgroundImageObj = new Image();
      backgroundImageObj.src = bgImageSrc;
      backgroundImageObj.onload = () => updatePreview();
    };
    reader.readAsDataURL(file);
  }
});

backgroundOpacity.addEventListener('input', () => {
  document.getElementById('opacityVal').textContent = Math.round(backgroundOpacity.value * 100);
  updatePreview();
});

function updatePreview() {
  const title = document.getElementById('previewTitle');
  const product = document.getElementById('previewProduct');
  const price = document.getElementById('previewPrice');

  title.textContent = titleInput.value || "عرض خاص";
  product.textContent = productInput.value || "اسم المادة";
  price.textContent = priceInput.value ? `${priceInput.value} د.ع` : "السعر";

  title.style.fontSize = titleFontSize.value + 'pt';
  product.style.fontSize = productFontSize.value + 'pt';
  price.style.fontSize = priceFontSize.value + 'pt';

  title.style.color = titleColor.value;
  product.style.color = productColor.value;
  price.style.color = priceColor.value;

  const bgOverlay = document.querySelector('.bg-overlay');

  if (backgroundType.value === 'white') {
    bgOverlay.style.backgroundImage = 'none';
    bgOverlay.style.backgroundColor = '#ffffff';
    bgOverlay.style.opacity = backgroundOpacity.value;
  } else if (backgroundType.value === 'default') {
    bgOverlay.style.backgroundImage = `url(/images/alfajr.png)`;
    bgOverlay.style.backgroundColor = 'transparent';
    bgOverlay.style.opacity = backgroundOpacity.value;
    if (!backgroundImageObj) {
      backgroundImageObj = new Image();
      backgroundImageObj.src = '/images/alfajr.png';
    }
  } else if (bgImageSrc) {
    bgOverlay.style.backgroundImage = `url(${bgImageSrc})`;
    bgOverlay.style.backgroundColor = 'transparent';
    bgOverlay.style.opacity = backgroundOpacity.value;
  }

  // Orientation
  const isLandscape = orientationSelect.value === 'landscape';
  posterPreview.className = `poster ${isLandscape ? 'landscape' : ''}`;
}

function printPoster() {
  const orientation = orientationSelect.value;
  const width = orientation === 'landscape' ? '297mm' : '210mm';
  const height = orientation === 'landscape' ? '210mm' : '297mm';

  const bgColor = backgroundType.value === 'white' ? '#ffffff' : 'transparent';
  const bgUrl = backgroundType.value === 'default'
    ? '/images/alfajr.png'
    : bgImageSrc || '';

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>طباعة البوستر</title>
        <style>
          @page {
            size: A4 ${orientation === 'landscape' ? 'landscape' : 'portrait'};
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white;
          }
          .poster {
            width: ${width};
            height: ${height};
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-family: Arial, sans-serif;
            color: black;
            page-break-inside: avoid;
            position: relative;
            background-color: ${bgColor};
          }
          .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: ${backgroundOpacity.value};
            z-index: 0;
          }
          .content {
            z-index: 1;
            text-shadow: ${bgColor !== 'transparent' ? 'none' : '0 0 5px rgba(255,255,255,0.5)'};
            padding: 20px;
            text-align: center;
          }
          h1 {
            font-size: ${titleFontSize.value}pt;
            color: ${titleColor.value};
            margin: 0.5em 0;
          }
          p {
            font-size: ${productFontSize.value}pt;
            color: ${productColor.value};
            margin: 0.5em 0;
          }
          .price {
            font-size: ${priceFontSize.value}pt;
            color: ${priceColor.value};
          }
        </style>
      </head>
      <body>
        <div class="poster">
          ${bgUrl ? `<img src="${bgUrl}" alt="Background" class="bg-img" />` : ''}
          <div class="content">
            <h1>${titleInput.value}</h1>
            <p>${productInput.value || "اسم المادة"}</p>
            <p class="price">${priceInput.value ? `${priceInput.value} د.ع` : "السعر"}</p>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// تحديد مقاس A4 بالبكسل (300dpi)
const A4_WIDTH_PX = 2480; // A4 أفقي 297mm × 210mm × 300dpi ≈ 2480x3508px
const A4_HEIGHT_PX = 3508;

async function generateA4Canvas(resolve) {
  const canvas = document.createElement('canvas');
  canvas.width = A4_WIDTH_PX;
  canvas.height = A4_HEIGHT_PX;
  const ctx = canvas.getContext('2d');

  // خلفية بيضاء
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let bgImg = null;

  if (backgroundType.value === 'default') {
    bgImg = new Image();
    bgImg.src = '/images/alfajr.png';
    await new Promise(r => bgImg.onload = r);
  } else if (backgroundType.value === 'custom' && bgImageSrc) {
    bgImg = new Image();
    bgImg.src = bgImageSrc;
    await new Promise(r => bgImg.onload = r);
  }

  // رسم الخلفية
  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = parseFloat(backgroundOpacity.value);
    ctx.drawImage(bgImg, 0, 0, A4_WIDTH_PX, A4_HEIGHT_PX);
    ctx.restore();
  }

  // إعداد الخطوط
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerX = A4_WIDTH_PX / 2;
  const centerY = A4_HEIGHT_PX / 2;

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

  resolve(canvas);
}

function downloadPosterAsImage() {
  new Promise(generateA4Canvas).then(canvas => {
    const link = document.createElement('a');
    link.download = 'poster.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

function downloadPosterAsPDF() {
  new Promise(generateA4Canvas).then(canvas => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: orientationSelect.value === 'landscape' ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('poster.pdf');
  });
}
