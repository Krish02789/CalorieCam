import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UploadZone } from "@/components/upload-zone";
import { NutritionResults } from "@/components/nutrition-results";
import { BarChart3, Camera, Smartphone, Zap, CheckCircle, Info } from "lucide-react";
import type { FoodAnalysis } from "@shared/schema";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setAnalysisResults(null);
  };

  const handleAnalysisComplete = (results: FoodAnalysis) => {
    setAnalysisResults(results);
    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResults(null);
    setIsAnalyzing(false);
  };

  const scrollToUpload = () => {
    const uploadSection = document.getElementById('uploadSection');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">CalorieScan</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </nav>
            <button className="md:hidden text-foreground" data-testid="button-mobile-menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Know What You're Eating
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload a photo of your meal and instantly get detailed nutritional information powered by AI
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-instant-analysis">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Analysis</h3>
                  <p className="text-muted-foreground text-sm">Our AI analyzes your food photo in seconds</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow" data-testid="card-detailed-breakdown">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Breakdown</h3>
                  <p className="text-muted-foreground text-sm">Get calories, proteins, carbs, and fats</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow" data-testid="card-mobile-friendly">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Mobile Friendly</h3>
                  <p className="text-muted-foreground text-sm">Works perfectly on any device</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8" id="uploadSection">
          <div className="max-w-4xl mx-auto">
            {!uploadedImage && !analysisResults && (
              <UploadZone 
                onImageUploaded={handleImageUploaded}
                data-testid="upload-zone"
              />
            )}

            {uploadedImage && !analysisResults && !isAnalyzing && (
              <div className="mb-8 fade-in">
                <Card>
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Uploaded Image</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleNewAnalysis}
                        data-testid="button-remove-image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                    <div className="p-6">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded food photo" 
                        className="w-full h-auto rounded-xl shadow-lg"
                        data-testid="img-uploaded"
                      />
                    </div>
                    <div className="p-6 border-t border-border">
                      <Button 
                        className="w-full gradient-bg text-primary-foreground hover:opacity-90"
                        onClick={() => setIsAnalyzing(true)}
                        data-testid="button-analyze"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Analyze Nutrition
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {isAnalyzing && (
              <div className="mb-8 fade-in">
                <Card data-testid="card-loading">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Your Food...</h3>
                      <p className="text-muted-foreground">Our AI is identifying ingredients and calculating nutrition</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {analysisResults && (
              <NutritionResults 
                results={analysisResults}
                uploadedImage={uploadedImage}
                onNewAnalysis={handleNewAnalysis}
                data-testid="nutrition-results"
              />
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to understand your meal's nutrition
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <Card className="h-full" data-testid="card-step-1">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full gradient-bg text-primary-foreground flex items-center justify-center text-xl font-bold mb-6">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Take a Photo</h3>
                    <p className="text-muted-foreground">
                      Snap a picture of your meal using your phone or camera. Make sure the food is clearly visible for best results.
                    </p>
                  </CardContent>
                </Card>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <Card className="h-full" data-testid="card-step-2">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-full gradient-bg text-primary-foreground flex items-center justify-center text-xl font-bold mb-6">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">AI Analysis</h3>
                    <p className="text-muted-foreground">
                      Our advanced AI recognizes the food items and ingredients in your photo using computer vision technology.
                    </p>
                  </CardContent>
                </Card>
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>

              <Card className="h-full" data-testid="card-step-3">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-full gradient-bg text-primary-foreground flex items-center justify-center text-xl font-bold mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Get Results</h3>
                  <p className="text-muted-foreground">
                    Receive detailed nutritional information including calories, macros, and other nutrients instantly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Example Results Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Example Analyses</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how CalorieScan analyzes different types of meals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid="card-example-salad">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Healthy salad bowl" 
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Fresh Garden Salad</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-primary font-semibold">245 cal</span>
                    <span className="text-muted-foreground">12g protein</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid="card-example-pasta">
                <img 
                  src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Pasta dish" 
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Creamy Pasta</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-primary font-semibold">520 cal</span>
                    <span className="text-muted-foreground">18g protein</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid="card-example-salmon">
                <img 
                  src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Grilled salmon" 
                  className="w-full h-48 object-cover" 
                />
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Grilled Salmon</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-primary font-semibold">380 cal</span>
                    <span className="text-muted-foreground">42g protein</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-bg rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Start Tracking Your Nutrition Today
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Upload your first meal photo and discover the power of AI-driven nutritional analysis
              </p>
              <Button 
                className="px-8 py-4 bg-card text-foreground hover:shadow-xl"
                onClick={scrollToUpload}
                data-testid="button-get-started"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">CalorieScan</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                AI-powered nutritional analysis for a healthier lifestyle. Know exactly what you're eating with just a photo.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 CalorieScan. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
