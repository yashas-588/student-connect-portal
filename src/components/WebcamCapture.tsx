import { useRef, useState, useCallback } from "react";
import { Camera, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  capturedImage: string | null;
}

const WebcamCapture = ({ onCapture, capturedImage }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch {
      console.error("Camera access denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0, 320, 320);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(dataUrl);
    stopCamera();
  }, [onCapture, stopCamera]);

  const retake = useCallback(() => {
    onCapture("");
    startCamera();
  }, [onCapture, startCamera]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-border bg-secondary flex items-center justify-center">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : streaming ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        ) : (
          <Camera className="w-10 h-10 text-muted-foreground" />
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />

      {capturedImage ? (
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={retake}>
            <RotateCcw className="w-4 h-4 mr-1" /> Retake
          </Button>
          <div className="flex items-center gap-1 text-accent text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Captured
          </div>
        </div>
      ) : streaming ? (
        <Button type="button" size="sm" onClick={capture}>
          <Camera className="w-4 h-4 mr-1" /> Capture Photo
        </Button>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={startCamera}>
          <Camera className="w-4 h-4 mr-1" /> Open Camera
        </Button>
      )}
    </div>
  );
};

export default WebcamCapture;
