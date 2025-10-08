import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onImageUploaded: (imageUrl: string) => void;
}

export function UploadZone({ onImageUploaded }: UploadZoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Create image URL for preview
      const imageUrl = URL.createObjectURL(file);
      onImageUploaded(imageUrl);
    }
  }, [onImageUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection?.errors[0]?.code === 'file-invalid-type') {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPEG, PNG, WebP)",
          variant: "destructive",
        });
      }
    }
  });

  return (
    <div className="mb-8">
      <Card 
        {...getRootProps()}
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 border-dashed ${
          isDragActive 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary hover:bg-primary/5'
        }`}
        data-testid="dropzone-card"
      >
        <CardContent className="p-8 md:p-12">
          <input {...getInputProps()} data-testid="input-file" />
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center">
              <Upload className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Upload Your Food Photo
            </h3>
            <p className="text-muted-foreground mb-6">
              {isDragActive 
                ? "Drop your image here..." 
                : "Drag and drop your image here, or click to browse"
              }
            </p>
            <Button 
              className="px-8 py-3 gradient-bg text-primary-foreground hover:opacity-90"
              data-testid="button-choose-image"
            >
              Choose Image
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Supports JPG, PNG, WebP up to 10MB
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
