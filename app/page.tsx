"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, Settings, Image as ImageIcon, Grid3X3, Palette } from "lucide-react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState(30);
  const [showGrid, setShowGrid] = useState(true);
  const [matchColors, setMatchColors] = useState(true);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [colorStats, setColorStats] = useState<{id: string, nameCn: string, nameEn: string, hex: string, count: number}[]>([]);
  
  // Perler standard colors (IDs P01-P190) with Chinese and English names
  const PINDOU_COLORS = [
    { id: "P01", nameCn: "白色", nameEn: "White", hex: "#FFFFFF" },
    { id: "P02", nameCn: "奶油色", nameEn: "Cream", hex: "#F3EED9" },
    { id: "P03", nameCn: "黄色", nameEn: "Yellow", hex: "#F6E000" },
    { id: "P04", nameCn: "橙色", nameEn: "Orange", hex: "#F58023" },
    { id: "P05", nameCn: "红色", nameEn: "Red", hex: "#D01C1F" },
    { id: "P06", nameCn: "泡泡糖粉", nameEn: "Bubblegum", hex: "#E989B1" },
    { id: "P07", nameCn: "紫色", nameEn: "Purple", hex: "#633B91" },
    { id: "P08", nameCn: "深蓝", nameEn: "Dark Blue", hex: "#2C3E8A" },
    { id: "P09", nameCn: "浅蓝", nameEn: "Light Blue", hex: "#47A5D8" },
    { id: "P10", nameCn: "深绿", nameEn: "Dark Green", hex: "#00693E" },
    { id: "P11", nameCn: "绿松石", nameEn: "Turquoise", hex: "#009DA3" },
    { id: "P12", nameCn: "褐色", nameEn: "Brown", hex: "#5C3D2E" },
    { id: "P17", nameCn: "灰色", nameEn: "Grey", hex: "#8A8D8F" },
    { id: "P18", nameCn: "黑色", nameEn: "Black", hex: "#231F20" },
    { id: "P19", nameCn: "透明", nameEn: "Clear", hex: "#D1D3D4" },
    { id: "P20", nameCn: "锈色", nameEn: "Rust", hex: "#943A2A" },
    { id: "P21", nameCn: "浅褐", nameEn: "Light Brown", hex: "#9B7653" },
    { id: "P23", nameCn: "深灰/炭灰", nameEn: "Dark Grey / Charcoal", hex: "#414042" },
    { id: "P33", nameCn: "桃红", nameEn: "Peach", hex: "#F8B39B" },
    { id: "P35", nameCn: "浅灰", nameEn: "Light Grey", hex: "#BCBEC0" },
    { id: "P38", nameCn: "茶色", nameEn: "Tan", hex: "#C59F7C" },
    { id: "P42", nameCn: "荧光绿", nameEn: "Hot Coral (Neon)", hex: "#FF5E5E" },
    { id: "P43", nameCn: "玫红", nameEn: "Magenta", hex: "#BF1E5E" },
    { id: "P47", nameCn: "牙膏蓝", nameEn: "Toothpaste", hex: "#95D5D3" },
    { id: "P48", nameCn: "荧光黄", nameEn: "Neon Yellow", hex: "#DBE000" },
    { id: "P49", nameCn: "荧光橙", nameEn: "Neon Orange", hex: "#FF6E00" },
    { id: "P50", nameCn: "橄榄绿", nameEn: "Olive", hex: "#545C2B" },
    { id: "P51", nameCn: "猕猴桃绿", nameEn: "Kiwi Lime", hex: "#83BF4F" },
    { id: "P52", nameCn: "钴蓝", nameEn: "Cobalt", hex: "#1F4E99" },
    { id: "P53", nameCn: "夹竹桃", nameEn: "Blush", hex: "#F2A8A1" },
    { id: "P54", nameCn: "淡紫", nameEn: "Pastel Lavender", hex: "#A894C2" },
    { id: "P55", nameCn: "切达黄", nameEn: "Cheddar", hex: "#F7B51D" },
    { id: "P56", nameCn: "淡黄", nameEn: "Pastel Yellow", hex: "#FFEC91" },
    { id: "P57", nameCn: "鹦鹉绿", nameEn: "Parrot Green", hex: "#009B4E" },
    { id: "P58", nameCn: "浅绿", nameEn: "Pastel Green", hex: "#94C9A2" },
    { id: "P59", nameCn: "湖蓝", nameEn: "Pastel Blue", hex: "#99C7E8" },
    { id: "P60", nameCn: "李子色", nameEn: "Plum", hex: "#632D51" },
    { id: "P61", nameCn: "覆盆子", nameEn: "Raspberry", hex: "#B11E44" },
    { id: "P62", nameCn: "石灰绿", nameEn: "Lime Green", hex: "#8DC63F" },
    { id: "P63", nameCn: "蔓越莓", nameEn: "Cranberry", hex: "#931B2A" },
    { id: "P70", nameCn: "沙色", nameEn: "Sand", hex: "#D6C09A" },
    { id: "P79", nameCn: "杏色", nameEn: "Apricot", hex: "#F9AD81" },
    { id: "P80", nameCn: "青绿", nameEn: "Green", hex: "#00A950" },
    { id: "P81", nameCn: "蓝莓色", nameEn: "Blueberry", hex: "#4F5EAB" },
    { id: "P82", nameCn: "樱桃红", nameEn: "Cherry", hex: "#BE1E2D" },
    { id: "P83", nameCn: "粉红", nameEn: "Pink", hex: "#F49AC1" },
    { id: "P84", nameCn: "珠光白", nameEn: "Pearl", hex: "#E6E7E8" },
    { id: "P85", nameCn: "金色 (金属)", nameEn: "Gold", hex: "#B19664" },
    { id: "P86", nameCn: "银色 (金属)", nameEn: "Silver", hex: "#A7A9AC" },
    { id: "P87", nameCn: "葡萄紫", nameEn: "Grape", hex: "#563A8B" },
    { id: "P88", nameCn: "树莓色", nameEn: "Raspberry", hex: "#B11E44" },
    { id: "P90", nameCn: "知更鸟蓝", nameEn: "Robin's Egg", hex: "#77C5D5" },
    { id: "P91", nameCn: "橘红", nameEn: "Hot Coral", hex: "#F36D6E" },
    { id: "P92", nameCn: "乳酪色", nameEn: "Butterscotch", hex: "#E29F55" },
    { id: "P93", nameCn: "烤面包色", nameEn: "Toasted Marshmallow", hex: "#E7D1B1" },
    { id: "P94", nameCn: "淡粉", nameEn: "Light Pink", hex: "#FBBCC6" },
    { id: "P95", nameCn: "浅薰衣草", nameEn: "Lavender", hex: "#C7B3D6" },
    { id: "P96", nameCn: "枣红", nameEn: "Maroon", hex: "#6E2333" },
    { id: "P97", nameCn: "桑葚色", nameEn: "Mulberry", hex: "#8E2B5A" },
    { id: "P98", nameCn: "陶土色", nameEn: "Clay", hex: "#B05C49" },
    { id: "P99", nameCn: "橘子色", nameEn: "Tangerine", hex: "#F37032" },
    { id: "P100", nameCn: "长春花蓝", nameEn: "Periwinkle", hex: "#8088C5" },
    { id: "P101", nameCn: "青豆绿", nameEn: "Shamrok", hex: "#007F50" },
    { id: "P102", nameCn: "亮绿", nameEn: "Bright Green", hex: "#00A651" },
    { id: "P103", nameCn: "芥末黄", nameEn: "Mustard", hex: "#B1902E" },
    { id: "P104", nameCn: "浅陶土", nameEn: "Fawn", hex: "#BC9475" },
    { id: "P105", nameCn: "浅烟灰", nameEn: "Pewter", hex: "#7E7F81" },
    { id: "P106", nameCn: "暮光蓝", nameEn: "Twilight Plum", hex: "#483F57" },
    { id: "P107", nameCn: "迷雾蓝", nameEn: "Mist", hex: "#B8C9D3" },
    { id: "P108", nameCn: "午夜蓝", nameEn: "Midnight", hex: "#232A44" },
    { id: "P109", nameCn: "鼠尾草绿", nameEn: "Sage", hex: "#8A9977" },
    { id: "P110", nameCn: "仙人掌绿", nameEn: "Cactus", hex: "#4C6B45" },
    { id: "P111", nameCn: "蕨绿", nameEn: "Fern", hex: "#638C4F" },
    { id: "P112", nameCn: "姜黄", nameEn: "Spice", hex: "#AD5331" },
    { id: "P113", nameCn: "粘土色", nameEn: "Stone", hex: "#A3978D" },
    { id: "P114", nameCn: "泻湖蓝", nameEn: "Lagoon", hex: "#00839B" },
    { id: "P115", nameCn: "蓝绿色", nameEn: "Teal", hex: "#006F71" },
    { id: "P116", nameCn: "兰花紫", nameEn: "Orchid", hex: "#9E64A9" },
    { id: "P150", nameCn: "史莱姆绿", nameEn: "Slime", hex: "#BDD54F" },
    { id: "P151", nameCn: "青苹果", nameEn: "Sour Apple", hex: "#7DBB41" },
    { id: "P152", nameCn: "棉花糖", nameEn: "Cotton Candy", hex: "#EF9BB1" },
    { id: "P176", nameCn: "常青绿", nameEn: "Evergreen", hex: "#1C3E2D" },
    { id: "P177", nameCn: "姜饼色", nameEn: "Gingerbread", hex: "#7A4E31" },
    { id: "P178", nameCn: "蜂蜜色", nameEn: "Honey", hex: "#D6A341" },
    { id: "P179", nameCn: "茄子紫", nameEn: "Eggplant", hex: "#3A2A44" },
    { id: "P180", nameCn: "森林绿", nameEn: "Forest", hex: "#1B3022" },
    { id: "P181", nameCn: "板岩灰", nameEn: "Slate", hex: "#4D5459" },
    { id: "P182", nameCn: "番茄红", nameEn: "Tomato", hex: "#BE342F" },
    { id: "P183", nameCn: "柠檬黄", nameEn: "Lemon", hex: "#F3EC41" },
    { id: "P184", nameCn: "橘皮色", nameEn: "Orange Peel", hex: "#F38F31" },
    { id: "P185", nameCn: "薰衣草紫", nameEn: "Lavender", hex: "#A692C2" },
    { id: "P186", nameCn: "浅湖蓝", nameEn: "Sky", hex: "#95C6E6" },
    { id: "P187", nameCn: "钴青", nameEn: "Cobalt", hex: "#1F4E99" },
    { id: "P188", nameCn: "鲜绿", nameEn: "Bright Green", hex: "#00A651" },
    { id: "P189", nameCn: "巧克力色", nameEn: "Chocolate", hex: "#3D241C" },
    { id: "P190", nameCn: "炭黑", nameEn: "Charcoal", hex: "#333333" },
  ];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const getClosestColor = (r: number, g: number, b: number) => {
    let minDistance = Infinity;
    let closest = PINDOU_COLORS[0];

    for (const color of PINDOU_COLORS) {
      const target = hexToRgb(color.hex);
      const distance = Math.sqrt(
        Math.pow(r - target.r, 2) +
        Math.pow(g - target.g, 2) +
        Math.pow(b - target.b, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = color;
      }
    }
    return closest;
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedImage) {
      processImage();
    }
  }, [selectedImage, gridSize, showGrid, matchColors, brightness, contrast]);

  const processImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = selectedImage!;
    img.onload = () => {
      let width, height;
      if (img.width > img.height) {
        width = gridSize;
        height = Math.floor(img.height * (gridSize / img.width));
      } else {
        height = gridSize;
        width = Math.floor(img.width * (gridSize / img.height));
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      tempCtx.filter = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
      tempCtx.drawImage(img, 0, 0, width, height);
      
      const imageData = tempCtx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const pixelColors: {id: string, hex: string, nameCn: string, nameEn: string}[][] = [];
      const statsMap: Record<string, {id: string, nameCn: string, nameEn: string, hex: string, count: number}> = {};

      for (let y = 0; y < height; y++) {
        pixelColors[y] = [];
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const closest = getClosestColor(data[i], data[i+1], data[i+2]);
          pixelColors[y][x] = closest;
          
          // Update stats
          if (!statsMap[closest.id]) {
            statsMap[closest.id] = { ...closest, count: 0 };
          }
          statsMap[closest.id].count++;

          if (matchColors) {
            const rgb = hexToRgb(closest.hex);
            data[i] = rgb.r;
            data[i+1] = rgb.g;
            data[i+2] = rgb.b;
          }
        }
      }
      
      // Update color stats state
      setColorStats(Object.values(statsMap).sort((a, b) => b.count - a.count));
      
      tempCtx.putImageData(imageData, 0, 0);

      const scale = Math.min(1200 / width, 1200 / height); // Larger scale for labels
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);

      if (showGrid) {
        // Draw vertical lines
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= width; i++) {
          ctx.beginPath();
          ctx.moveTo(i * scale, 0);
          ctx.lineTo(i * scale, canvas.height);
          ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= height; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * scale);
          ctx.lineTo(canvas.width, i * scale);
          ctx.stroke();
        }

        // Draw labels
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const fontSize = Math.max(scale * 0.35, 6);
        ctx.font = `bold ${fontSize}px sans-serif`;

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const color = pixelColors[y][x];
            const rgb = hexToRgb(color.hex);
            // Calculate perceived brightness for text color contrast
            const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            ctx.fillStyle = brightness > 128 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.9)";
            
            // Show full ID (e.g., P01) if scale is large enough, otherwise show just the number
            if (scale > 20) {
              ctx.fillText(color.id, (x + 0.5) * scale, (y + 0.5) * scale);
            } else if (scale > 10) {
              ctx.fillText(color.id.replace("P", ""), (x + 0.5) * scale, (y + 0.5) * scale);
            }
          }
        }

        // Draw bold lines every 5 units
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= width; i += 5) {
          ctx.beginPath();
          ctx.moveTo(i * scale, 0);
          ctx.lineTo(i * scale, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i <= height; i += 5) {
          ctx.beginPath();
          ctx.moveTo(0, i * scale);
          ctx.lineTo(canvas.width, i * scale);
          ctx.stroke();
        }
      }
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas || colorStats.length === 0) return;
    
    // Create a larger canvas for the combined image
    const sidebarWidth = 400;
    const padding = 40;
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    exportCanvas.width = canvas.width + sidebarWidth + padding;
    exportCanvas.height = Math.max(canvas.height, colorStats.length * 50 + 150);

    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Draw original pattern
    ctx.drawImage(canvas, 0, 0);

    // Draw Sidebar Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(canvas.width, 0, sidebarWidth + padding, exportCanvas.height);
    
    // Draw Sidebar Border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, exportCanvas.height);
    ctx.stroke();

    // Draw Title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("拼豆用量清单 (Perler)", canvas.width + 30, 50);

    // Draw Headers
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("色号", canvas.width + 30, 90);
    ctx.fillText("名称 (中/EN)", canvas.width + 100, 90);
    ctx.fillText("用量", canvas.width + 320, 90);

    // Draw Table Rows
    colorStats.forEach((color, index) => {
      const y = 130 + index * 50;
      
      // Color Circle
      ctx.beginPath();
      ctx.arc(canvas.width + 50, y - 5, 18, 0, Math.PI * 2);
      ctx.fillStyle = color.hex;
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.stroke();

      // ID in Circle
      const rgb = hexToRgb(color.hex);
      const isDark = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 < 128;
      ctx.fillStyle = isDark ? "white" : "black";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(color.id.replace("P", ""), canvas.width + 50, y);

      // Names
      ctx.textAlign = "left";
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(color.nameCn, canvas.width + 100, y - 8);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.fillText(color.nameEn, canvas.width + 100, y + 10);

      // Count
      ctx.fillStyle = "#4f46e5";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${color.count} 颗`, canvas.width + 380, y);
    });

    const link = document.createElement("a");
    link.download = `pindou-pattern-${gridSize}x${gridSize}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Grid3X3 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">拼豆图纸生成器</h1>
          </div>
          <button 
            onClick={handleExport}
            disabled={!selectedImage}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span>导出图纸</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Controls */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings size={16} />
                参数设置
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    拼豆板尺寸 (宽/高)
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10x10</span>
                    <span>{gridSize}x{gridSize}</span>
                    <span>100x100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    亮度
                  </label>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>更暗</span>
                    <span>{brightness}</span>
                    <span>更亮</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    对比度
                  </label>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>更低</span>
                    <span>{contrast}</span>
                    <span>更高</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input 
                      type="checkbox" 
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">显示网格线</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={matchColors}
                      onChange={(e) => setMatchColors(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">匹配标准拼豆色</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Palette size={16} />
                标准色板
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {PINDOU_COLORS.map((color, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-full border border-gray-200 cursor-help"
                    style={{ backgroundColor: color.hex }}
                    title={`${color.id} - ${color.nameCn} (${color.nameEn})`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">使用 Artkal/Perler 标准色</p>
            </div>
          </aside>

          {/* Main Content - Preview Area */}
          <section className="lg:col-span-3 space-y-6">
            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video bg-white border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all group"
              >
                <div className="p-4 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform mb-4">
                  <Upload size={32} />
                </div>
                <h3 className="text-lg font-medium">点击或拖拽图片到这里</h3>
                <p className="text-sm text-gray-500 mt-1">支持 PNG, JPG, WebP 格式</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            ) : (
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="bg-white/80 backdrop-blur-sm p-2 rounded-full border border-gray-200 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <ImageIcon size={20} />
                  </button>
                </div>
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full h-auto shadow-2xl rounded-sm"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )}

            {/* Color Legend & Statistics */}
            {selectedImage && colorStats.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette size={20} className="text-indigo-600" />
                  拼豆色号及用量统计
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {colorStats.map((color) => (
                    <div key={color.id} className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 border border-gray-100">
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold shadow-sm shrink-0"
                        style={{ 
                          backgroundColor: color.hex,
                          color: (hexToRgb(color.hex).r * 299 + hexToRgb(color.hex).g * 587 + hexToRgb(color.hex).b * 114) / 1000 > 128 ? '#000' : '#fff'
                        }}
                      >
                        {color.id.replace("P", "")}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700">{color.id} {color.nameCn}</span>
                        <span className="text-xs text-gray-400 font-medium">{color.nameEn}</span>
                        <span className="text-sm font-semibold text-indigo-600 mt-1">{color.count} 颗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps / Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-100">
                <span className="text-indigo-600 font-bold text-xl">1.</span>
                <p className="text-sm font-medium mt-1">上传清晰的素材图</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-100">
                <span className="text-indigo-600 font-bold text-xl">2.</span>
                <p className="text-sm font-medium mt-1">调整拼豆板格子数量</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-100">
                <span className="text-indigo-600 font-bold text-xl">3.</span>
                <p className="text-sm font-medium mt-1">保存并打印拼豆图纸</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
