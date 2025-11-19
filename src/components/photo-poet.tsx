"use client";

import { useState, useTransition, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Sparkles,
  Copy,
  Download,
  Loader2,
  Wand2,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePoemAction, improvePoemAction } from "@/app/actions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export default function PhotoPoet() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [initialPoem, setInitialPoem] = useState<string | null>(null);
  const [userEdits, setUserEdits] = useState<string>("");

  const [isGenerating, startGenerating] = useTransition();
  const [isImproving, startImproving] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    // Clean up the object URL on component unmount
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setPhotoDataUri(dataUri);
        setPhotoPreview(URL.createObjectURL(file));
        setPoem(null);
        setInitialPoem(null);
        setUserEdits("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePoem = () => {
    if (!photoDataUri) {
      toast({
        title: "Error",
        description: "Please upload a photo first.",
        variant: "destructive",
      });
      return;
    }
    startGenerating(async () => {
      const result = await generatePoemAction(photoDataUri);
      if (result.error) {
        toast({
          title: "Generation Failed",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.poem) {
        setPoem(result.poem);
        setInitialPoem(result.poem);
      }
    });
  };

  const handleImprovePoem = () => {
    if (!initialPoem || !userEdits || !photoDataUri) {
      toast({
        title: "Error",
        description:
          "Cannot improve poem without the original poem and your instructions.",
        variant: "destructive",
      });
      return;
    }
    startImproving(async () => {
      const result = await improvePoemAction({
        initialPoem,
        userEdits,
        photoDataUri,
      });
      if (result.error) {
        toast({
          title: "Improvement Failed",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.improvedPoem) {
        setPoem(result.improvedPoem);
        toast({
          title: "Poem Improved!",
          description: "The AI has refined your poem.",
        });
      }
    });
  };

  const handleCopyPoem = () => {
    if (!poem) return;
    navigator.clipboard.writeText(poem);
    toast({ title: "Copied!", description: "Poem copied to clipboard." });
  };

  const handleDownloadPoem = () => {
    if (!poem) return;
    const blob = new Blob([poem], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "photopoet-poem.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoDataUri(null);
    setPhotoPreview(null);
    setPoem(null);
    setInitialPoem(null);
    setUserEdits("");
  };

  const placeholderImage = PlaceHolderImages[0];

  return (
    <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-8 lg:p-12">
      <Card className="flex aspect-square flex-col justify-center overflow-hidden border-2 border-dashed shadow-none transition-all duration-300 md:aspect-auto">
        {!photoPreview ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={placeholderImage.imageUrl}
              alt={placeholderImage.description}
              data-ai-hint={placeholderImage.imageHint}
              fill
              className="object-cover opacity-20"
            />
            <label
              htmlFor="photo-upload"
              className="z-10 cursor-pointer rounded-lg p-8 text-center"
            >
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-background/80 p-12 transition-colors hover:border-primary hover:bg-accent">
                <UploadCloud className="h-12 w-12 text-muted-foreground" />
                <p className="font-semibold">Upload a Photo</p>
                <p className="text-sm text-muted-foreground">
                  Click or drag and drop an image
                </p>
              </div>
            </label>
            <Input
              id="photo-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={photoPreview}
              alt="User uploaded photo"
              fill
              className="object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 bg-background/50 hover:bg-background/80"
              onClick={handleReset}
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Start Over</span>
            </Button>
          </div>
        )}
      </Card>
      <div className="flex flex-col gap-8">
        {!photoPreview && (
          <Card className="flex flex-1 flex-col items-center justify-center text-center">
            <CardHeader>
              <CardTitle className="font-headline">
                Your Poem Awaits
              </CardTitle>
              <CardDescription>
                Upload a photo to begin your creative journey. Our AI will craft
                a unique poem inspired by your image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Sparkles className="h-16 w-16 text-primary" />
            </CardContent>
          </Card>
        )}
        {photoPreview && !poem && !isGenerating && (
          <Card className="flex flex-1 flex-col items-center justify-center text-center">
            <CardHeader>
              <CardTitle className="font-headline">Ready to write?</CardTitle>
              <CardDescription>
                Click the button below to generate a poem from your photo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGeneratePoem} size="lg">
                <Sparkles className="mr-2" />
                Generate Poem
              </Button>
            </CardContent>
          </Card>
        )}
        {(isGenerating || poem) && (
          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Poetic Vision</CardTitle>
              <CardDescription>
                Here is the AI-generated poem. Edit it as you wish, or ask the
                AI to refine it.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {isGenerating ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[80%]" />
                  <Skeleton className="h-6 w-[90%]" />
                  <Skeleton className="h-6 w-[70%]" />
                  <Skeleton className="h-6 w-[85%]" />
                  <Skeleton className="h-6 w-[75%]" />
                </div>
              ) : (
                <Textarea
                  value={poem ?? ""}
                  onChange={(e) => setPoem(e.target.value)}
                  rows={12}
                  className="resize-none text-base leading-relaxed"
                  placeholder="Your poem will appear here..."
                />
              )}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyPoem}
                  variant="outline"
                  className="flex-1"
                  disabled={!poem || isGenerating}
                >
                  <Copy /> Copy
                </Button>
                <Button
                  onClick={handleDownloadPoem}
                  variant="outline"
                  className="flex-1"
                  disabled={!poem || isGenerating}
                >
                  <Download /> Download
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="refine" className="font-semibold">
                  Refine with AI
                </Label>
                <Textarea
                  id="refine"
                  value={userEdits}
                  onChange={(e) => setUserEdits(e.target.value)}
                  placeholder="e.g., 'Make it a haiku', 'Add a more somber tone...'"
                  disabled={!poem || isImproving}
                />
                <Button
                  onClick={handleImprovePoem}
                  className="w-full"
                  disabled={!poem || !userEdits || isImproving}
                >
                  {isImproving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Wand2 />
                  )}
                  Improve Poem
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
