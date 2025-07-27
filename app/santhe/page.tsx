"use client";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  caption: z.string().min(1, 'Caption is required').max(200, 'Caption must be 200 characters or less'),
  filter: z.string().min(1, 'Please select a filter'),
  borderStyle: z.string().optional(),
  stickerSize: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  textColor: z.string().optional(),
  imageFit: z.string().optional(),
  image: z.any().refine((files) => files?.length > 0, 'Please upload an image'),
});

type FormData = z.infer<typeof formSchema>;

const imageFitOptions = [
  { 
    value: 'contain', 
    label: 'Fit Image', 
    description: 'Show entire image within sticker bounds',
    icon: '📦'
  },
  { 
    value: 'cover', 
    label: 'Fill Sticker', 
    description: 'Image covers entire sticker area (may crop)',
    icon: '🖼️'
  },
  { 
    value: 'fill', 
    label: 'Stretch to Fill', 
    description: 'Stretch image to fill exactly (may distort)',
    icon: '↔️'
  },
  { 
    value: 'custom', 
    label: 'Custom Size', 
    description: 'Manual control over image size and position',
    icon: '⚙️'
  },
];

const fontFamilies = [
  { value: 'arial', label: 'Arial', style: 'Arial, sans-serif' },
  { value: 'helvetica', label: 'Helvetica', style: 'Helvetica, sans-serif' },
  { value: 'times', label: 'Times New Roman', style: 'Times New Roman, serif' },
  { value: 'georgia', label: 'Georgia', style: 'Georgia, serif' },
  { value: 'courier', label: 'Courier New', style: 'Courier New, monospace' },
  { value: 'comic', label: 'Comic Sans', style: 'Comic Sans MS, cursive' },
  { value: 'impact', label: 'Impact', style: 'Impact, sans-serif' },
  { value: 'trebuchet', label: 'Trebuchet MS', style: 'Trebuchet MS, sans-serif' },
  { value: 'verdana', label: 'Verdana', style: 'Verdana, sans-serif' },
  { value: 'palatino', label: 'Palatino', style: 'Palatino, serif' },
];

const fontSizes = [
  { value: 'small', label: 'Small', multiplier: 0.02 },
  { value: 'medium', label: 'Medium', multiplier: 0.03 },
  { value: 'large', label: 'Large', multiplier: 0.04 },
  { value: 'xlarge', label: 'Extra Large', multiplier: 0.05 },
];

const textColors = [
  { value: 'black', label: 'Black', color: '#000000' },
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'gray', label: 'Gray', color: '#6B7280' },
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
  { value: 'red', label: 'Red', color: '#EF4444' },
  { value: 'green', label: 'Green', color: '#10B981' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6' },
  { value: 'pink', label: 'Pink', color: '#EC4899' },
  { value: 'yellow', label: 'Yellow', color: '#F59E0B' },
];

const borderStyles = [
  { value: 'purple', label: 'Purple', color: '#C084FC' },
  { value: 'blue', label: 'Blue', color: '#60A5FA' },
  { value: 'green', label: 'Green', color: '#34D399' },
  { value: 'pink', label: 'Pink', color: '#F472B6' },
  { value: 'gold', label: 'Gold', color: '#FBBF24' },
  { value: 'red', label: 'Red', color: '#F87171' },
];

const stickerSizes = [
  { value: 'small', label: 'Small (600x600)', size: 600 },
  { value: 'medium', label: 'Medium (800x800)', size: 800 },
  { value: 'large', label: 'Large (1000x1000)', size: 1000 },
];

