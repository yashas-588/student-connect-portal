import { useRef, useState, useCallback } from "react";
import { Camera, RotateCcw, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiWebcamCaptureProps {
  maxCaptures?: number;
  capturedImages: string[];
  onImagesChange: (images: string[]) => void;
}

const MultiWebcamCapture = ({
  maxCaptures = 5,
  capturedImages,
  onImagesChange,
}: MultiWebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      console.error("Camera access denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 480;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0, 480, 480);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const updated = [...capturedImages, dataUrl];
    onImagesChange(updated);
    if (updated.length >= maxCaptures) stopCamera();
  }, [capturedImages, onImagesChange, maxCaptures, stopCamera]);

  const removeImage = useCallback(
    (index: number) => {
      onImagesChange(capturedImages.filter((_, i) => i !== index));
    },
    [capturedImages, onImagesChange]
  );

  const resetAll = useCallback(() => {
    onImagesChange([]);
    stopCamera();
  }, [onImagesChange, stopCamera]);

  const remaining = maxCaptures - capturedImages.length;
  const allCaptured = remaining <= 0;

  return (
    <div className="space-y-4">
      {/* Camera viewfinder */}
      {!allCaptured && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-border/50 bg-secondary/50 flex items-center justify-center">
            {streaming ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-12 h-12 text-muted-foreground" />
            )}
          </div>

          {streaming ? (
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={capture} className="gap-1.5">
                <Camera className="w-4 h-4" /> Capture ({remaining} left)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={stopCamera}>
                Close
              </Button>
            </div>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={startCamera} className="gap-1.5">
              <Camera className="w-4 h-4" /> Open Camera
            </Button>
          )}
        </div>
      )}

      {/* Captured images grid */}
      {capturedImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-medium">
              {capturedImages.length}/{maxCaptures} photos captured
              {allCaptured && (
                <span className="ml-2 text-accent inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> All done!
                </span>
              )}
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={resetAll} className="h-7 text-xs gap-1">
              <RotateCcw className="w-3 h-3" /> Reset
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {capturedImages.map((img, i) => (
              <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-border/50">
                <img src={img} alt={`Capture ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-0.5 left-0.5 text-[10px] font-bold text-primary-foreground bg-primary/80 px-1 rounded">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-secondary/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${(capturedImages.length / maxCaptures) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default MultiWebcamCapture;
