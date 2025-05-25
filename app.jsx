import { useState, useRef } from 'react';

export default function App() {
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">مُنشئ وطباعة البوسترات الإعلانية</h1>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (عرض خاص)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="عرض خاص"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المادة</label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم المادة"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="أدخل السعر"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اتجاه الطباعة</label>
                <select
                  name="orientation"
                  value={formData.orientation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="portrait">عمودي</option>
                  <option value="landscape">أفقي</option>
                </select>
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-gray-700">خصائص النصوص:</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حجم خط العنوان</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="titleFontSize"
                      value={parseInt(formData.titleFontSize)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          titleFontSize: `${e.target.value}pt`,
                        })
                      }
                      min="8"
                      max="100"
                      step="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-gray-500">pt</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">لون العنوان</label>
                  <input
                    type="color"
                    name="titleColor"
                    value={formData.titleColor}
                    onChange={handleInputChange}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حجم خط المادة</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="productFontSize"
                      value={parseInt(formData.productFontSize)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productFontSize: `${e.target.value}pt`,
                        })
                      }
                      min="8"
                      max="100"
                      step="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-gray-500">pt</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">لون المادة</label>
                  <input
                    type="color"
                    name="productColor"
                    value={formData.productColor}
                    onChange={handleInputChange}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حجم خط السعر</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="priceFontSize"
                      value={parseInt(formData.priceFontSize)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priceFontSize: `${e.target.value}pt`,
                        })
                      }
                      min="8"
                      max="100"
                      step="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="mr-2 text-gray-500">pt</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">لون السعر</label>
                  <input
                    type="color"
                    name="priceColor"
                    value={formData.priceColor}
                    onChange={handleInputChange}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="font-semibold text-gray-700">اختيار الخلفية:</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخلفية</label>
                  <select
                    name="backgroundType"
                    value={formData.backgroundType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">الخلفية الافتراضية</option>
                    <option value="white">لا شيء - خلفية بيضاء</option>
                    <option value="custom">اختر صورة خاصة</option>
                  </select>
                </div>

                {formData.backgroundType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اختر صورة للخلفية</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                 file:rounded-md file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-blue-50 file:text-blue-700
                                 hover:file:bg-blue-100"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شفافية الخلفية ({(parseFloat(formData.backgroundOpacity) * 100).toFixed(0)}%)
                  </label>
                  <input
                    type="range"
                    name="backgroundOpacity"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.backgroundOpacity}
                    onChange={handleInputChange}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>شفاف</span>
                    <span>كامل</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPreviewBackground('/images/alfajr.png');
                    setFormData(prev => ({
                      ...prev,
                      backgroundType: 'default',
                      backgroundOpacity: '0.3',
                      backgroundImageFile: null
                    }));
                  }}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  استعادة الصورة الافتراضية
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm0 0V7"></path>
                </svg>
                طباعة بصيغة A4
              </button>
            </div>

            {/* Poster Preview */}
            <div className="hidden md:block">
              <div 
                ref={posterRef} 
                className={`border rounded-lg overflow-hidden relative mx-auto`}
                style={{
                  width: formData.orientation === 'landscape' ? '297mm' : '210mm',
                  height: formData.orientation === 'landscape' ? '210mm' : '297mm',
                  backgroundColor: formData.backgroundType === 'white' ? '#ffffff' : undefined,
                  backgroundImage: previewBackground ? `url(${previewBackground})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: formData.backgroundType === 'white' ? 1 : formData.backgroundOpacity,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center" style={{ zIndex: 1 }}>
                  <h1 
                    className="title font-bold" 
                    style={{
                      fontSize: formData.titleFontSize,
                      color: formData.titleColor
                    }}
                  >
                    {formData.title || "عرض خاص"}
                  </h1>
                  <p 
                    className="product mt-4" 
                    style={{
                      fontSize: formData.productFontSize,
                      color: formData.productColor
                    }}
                  >
                    {formData.product || "اسم المادة"}
                  </p>
                  <p 
                    className="price mt-2" 
                    style={{
                      fontSize: formData.priceFontSize,
                      color: formData.priceColor
                    }}
                  >
                    {formData.price ? `${formData.price} د.ك` : "السعر"}
                  </p>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 text-center">
                معاينة بصيغة A4 {formData.orientation === 'landscape' ? '(أفقي)' : '(عمودي)'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>CopyRight Ghaith Alrawi</p>
        </div>
      </div>
    </div>
  );
}