const filters = [
  { value: 'none', label: 'None', style: {} },
  { value: 'sepia', label: 'Sepia', style: { filter: 'sepia(100%)' } },
  { value: 'grayscale', label: 'Grayscale', style: { filter: 'grayscale(100%)' } },
  { value: 'blur', label: 'Blur', style: { filter: 'blur(2px)' } },
  { value: 'brightness', label: 'Bright', style: { filter: 'brightness(150%)' } },
  { value: 'contrast', label: 'High Contrast', style: { filter: 'contrast(150%)' } },
  { value: 'vintage', label: 'Vintage', style: { filter: 'sepia(50%) contrast(120%) brightness(90%)' } },
  { value: 'cool', label: 'Cool Blue', style: { filter: 'hue-rotate(180deg) saturate(120%)' } },
  { value: 'warm', label: 'Warm', style: { filter: 'hue-rotate(25deg) saturate(130%) brightness(110%)' } },
  { value: 'noir', label: 'Film Noir', style: { filter: 'grayscale(100%) contrast(150%) brightness(90%)' } },
  { value: 'dreamy', label: 'Dreamy', style: { filter: 'blur(1px) brightness(110%) saturate(130%)' } },
  { value: 'cyberpunk', label: 'Cyberpunk', style: { filter: 'hue-rotate(270deg) saturate(200%) contrast(120%)' } },
  { value: 'retro', label: 'Retro', style: { filter: 'sepia(30%) saturate(150%) hue-rotate(315deg)' } },
  { value: 'neon', label: 'Neon', style: { filter: 'saturate(200%) brightness(120%) contrast(120%)' } },
];

