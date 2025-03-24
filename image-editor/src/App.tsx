import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(event.target?.result as string);
          setProcessedImage(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = (filterType: 'blur' | 'sharpen' | 'rotate') => {
    if (!image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (filterType === 'rotate') {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(45 * Math.PI / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0);
        
        if (filterType === 'blur') {
          ctx.filter = 'blur(5px)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
        } else if (filterType === 'sharpen') {
          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1.0;
        }
      }
      
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    
    img.src = image;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Editor de Imagem</h1>
        
        <div className="image-upload">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            ref={fileInputRef}
          />
          <button onClick={() => fileInputRef.current?.click()}>
            Upar imagem
          </button>
        </div>
        
        {processedImage && (
          <div className="image-container">
            <img src={processedImage} alt="Processed" />
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="controls">
          <button 
            onClick={() => applyFilter('blur')} 
            disabled={!image}
          >
            Blur
          </button>
          <button 
            onClick={() => applyFilter('sharpen')} 
            disabled={!image}
          >
            Sharpening
          </button>
          <button 
            onClick={() => applyFilter('rotate')} 
            disabled={!image}
          >
            Rotacionar 45°
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
