const titleInput = document.getElementById('title');
const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const orientationSelect = document.getElementById('orientation');
const posterPreview = document.getElementById('posterPreview');

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
      updatePreview();
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

  const bgOverlay = posterPreview.querySelector('.bg-overlay');

  if (backgroundType.value === 'white') {
    bgOverlay.style.backgroundImage = 'none';
    bgOverlay.style.backgroundColor = '#ffffff';
    bgOverlay.style.opacity = backgroundOpacity.value;
  } else if (backgroundType.value === 'default') {
    bgOverlay.style.backgroundImage = `url(/images/alfajr.png)`;
    bgOverlay.style.backgroundColor = 'transparent';
    bgOverlay.style.opacity = backgroundOpacity.value;
  } else if (bgImageSrc) {
    bgOverlay.style.backgroundImage = `url(${bgImageSrc})`;
    bgOverlay.style.backgroundColor = 'transparent';
    bgOverlay.style.opacity = backgroundOpacity.value;
  }

  // Orientation
  const isLandscape = orientationSelect.value === 'landscape';
  posterPreview.className = `poster ${isLandscape ? 'landscape' : 'portrait'}`;
}

function printPoster() {
  const orientation = orientationSelect.value;
  const width = orientation === 'landscape' ? '297mm' : '210mm';
  const height = orientation === 'landscape' ? '210mm' : '297mm';

  const bgUrl =
    backgroundType.value === 'default'
      ? '/images/alfajr.png'
      : bgImageSrc || '';

  const bgColor = backgroundType.value === 'white' ? '#ffffff' : 'transparent';

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
          body {
            background-color: ${bgColor};
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

updatePreview();