export default function SanthePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedBorder, setSelectedBorder] = useState('purple');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedFont, setSelectedFont] = useState('arial');
  const [selectedFontSize, setSelectedFontSize] = useState('medium');
  const [selectedTextColor, setSelectedTextColor] = useState('black');
  const [selectedImageFit, setSelectedImageFit] = useState('contain');
  const [customImageSize, setCustomImageSize] = useState({ width: 60, height: 48, x: 50, y: 20 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: 1,
    rotation: 0
  });
  const stickerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      caption: '',
      filter: 'none',
      borderStyle: 'purple',
      stickerSize: 'medium',
      fontFamily: 'arial',
      fontSize: 'medium',
      textColor: 'black',
      imageFit: 'contain',
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Create a file list for form validation
    const dt = new DataTransfer();
    dt.items.add(file);
    form.setValue('image', dt.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    form.setValue('filter', value);
  };

  const handleBorderChange = (value: string) => {
    setSelectedBorder(value);
    form.setValue('borderStyle', value);
  };

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    form.setValue('stickerSize', value);
  };

  const handleFontChange = (value: string) => {
    setSelectedFont(value);
    form.setValue('fontFamily', value);
  };

  const handleFontSizeChange = (value: string) => {
    setSelectedFontSize(value);
    form.setValue('fontSize', value);
  };

  const handleTextColorChange = (value: string) => {
    setSelectedTextColor(value);
    form.setValue('textColor', value);
  };

  const handleImageFitChange = (value: string) => {
    setSelectedImageFit(value);
    form.setValue('imageFit', value);
  };

  const openCropper = () => {
    if (uploadedImage) {
      setShowCropper(true);
    }
  };

  const applyCrop = () => {
    if (!uploadedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Apply crop settings
      canvas.width = cropData.width;
      canvas.height = cropData.height;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropData.rotation * Math.PI) / 180);
      ctx.scale(cropData.scale, cropData.scale);
      
      ctx.drawImage(
        img,
        -cropData.width / 2,
        -cropData.height / 2,
        cropData.width,
        cropData.height
      );
      
      ctx.restore();
      
      // Update the uploaded image with cropped version
      setUploadedImage(canvas.toDataURL());
      setShowCropper(false);
    };
    img.src = uploadedImage;
  };

  const downloadSticker = async () => {
    setIsGenerating(true);
    try {
      const stickerImage = await generateSticker();
      if (stickerImage) {
        // Create download link
        const link = document.createElement('a');
        link.download = `santhe-sticker-${Date.now()}.png`;
        link.href = stickerImage;
        link.click();
      }
    } catch (error) {
      console.error('Error downloading sticker:', error);
      alert('Failed to download sticker');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSticker = async () => {
    if (!uploadedImage) return null;
    
    try {
      // Get selected options
      const currentBorder = borderStyles.find(b => b.value === selectedBorder) || borderStyles[0];
      const currentSizeOption = stickerSizes.find(s => s.value === selectedSize) || stickerSizes[1];
      const canvasSize = currentSizeOption.size;
      
      // Create a canvas to manually apply filters and generate the sticker
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Set canvas size based on selection
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);
      
      // Draw colored border
      ctx.strokeStyle = currentBorder.color;
      ctx.lineWidth = Math.round(canvasSize * 0.01); // 1% of canvas size
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, canvasSize - ctx.lineWidth, canvasSize - ctx.lineWidth);
      
      // Load and draw the image with filters
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        img.onload = () => {
          // Apply filter using canvas context
          const currentFilter = filters.find(f => f.value === selectedFilter);
          if (currentFilter && currentFilter.style.filter) {
            ctx.filter = currentFilter.style.filter;
          }
          
          // Calculate image dimensions based on fit option
          const basePadding = canvasSize * 0.1; // 10% padding from edges
          let maxWidth, maxHeight, x, y, width, height;
          
          switch (selectedImageFit) {
            case 'cover':
              // Image covers entire sticker area (may crop)
              maxWidth = canvasSize - (ctx.lineWidth * 2);
              maxHeight = canvasSize - (ctx.lineWidth * 2);
              
              // Calculate scale to cover entire area
              const coverScale = Math.max(maxWidth / img.width, maxHeight / img.height);
              width = img.width * coverScale;
              height = img.height * coverScale;
              
              // Center the image
              x = (canvasSize - width) / 2;
              y = (canvasSize - height) / 2;
              break;
              
            case 'fill':
              // Stretch to fill exactly (may distort)
              width = canvasSize - (ctx.lineWidth * 2);
              height = canvasSize - (ctx.lineWidth * 2);
              x = ctx.lineWidth;
              y = ctx.lineWidth;
              break;
              
            case 'custom':
              // Use custom dimensions (percentage of canvas)
              maxWidth = canvasSize * (customImageSize.width / 100);
              maxHeight = canvasSize * (customImageSize.height / 100);
              
              // Scale to fit within custom bounds
              const customScale = Math.min(maxWidth / img.width, maxHeight / img.height);
              width = img.width * customScale;
              height = img.height * customScale;
              
              // Position based on custom x, y (percentage)
              x = (canvasSize * (customImageSize.x / 100)) - (width / 2);
              y = (canvasSize * (customImageSize.y / 100)) - (height / 2);
              break;
              
            default: // 'contain'
              // Show entire image within bounds with padding
              maxWidth = canvasSize * 0.6; // 60% of canvas width
              maxHeight = canvasSize * 0.48; // 48% of canvas height
              
              // Scale image to fit
              const containScale = Math.min(maxWidth / img.width, maxHeight / img.height);
              width = img.width * containScale;
              height = img.height * containScale;
              
              // Center the image
              x = (canvasSize - width) / 2;
              y = basePadding;
              break;
          }
          
          // Draw the filtered image
          ctx.drawImage(img, x, y, width, height);
          
          // Calculate caption position based on image fit
          let captionY;
          if (selectedImageFit === 'cover' || selectedImageFit === 'fill') {
            // For full coverage, place caption over the image with background
            captionY = canvasSize * 0.85; // Near bottom
          } else {
            // For contained images, place caption below image
            captionY = y + height + (canvasSize * 0.05);
          }
          
          // Reset filter for text
          ctx.filter = 'none';
          
          // Draw caption
          const caption = form.getValues('caption') || '';
          if (caption) {
            const currentFontFamily = fontFamilies.find(f => f.value === selectedFont) || fontFamilies[0];
            const currentFontSize = fontSizes.find(f => f.value === selectedFontSize) || fontSizes[1];
            const currentTextColor = textColors.find(c => c.value === selectedTextColor) || textColors[0];
            
            ctx.fillStyle = currentTextColor.color;
            const fontSize = Math.round(canvasSize * currentFontSize.multiplier);
            ctx.font = `bold ${fontSize}px ${currentFontFamily.style}`;
            ctx.textAlign = 'center';
            
            // Add text shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Add background for text if image covers full area
            if (selectedImageFit === 'cover' || selectedImageFit === 'fill') {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
              ctx.shadowBlur = 4;
            }
            
            // Word wrap for long captions
            const words = caption.split(' ');
            const lines = [];
            let currentLine = '';
            const maxLineWidth = canvasSize * 0.9; // 90% of canvas width
            
            for (const word of words) {
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              const metrics = ctx.measureText(testLine);
              if (metrics.width > maxLineWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }
            if (currentLine) lines.push(currentLine);
            
            // Draw each line
            const lineHeight = Math.round(fontSize * 1.2); // 120% of font size
            lines.forEach((line, index) => {
              ctx.fillText(line, canvasSize / 2, captionY + (index * lineHeight));
            });
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
          }
          
          // Convert to data URL
          resolve(canvas.toDataURL('image/png'));
        };
        
        img.onerror = () => resolve(null);
        img.src = uploadedImage;
      });
      
    } catch (error) {
      console.error('Error generating sticker:', error);
      return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate sticker image
      const stickerImage = await generateSticker();
      
      if (!stickerImage) {
        throw new Error('Failed to generate sticker');
      }

      // Send to API route
      const response = await fetch('/api/santhe/send-sticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          caption: data.caption,
          filter: data.filter,
          stickerImage: stickerImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send sticker');
      }

      setSubmitSuccess(true);
      form.reset();
      setUploadedImage(null);
      setSelectedFilter('none');
      setSelectedBorder('purple');
      setSelectedSize('medium');
      setSelectedFont('arial');
      setSelectedFontSize('medium');
      setSelectedTextColor('black');
      setSelectedImageFit('contain');
      setCustomImageSize({ width: 60, height: 48, x: 50, y: 20 });
      setCropData({ x: 0, y: 0, width: 100, height: 100, scale: 1, rotation: 0 });
    } catch (error) {
      console.error('Error sending sticker:', error);
      alert('Failed to send sticker. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentFilter = filters.find(f => f.value === selectedFilter);

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">Success! 🎉</CardTitle>
            <CardDescription>
              Your custom sticker has been sent to your email!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setSubmitSuccess(false)}
              className="w-full"
            >
              Create Another Sticker
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Santhe Sticker Creator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your picture, add a caption, apply filters, and get your custom sticker via email!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Sticker</CardTitle>
              <CardDescription>
                Fill in the details below to create your personalized sticker
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Image</FormLabel>
                        <FormControl>
                          <div
                            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
                              isDragOver 
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                                : 'border-gray-300 hover:border-purple-400'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-center">
                              <div className="mb-2">
                                📁
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {uploadedImage 
                                  ? '✅ Image uploaded! Click or drag to change'
                                  : 'Click to upload or drag and drop an image'
                                }
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caption</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your caption here..."
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Text Styling Section */}
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Text Styling</h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name="fontFamily"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Font</FormLabel>
                            <Select onValueChange={handleFontChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Font" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fontFamilies.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    <span style={{ fontFamily: font.style }}>{font.label}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fontSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Size</FormLabel>
                            <Select onValueChange={handleFontSizeChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fontSizes.map((size) => (
                                  <SelectItem key={size.value} value={size.value}>
                                    {size.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="textColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Color</FormLabel>
                            <Select onValueChange={handleTextColorChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {textColors.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="w-3 h-3 rounded-full border"
                                        style={{ backgroundColor: color.color }}
                                      />
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Image Controls Section */}
                  {uploadedImage && (
                    <div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Image Controls</h3>
                      
                      {/* Image Fit Options */}
                      <FormField
                        control={form.control}
                        name="imageFit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Image Fit Style</FormLabel>
                            <Select onValueChange={handleImageFitChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Choose fit style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {imageFitOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <span>{option.icon}</span>
                                      <div>
                                        <div className="font-medium">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Custom Size Controls - only show when custom is selected */}
                      {selectedImageFit === 'custom' && (
                        <div className="grid grid-cols-2 gap-2 p-3 bg-white dark:bg-gray-800 rounded border">
                          <div>
                            <label className="block text-xs font-medium mb-1">Width (%)</label>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              step="5"
                              value={customImageSize.width}
                              onChange={(e) => setCustomImageSize({...customImageSize, width: parseInt(e.target.value)})}
                              className="w-full h-2"
                            />
                            <span className="text-xs text-gray-500">{customImageSize.width}%</span>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Height (%)</label>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              step="5"
                              value={customImageSize.height}
                              onChange={(e) => setCustomImageSize({...customImageSize, height: parseInt(e.target.value)})}
                              className="w-full h-2"
                            />
                            <span className="text-xs text-gray-500">{customImageSize.height}%</span>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">X Position (%)</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={customImageSize.x}
                              onChange={(e) => setCustomImageSize({...customImageSize, x: parseInt(e.target.value)})}
                              className="w-full h-2"
                            />
                            <span className="text-xs text-gray-500">{customImageSize.x}%</span>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Y Position (%)</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={customImageSize.y}
                              onChange={(e) => setCustomImageSize({...customImageSize, y: parseInt(e.target.value)})}
                              className="w-full h-2"
                            />
                            <span className="text-xs text-gray-500">{customImageSize.y}%</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={openCropper}
                          className="h-8"
                        >
                          🔧 Crop & Adjust
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCropData({...cropData, rotation: cropData.rotation + 90});
                          }}
                          className="h-8"
                        >
                          🔄 Rotate 90°
                        </Button>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="filter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Filter</FormLabel>
                        <Select onValueChange={handleFilterChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a filter" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filters.map((filter) => (
                              <SelectItem key={filter.value} value={filter.value}>
                                {filter.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="borderStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Border Color</FormLabel>
                          <Select onValueChange={handleBorderChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose border" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {borderStyles.map((border) => (
                                <SelectItem key={border.value} value={border.value}>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full" 
                                      style={{ backgroundColor: border.color }}
                                    />
                                    {border.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stickerSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sticker Size</FormLabel>
                          <Select onValueChange={handleSizeChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stickerSizes.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={downloadSticker}
                      disabled={!uploadedImage || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating...' : 'Download Sticker'}
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!uploadedImage || isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send via Email'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sticker Preview</CardTitle>
              <CardDescription>
                See how your sticker will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  ref={stickerRef}
                  className="w-80 h-80 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center border-4"
                  style={{ 
                    borderColor: borderStyles.find(b => b.value === selectedBorder)?.color || '#C084FC' 
                  }}
                >
                  {uploadedImage ? (
                    <>
                      <div 
                        className="w-60 h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center relative"
                      >
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className={`${
                            selectedImageFit === 'cover' ? 'w-full h-full object-cover' :
                            selectedImageFit === 'fill' ? 'w-full h-full object-fill' :
                            selectedImageFit === 'custom' ? 'object-contain' :
                            'max-w-full max-h-full object-contain'
                          }`}
                          style={{
                            ...currentFilter?.style,
                            ...(selectedImageFit === 'custom' && {
                              width: `${customImageSize.width}%`,
                              height: `${customImageSize.height}%`,
                              position: 'absolute',
                              left: `${customImageSize.x}%`,
                              top: `${customImageSize.y}%`,
                              transform: 'translate(-50%, -50%)'
                            })
                          }}
                        />
                        {/* Show current fit mode indicator */}
                        <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          {imageFitOptions.find(opt => opt.value === selectedImageFit)?.icon} {imageFitOptions.find(opt => opt.value === selectedImageFit)?.label}
                        </div>
                      </div>
                      <div className="text-center">
                        <p 
                          className="text-sm font-medium px-2"
                          style={{
                            fontFamily: fontFamilies.find(f => f.value === selectedFont)?.style || 'Arial, sans-serif',
                            color: textColors.find(c => c.value === selectedTextColor)?.color || '#000000',
                            fontSize: selectedFontSize === 'small' ? '12px' : selectedFontSize === 'large' ? '16px' : selectedFontSize === 'xlarge' ? '18px' : '14px'
                          }}
                        >
                          {form.watch('caption') || 'Your caption will appear here...'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="w-60 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <span>Upload an image to see preview</span>
                      </div>
                      <p className="text-sm">Your caption will appear here...</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cropping Modal */}
      {showCropper && uploadedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Crop & Adjust Image</h3>
            
            <div className="space-y-4">
              {/* Image preview */}
              <div className="flex justify-center">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  <img 
                    src={uploadedImage} 
                    alt="Crop preview"
                    className="max-w-full max-h-60 object-contain"
                    style={{
                      transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`
                    }}
                  />
                </div>
              </div>

              {/* Crop controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Scale</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={cropData.scale}
                    onChange={(e) => setCropData({...cropData, scale: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{cropData.scale}x</span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={cropData.rotation}
                    onChange={(e) => setCropData({...cropData, rotation: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{cropData.rotation}°</span>
                </div>
              </div>

              {/* Quick preset buttons */}
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCropData({...cropData, scale: 1, rotation: 0})}
                >
                  Reset
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCropData({...cropData, rotation: cropData.rotation + 90})}
                >
                  Rotate 90°
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCropData({...cropData, scale: Math.min(3, cropData.scale + 0.2)})}
                >
                  Zoom In
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCropData({...cropData, scale: Math.max(0.5, cropData.scale - 0.2)})}
                >
                  Zoom Out
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCropper(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={applyCrop}
                  className="flex-1"
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
