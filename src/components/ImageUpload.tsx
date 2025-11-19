
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, Eye, Camera, CheckCircle, Sparkles, Cpu, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AnalysisChart from "./AnalysisChart";

interface ImageAnalysisResult {
  analysis: string;
  error?: string;
}

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const { user, session } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }
    
    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset analysis when new image is selected
    setAnalysisResult(null);
  };

  // Progress simulation with smoother animation
  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 8 + 2;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const analyzeImage = async () => {
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to analyze images.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      console.log("🖼️ Sending image for AI Vision analysis...");
      console.log("📊 Image data length:", selectedImage?.length);
      
      const { data, error } = await supabase.functions.invoke<ImageAnalysisResult>('analyze-image', {
        body: {
          image: selectedImage,
          prompt: "Analyze this agricultural image briefly: 1) Crop type, 2) Health status, 3) Growth stage, 4) Visible issues, 5) Recommendations. Be concise."
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      console.log("📡 Function response:", { data, error });
      console.log("🔍 Analysis preview:", data?.analysis?.slice(0, 100));

      // Complete progress first
      setAnalysisProgress(100);
      
      // Handle the response
      setTimeout(() => {
        if (error) {
          console.error("❌ Supabase function error:", error);
          setAnalysisResult(`Demo Analysis Results:

1) Crop Type: Image analysis requires API configuration
2) Health Status: Unable to assess without AI vision setup
3) Growth Stage: Analysis not available in demo mode
4) Visible Issues: Demo mode - configure OpenRouter API key
5) Recommendations: Set up API key in Supabase for full functionality

This is a demonstration. For real AI analysis, configure your OpenRouter API key in Supabase Edge Functions.`);
          
          toast({
            title: "Demo analysis complete",
            description: "Configure OpenRouter API key for real AI analysis.",
          });
        } else if (data?.analysis) {
          console.log("✅ Setting analysis result");
          setAnalysisResult(data.analysis);
          toast({
            title: "Analysis complete",
            description: "Image has been successfully analyzed with AI vision.",
          });
        } else {
          console.log("⚠️ No analysis data received:", data);
          // Fallback if no analysis is returned
          setAnalysisResult(`Demo Analysis Results:

1) Crop Type: Unable to determine - API response incomplete
2) Health Status: Requires proper API configuration
3) Growth Stage: Analysis not available
4) Visible Issues: Demo mode active
5) Recommendations: Configure OpenRouter API key for detailed analysis

This is a demonstration response. For real AI-powered image analysis, please configure your OpenRouter API key.`);
          
          toast({
            title: "Demo analysis shown",
            description: "Set up OpenRouter API key for real AI analysis.",
          });
        }
        
        setIsAnalyzing(false);
      }, 800);
      
    } catch (error) {
      console.error("💥 Error analyzing image:", error);
      setAnalysisProgress(0);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis failed",
        description: "An error occurred during image analysis.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Section - Blended with page */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-pulse">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Upload Your Image</h3>
        <p className="text-muted-foreground">
          Drag and drop or click to select an image for AI analysis
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-500 ease-out cursor-pointer group bg-background/50 backdrop-blur-sm ${
          isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/20' 
            : 'border-muted-foreground/25 hover:border-primary/60 hover:bg-background/80 hover:shadow-md hover:scale-[1.01]'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 ease-out ${
            isDragOver ? 'bg-primary text-primary-foreground scale-110 rotate-12' : 'bg-muted text-muted-foreground group-hover:bg-primary/80 group-hover:text-primary-foreground group-hover:scale-105'
          }`}>
            <Upload className={`h-10 w-10 transition-transform duration-300 ${isDragOver ? 'translate-y-[-2px]' : 'group-hover:translate-y-[-1px]'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium mb-1">
              {isDragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG, GIF, WebP • Maximum 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview and Analysis */}
      {selectedImage && (
        <div className="space-y-8 animate-fade-in">
          {/* Image Preview - Seamlessly integrated */}
          <div className="aspect-video bg-background/30 backdrop-blur-sm rounded-xl overflow-hidden border border-border/20 shadow-lg hover:shadow-xl transition-all duration-500 group/preview">
            <img 
              src={selectedImage} 
              alt="Selected preview" 
              className="w-full h-full object-contain transition-all duration-700 ease-out group-hover/preview:scale-105"
            />
          </div>
          
          {/* Analysis Progress - Blended */}
          {isAnalyzing && (
            <div className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-border/20 animate-scale-in">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative">
                    <Cpu className="h-8 w-8 text-primary animate-pulse" />
                    <Sparkles className="h-4 w-4 text-primary absolute -top-1 -right-1 animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Processing your image with advanced AI vision...
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {analysisProgress < 100 ? 'Analyzing...' : 'Complete!'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(analysisProgress)}%
                    </span>
                  </div>
                  <Progress 
                    value={analysisProgress} 
                    className="h-2 transition-all duration-500"
                  />
                  {analysisProgress === 100 && (
                    <div className="flex items-center justify-center text-primary animate-bounce">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Analysis Complete!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analyze Button - Blended style */}
          <Button 
            onClick={analyzeImage} 
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] active:scale-[0.98] rounded-xl group/btn"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Analyzing with AI Vision...
              </>
            ) : (
              <>
                <Eye className="mr-3 h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110" />
                Analyze Image with AI
              </>
            )}
          </Button>
        </div>
      )}

      {/* Analysis Results - Seamlessly integrated */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Chart Visualization */}
          <AnalysisChart analysisText={analysisResult} />
          
          {/* Detailed Text Results */}
          <div className="p-8 rounded-xl bg-background/30 backdrop-blur-sm border border-border/20 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-muted-foreground">
                AI-powered insights about your image
              </p>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 p-6 space-y-4">
              <div className="prose prose-sm max-w-none">
                {analysisResult.replace(/\*/g, '').trim().split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  // Check if line starts with a number followed by )
                  const isNumberedPoint = /^\d+\)/.test(trimmedLine);
                  
                  if (isNumberedPoint) {
                    return (
                      <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 border border-border/50 transition-all duration-500 ease-out hover:bg-background/70 hover:border-primary/30 hover:shadow-md hover:translate-x-1 group/item">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover/item:bg-primary/20 group-hover/item:scale-110">
                          <span className="text-xs font-medium text-primary transition-all duration-300">
                            {trimmedLine.match(/^\d+/)?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground transition-colors duration-300">
                            {trimmedLine.replace(/^\d+\)\s*/, '')}
                          </p>
                        </div>
                      </div>
                    );
                  } else if (trimmedLine.length > 0) {
                    return (
                      <div key={index} className="ml-8 text-muted-foreground">
                        {trimmedLine}
                      </div>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
