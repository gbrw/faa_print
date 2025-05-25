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
    
    // تحديد اتجاه PDF بناءً على إعداد المستخدم
    const orientation = orientationSelect.value === 'landscape' ? 'landscape' : 'portrait';

    // نختار القياس بالملليمتر لتكون دقيقة كما في A4
    const a4WidthMm = orientation === 'landscape' ? 297 : 210;
    const a4HeightMm = orientation === 'landscape' ? 210 : 297;

    // تحويل القياسات إلى بكسل باستخدام نسبة DPI = 300
    const dpi = 300;
    const widthInPx = (a4WidthMm / 25.4) * dpi;
    const heightInPx = (a4HeightMm / 25.4) * dpi;

    const pdf = new jsPDF({
      orientation: orientation,
      unit: "px",
      format: [widthInPx, heightInPx]
    });

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, 'PNG', 0, 0, widthInPx, heightInPx);
    pdf.save('poster.pdf');
  });
}

// دالة إنشاء Canvas بأبعاد A4 حسب الاتجاه
async function generateA4Canvas(resolve) {
  let isLandscape = orientationSelect.value === 'landscape';

  // أبعاد A4 بـ 300 DPI
  const DPI = 300;
  const MM_TO_INCH = 0.0393701;
  const A4_WIDTH_MM = isLandscape ? 297 : 210;
  const A4_HEIGHT_MM = isLandscape ? 210 : 297;

  const widthPx = Math.floor(A4_WIDTH_MM * MM_TO_INCH * DPI);
  const heightPx = Math.floor(A4_HEIGHT_MM * MM_TO_INCH * DPI);

  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');

  // خلفية بيضاء
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // رسم الخلفية
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

  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = parseFloat(backgroundOpacity.value);

    // تمديد الصورة لتغطي الـ Canvas بالكامل مع المحافظة على النسبة
    const imageAspectRatio = bgImg.width / bgImg.height;
    const canvasAspectRatio = canvas.width / canvas.height;

    let drawWidth, drawHeight, dx, dy;

    if (imageAspectRatio > canvasAspectRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspectRatio;
      dx = 0;
      dy = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspectRatio;
      dx = (canvas.width - drawWidth) / 2;
      dy = 0;
    }

    ctx.drawImage(bgImg, dx, dy, drawWidth, drawHeight);
    ctx.restore();
  }

  // رسم النصوص
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

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
