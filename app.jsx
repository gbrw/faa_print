const { useState, useRef } = React;

function App() {
  const [formData, setFormData] = useState({
    title: 'عرض خاص',
    product: '',
    price: '',
    orientation: 'portrait',
    titleFontSize: '24pt',
    productFontSize: '18pt',
    priceFontSize: '20pt',
    titleColor: '#000000',
    productColor: '#000000',
    priceColor: '#e53e3e',
    backgroundType: 'default', // 'default' | 'custom' | 'white'
    backgroundOpacity: '0.3',
    backgroundImageFile: null,
  });

  const [previewBackground, setPreviewBackground] = useState('/images/alfajr.png');
  const posterRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'backgroundType') {
      if (value === 'default') {
        setPreviewBackground('/images/alfajr.png');
      } else if (value === 'white') {
        setPreviewBackground(null);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewBackground(e.target.result);
      };
      reader.readAsDataURL(file);

      setFormData((prev) => ({
        ...prev,
        backgroundType: 'custom',
        backgroundImageFile: file
      }));
    }
  };

  const handlePrint = () => {
    let finalBackgroundUrl = '';
    if (formData.backgroundType === 'default') {
      finalBackgroundUrl = '/images/alfajr.png';
    } else if (formData.backgroundType === 'custom' && previewBackground) {
      finalBackgroundUrl = previewBackground;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Poster Print</title>
          <style>
            @page {
              size: A4 ${formData.orientation === 'landscape' ? 'landscape' : 'portrait'};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .poster {
              width: ${formData.orientation === 'landscape' ? '297mm' : '210mm'};
              height: ${formData.orientation === 'landscape' ? '210mm' : '297mm'};
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              font-family: Arial, sans-serif;
              position: relative;
              page-break-inside: avoid;
              background-color: ${formData.backgroundType === 'white' ? '#ffffff' : 'transparent'};
            }
            .poster::before {
              content: ${finalBackgroundUrl !== '' ? `"\"\""` : 'none'};
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('${finalBackgroundUrl}');
              background-size: cover;
              background-position: center;
              opacity: ${formData.backgroundOpacity};
              z-index: 0;
            }
            .poster-content {
              position: relative;
              z-index: 1;
              color: black;
              text-shadow: ${formData.backgroundType === 'white' ? 'none' : '0 0 5px rgba(255,255,255,0.5)'};
            }
            .poster h1.title {
              font-size: ${formData.titleFontSize};
              margin: 0.5em 0;
              color: ${formData.titleColor};
            }
            .poster p.product {
              font-size: ${formData.productFontSize};
              margin: 0.5em 0;
              color: ${formData.productColor};
            }
            .poster p.price {
              font-size: ${formData.priceFontSize};
              margin: 0.5em 0;
              color: ${formData.priceColor};
            }
          </style>
        </head>
        <body>
          <div class="poster">
            <div class="poster-content">
              <h1 class="title">${formData.title}</h1>
              <p class="product">${formData.product || "اسم المادة"}</p>
              <p class="price">${formData.price ? `${formData.price} د.ك` : "السعر"}</p>
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
  };

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>مُنشئ وطباعة البوسترات الإعلانية</h1>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px #ccc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* الحقول */}
          <input name="title" value={formData.title} onChange={handleInputChange} placeholder="العنوان" />
          <input name="product" value={formData.product} onChange={handleInputChange} placeholder="اسم المادة" />
          <input name="price" value={formData.price} onChange={handleInputChange} placeholder="السعر" />

          <select name="orientation" value={formData.orientation} onChange={handleInputChange}>
            <option value="portrait">عمودي</option>
            <option value="landscape">أفقي</option>
          </select>

          {/* حجم الخطوط */}
          <label>حجم خط العنوان: <input type="number" name="titleFontSize" value={parseInt(formData.titleFontSize)} onChange={(e) => setFormData({...formData, titleFontSize: `${e.target.value}pt`})} min="8" max="100" /> pt</label>
          <label>حجم خط المادة: <input type="number" name="productFontSize" value={parseInt(formData.productFontSize)} onChange={(e) => setFormData({...formData, productFontSize: `${e.target.value}pt`})} min="8" max="100" /> pt</label>
          <label>حجم خط السعر: <input type="number" name="priceFontSize" value={parseInt(formData.priceFontSize)} onChange={(e) => setFormData({...formData, priceFontSize: `${e.target.value}pt`})} min="8" max="100" /> pt</label>

          {/* ألوان النصوص */}
          <label>لون العنوان: <input type="color" name="titleColor" value={formData.titleColor} onChange={handleInputChange} /></label>
          <label>لون المادة: <input type="color" name="productColor" value={formData.productColor} onChange={handleInputChange} /></label>
          <label>لون السعر: <input type="color" name="priceColor" value={formData.priceColor} onChange={handleInputChange} /></label>

          {/* الخلفية */}
          <select name="backgroundType" value={formData.backgroundType} onChange={handleInputChange}>
            <option value="default">الخلفية الافتراضية</option>
            <option value="white">لا شيء - خلفية بيضاء</option>
            <option value="custom">اختر صورة خاصة</option>
          </select>

          {formData.backgroundType === 'custom' && (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}

          <label>شفافية الخلفية: {Math.round(formData.backgroundOpacity * 100)}% 
            <input type="range" name="backgroundOpacity" min="0" max="1" step="0.01" value={formData.backgroundOpacity} onChange={handleInputChange} />
          </label>

          <button onClick={handlePrint} style={{ padding: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '5px' }}>
            طباعة بصيغة A4
          </button>
        </div>

        {/* معاينة */}
        <div style={{
          marginTop: '30px',
          width: formData.orientation === 'landscape' ? '297mm' : '210mm',
          height: formData.orientation === 'landscape' ? '210mm' : '297mm',
          backgroundColor: formData.backgroundType === 'white' ? '#fff' : undefined,
          backgroundImage: previewBackground ? `url(${previewBackground})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #ccc',
          margin: 'auto',
          position: 'relative',
          opacity: formData.backgroundType === 'white' ? 1 : formData.backgroundOpacity
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            zIndex: 1,
            color: '#000'
          }}>
            <h1 style={{ fontSize: formData.titleFontSize, color: formData.titleColor }}>{formData.title || "عرض خاص"}</h1>
            <p style={{ fontSize: formData.productFontSize, color: formData.productColor }}>{formData.product || "اسم المادة"}</p>
            <p style={{ fontSize: formData.priceFontSize, color: formData.priceColor }}>{formData.price ? `${formData.price} د.ك` : "السعر"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
