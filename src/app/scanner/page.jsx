"use client";
import { MdSync } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "scrollreveal";

const Scanner = () => {
  useEffect(() => {
    // Pastikan kode hanya dijalankan di sisi klien (browser)
    if (typeof window !== "undefined") {
      const sr = ScrollReveal({
        distance: "60px",
        duration: 2500,
        origin: "top",
        delay: 300,
      });

      // Konfigurasi untuk teks
      sr.reveal(".text-reveal");

      // Konfigurasi untuk gambar
      sr.reveal(".image-reveal", {
        delay: 500,
        scale: 0.5,
      });

      // Konfigurasi untuk card
      sr.reveal(".card-reveal", {
        interval: 300,
      });

      // Konfigurasi untuk elemen yang masuk dari kiri
      sr.reveal(".left-reveal", {
        origin: "left",
      });

      // Konfigurasi untuk elemen yang masuk dari kanan
      sr.reveal(".right-reveal", {
        origin: "right",
      });
    }
  }, []);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [prediction, setPrediction] = useState({
    class: "Waiting...",
    confidence: "N/A",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [currentCameraLabel, setCurrentCameraLabel] = useState("Real-Time Camera");
  const [loadingTextPrediction, setLoadingTextPrediction] = useState("Detecting waste type...");
  const [loadingTextConfidence, setLoadingTextConfidence] = useState("Calculating accuracy...");

  // Periksa kamera yang tersedia
  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setAvailableCameras(videoDevices); // Simpan daftar kamera
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };

    checkCameras();
  }, []);

  // Aktifkan kamera
  useEffect(() => {
    let currentStream = null;

    if (isCameraOn) {
      const startCamera = async () => {
        try {
          const videoDeviceId = availableCameras[currentCameraIndex]?.deviceId;
          const cameraLabel = availableCameras[currentCameraIndex]?.label || "Unknown Camera";

          // Perbarui label kamera aktif
          setCurrentCameraLabel(cameraLabel);

          // Mulai aliran video dari kamera
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: videoDeviceId },
          });

          setStream(newStream);
          currentStream = newStream;

          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        } catch (error) {
          alert("Error accessing camera: " + error.message);
        }
      };

      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn, currentCameraIndex, availableCameras]);

  // Fungsi untuk mengganti kamera
  const switchCamera = async () => {
    if (availableCameras.length > 0) {
      const nextCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
      setCurrentCameraIndex(nextCameraIndex);
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
    setPrediction({
      class: "Waiting...",
      confidence: "N/A",
    });
    setCurrentCameraLabel("Real-Time Camera");
  };

  const captureAndClassify = async () => {
    if (!isCameraOn || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video.srcObject) {
      console.error("Video stream is not available.");
      return;
    }

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to generate image blob.");
        return;
      }

      setIsLoading(true);
      const file = new File([blob], "captured_image.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setPrediction({
            class: result.class,
            confidence: (result.confidence * 100).toFixed(2) + "%",
          });
        } else {
          console.error("Prediction error:", result.detail);
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      } finally {
        setIsLoading(false);
      }
    }, "image/png");
  };

  useEffect(() => {
    let interval;
    if (isCameraOn) {
      interval = setInterval(captureAndClassify, 2000);
    }
    return () => clearInterval(interval);
  }, [isCameraOn, stream]);

  return (
    <main>
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-secondary mb-4 text-reveal">Smart Waste Identification</h1>
        <p className="text-gray-200 text-lg max-w-3xl mx-auto text-reveal">
          Start by identifying different types of waste using our AI-powered camera system. Point your camera at any waste material for instant identification
        </p>
      </section>

      {/* Camera Section */}
      <section className="max-w-3xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 image-reveal">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">{currentCameraLabel}</h1>

            {/* Camera Preview */}
            <div className="relative bg-gray-800 w-full max-w-xl aspect-video rounded-lg mb-4 overflow-hidden">
              {isCameraOn ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Camera is off</p>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>

            {/* Camera Controls */}
            <div className="flex flex-col md:flex-row gap-5 text-center">
              <button
                onClick={toggleCamera}
                className={`${
                  isCameraOn ? "bg-red-500" : "bg-green-500"
                } text-white font-bold mt-4 py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:opacity-80`}
              >
                {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
              </button>
              {isCameraOn && availableCameras.length > 1 && (
                <button
                  onClick={switchCamera}
                  className="flex items-center gap-2 bg-base text-primary font-bold mt-4 py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-secondary"
                >
                  <MdSync size={30} /> Switch Camera
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Live Analysis Results */}
      <section className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-reveal">
          <h3 className="text-xl font-semibold text-secondary mb-4 card-reveal">Live Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg card-reveal">
              <span className="text-gray-200">Prediction</span>
              <span className="text-secondary font-semibold">{isLoading ? "Classifying image..." : prediction.class}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg card-reveal">
              <span className="text-gray-200">Confidence</span>
              <span className="text-secondary font-semibold">{isLoading ? "Calculating accuracy..." : prediction.confidence}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-secondary mb-8 text-center text-reveal">Quick Tips to Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-lg p-6 transform transition-all duration-300 hover:bg-white/10 left-reveal">
            <h3 className="text-xl font-semibold text-white mb-3">📷 Camera Tips</h3>

            <div className="space-y-4">
              {/* Tip 1 */}
              <div>
                <h4 className="font-semibold text-xl">1. Enable Camera Access</h4>
                <p>Ensure that your browser or app has permission to access your camera. This is the first step to start using real-time camera features.</p>
              </div>

              {/* Tip 2 */}
              <div>
                <h4 className="font-semibold text-xl">2. Position the Camera</h4>
                <p>Position the camera in a well-lit area for better image recognition. Make sure the camera focuses on the object or area you want to detect.</p>
              </div>

              {/* Tip 3 */}
              <div>
                <h4 className="font-semibold text-xl">3. Check for Stability</h4>
                <p>To get accurate results, ensure that the camera is stable. Avoid sudden movements that could disrupt real-time processing.</p>
              </div>

              {/* Tip 4 */}
              <div>
                <h4 className="font-semibold text-xl">4. Test Before Use</h4>
                <p>Before using the camera for actual processing, test it to ensure it's capturing clear and focused images for optimal results.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-6 transform transition-all duration-300 hover:bg-white/10 right-reveal">
            <h3 className="text-xl font-semibold text-white mb-3">💬 Best Practices</h3>

            <div className="space-y-4">
              {/* Tip 1 */}
              <div>
                <h4 className="font-semibold text-xl">1. Choose the Right Environment</h4>
                <p>Make sure the environment is clean and clutter-free. A simple, organized background makes it easier for the camera to detect objects.</p>
              </div>

              {/* Tip 2 */}
              <div>
                <h4 className="font-semibold text-xl">2. Adjust Camera Settings</h4>
                <p>Adjust the camera settings such as focus and exposure for better image quality, especially in low-light conditions.</p>
              </div>

              {/* Tip 3 */}
              <div>
                <h4 className="font-semibold text-xl">3. Keep the Camera Lens Clean</h4>
                <p>Ensure that the lens is clean and free from smudges, as dirty lenses can affect the quality of captured images.</p>
              </div>

              {/* Tip 4 */}
              <div>
                <h4 className="font-semibold text-xl">4. Regularly Update the Software</h4>
                <p>Keep your camera drivers and software up to date to ensure compatibility with real-time processing features.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Scanner;
