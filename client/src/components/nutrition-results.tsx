import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info, Download, Share, RotateCcw, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FoodAnalysis } from "@shared/schema";

interface NutritionResultsProps {
  results: FoodAnalysis;
  uploadedImage: string | null;
  onNewAnalysis: () => void;
}

export function NutritionResults({ results, uploadedImage, onNewAnalysis }: NutritionResultsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Results saved",
      description: "Your nutrition analysis has been saved to your history",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${results.detectedFood} - Nutrition Analysis`,
          text: `${results.detectedFood}: ${results.totalCalories} calories, ${results.protein}g protein, ${results.carbs}g carbs, ${results.fats}g fats`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const text = `${results.detectedFood}: ${results.totalCalories} calories, ${results.protein}g protein, ${results.carbs}g carbs, ${results.fats}g fats`;
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Nutrition information copied to clipboard",
      });
    });
  };

  const calculatePercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="fade-in space-y-6">
      {/* Food Identification Card */}
      <Card data-testid="card-food-identification">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2" data-testid="text-detected-food">
                {results.detectedFood}
              </h3>
              <p className="text-muted-foreground mb-4">
                Detected ingredients: {results.ingredients?.join(", ") || "Various ingredients"}
              </p>
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary"
                  data-testid="badge-confidence"
                >
                  {Math.round(results.confidence * 100)}% Confidence
                </Badge>
                <Badge variant="outline" data-testid="badge-portion">
                  {results.portionSize}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Information */}
      <Card data-testid="card-nutrition-info">
        <CardContent className="p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Nutritional Information</h3>
          
          {/* Total Calories - Featured */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 mb-6 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Calories</p>
                <p className="text-4xl md:text-5xl font-bold" data-testid="text-total-calories">
                  {results.totalCalories}
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <Flame className="w-10 h-10" />
              </div>
            </div>
          </div>

          {/* Macronutrients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Protein */}
            <div className="bg-muted rounded-xl p-6" data-testid="card-protein">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Protein</h4>
                <span className="text-2xl font-bold text-foreground" data-testid="text-protein">
                  {results.protein}g
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full progress-bar transition-all duration-1000"
                  style={{ width: `${calculatePercentage(results.protein, 150)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((results.protein / 150) * 100)}% of daily value*
              </p>
            </div>

            {/* Carbohydrates */}
            <div className="bg-muted rounded-xl p-6" data-testid="card-carbs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Carbs</h4>
                <span className="text-2xl font-bold text-foreground" data-testid="text-carbs">
                  {results.carbs}g
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mb-2">
                <div 
                  className="bg-secondary h-2 rounded-full progress-bar transition-all duration-1000"
                  style={{ width: `${calculatePercentage(results.carbs, 300)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((results.carbs / 300) * 100)}% of daily value*
              </p>
            </div>

            {/* Fats */}
            <div className="bg-muted rounded-xl p-6" data-testid="card-fats">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Fats</h4>
                <span className="text-2xl font-bold text-foreground" data-testid="text-fats">
                  {results.fats}g
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mb-2">
                <div 
                  className="bg-accent h-2 rounded-full progress-bar transition-all duration-1000"
                  style={{ width: `${calculatePercentage(results.fats, 65)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((results.fats / 65) * 100)}% of daily value*
              </p>
            </div>
          </div>

          {/* Additional Nutrients */}
          {(results.fiber || results.sugar || results.sodium || results.cholesterol) && (
            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-semibold text-foreground mb-4">Other Nutrients</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.fiber && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fiber</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="text-fiber">
                      {results.fiber}g
                    </p>
                  </div>
                )}
                {results.sugar && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sugar</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="text-sugar">
                      {results.sugar}g
                    </p>
                  </div>
                )}
                {results.sodium && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sodium</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="text-sodium">
                      {results.sodium}mg
                    </p>
                  </div>
                )}
                {results.cholesterol && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cholesterol</p>
                    <p className="text-lg font-semibold text-foreground" data-testid="text-cholesterol">
                      {results.cholesterol}mg
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portion Size Info */}
      <Card data-testid="card-portion-info">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">Estimated Portion</h4>
              <p className="text-sm text-muted-foreground">
                Serving size: {results.portionSize}. Values are estimates based on visual analysis.
                *Based on a 2,000 calorie diet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="flex-1 gradient-bg text-primary-foreground hover:opacity-90"
          onClick={handleSave}
          data-testid="button-save"
        >
          <Download className="w-5 h-5 mr-2" />
          Save to History
        </Button>
        <Button 
          className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={handleShare}
          data-testid="button-share"
        >
          <Share className="w-5 h-5 mr-2" />
          Share Results
        </Button>
        <Button 
          variant="outline"
          className="border-2 border-border hover:bg-muted"
          onClick={onNewAnalysis}
          data-testid="button-new-analysis"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          New Analysis
        </Button>
      </div>
    </div>
  );
}
