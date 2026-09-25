import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig, CameraDevice } from 'html5-qrcode';
import { 
  Camera, 
  Upload, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Ticket, 
  ArrowLeft,
  SwitchCamera
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const QRScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Play a quick subtle futuristic success beep
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext not permitted without interaction
    }
  };

  // Discover cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer environment (back) camera if available
          const backCam = devices.find((d) => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('environment') ||
            d.label.toLowerCase().includes('rear')
          );
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          setErrorMsg('No camera detected on this device. You can still scan by uploading an image!');
        }
      })
      .catch((err) => {
        console.warn('Camera discovery error:', err);
        setErrorMsg('Camera access was not granted or is not available. Please allow camera permissions in your browser or use the Upload tab.');
      });

    return () => {
      stopCameraScanner();
    };
  }, []);

  // Start or restart camera scanner whenever selected camera changes or tab is camera
  useEffect(() => {
    if (activeTab === 'camera' && selectedCameraId && !scanResult) {
      startCameraScanner(selectedCameraId);
    } else {
      stopCameraScanner();
    }
    return () => {
      stopCameraScanner();
    };
  }, [activeTab, selectedCameraId, scanResult]);

  const startCameraScanner = async (cameraId: string) => {
    setErrorMsg(null);
    try {
      if (html5QrCodeRef.current) {
        await stopCameraScanner();
      }

      const scanner = new Html5Qrcode('qr-reader-viewport');
      html5QrCodeRef.current = scanner;

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scanner.start(
        cameraId,
        config,
        (decodedText) => {
          playBeep();
          setScanResult(decodedText);
          stopCameraScanner();
        },
        () => {
          // Frame decode error (normal while scanning empty frames)
        }
      );
      setIsScanning(true);
    } catch (err: unknown) {
      console.error('Failed to start QR camera:', err);
      setIsScanning(false);
      setErrorMsg('Unable to access camera stream. Make sure HTTPS is enabled and permissions are granted.');
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      html5QrCodeRef.current = null;
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setErrorMsg(null);

    try {
      // Use temporary scanner instance to decode file
      const fileScanner = new Html5Qrcode('file-qr-temp-viewport');
      const decodedText = await fileScanner.scanFile(file, true);
      playBeep();
      setScanResult(decodedText);
      await fileScanner.clear();
    } catch (err) {
      console.error('Error scanning file:', err);
      setErrorMsg('Could not detect a valid QR code in this image. Please upload a clear, high-resolution photo.');
    }
  };

  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setScanResult(null);
    setErrorMsg(null);
    if (activeTab === 'camera' && selectedCameraId) {
      startCameraScanner(selectedCameraId);
    }
  };

  const isUrl = scanResult && (scanResult.startsWith('http://') || scanResult.startsWith('https://'));
  const isInternalUrl = isUrl && scanResult.includes(window.location.host);
  const isPassCode = scanResult && (scanResult.startsWith('OLYMPUS-') || scanResult.startsWith('REG-'));

  const handleOpenResult = () => {
    if (!scanResult) return;
    if (isPassCode) {
      navigate(`/pass/${scanResult}`);
    } else if (isInternalUrl) {
      const url = new URL(scanResult);
      navigate(url.pathname + url.search);
    } else if (isUrl) {
      window.open(scanResult, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/qr"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event QR Portal</span>
        </Link>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Idea Lab Check-In System
        </span>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
          <Camera className="w-3.5 h-3.5" />
          <span>Universal In-Browser Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          SCAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">QR CODE</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Scan the OLYMPUS website QR, team verification passes, or payment receipts using your camera or by uploading a photo.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setActiveTab('camera');
            setScanResult(null);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'camera'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('upload');
            setScanResult(null);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'upload'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Scanner Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-xl pointer-events-none" />

        {scanResult ? (
          /* Result View */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Scan Successful
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {isPassCode ? 'OLYMPUS Team Pass Detected' : isUrl ? 'Website Link Detected' : 'QR Code Content'}
              </h2>
            </div>

            {/* Scanned payload box */}
            <div className="max-w-xl mx-auto bg-slate-950 border border-slate-800 rounded-xl p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Decoded Data</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="font-mono text-sm text-cyan-300 break-all select-all">
                {scanResult}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              {(isUrl || isPassCode) && (
                <button
                  onClick={handleOpenResult}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {isPassCode ? <Ticket className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                  <span>{isPassCode ? 'View Team Pass' : 'Open Website'}</span>
                </button>
              )}
              <button
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Scan Another</span>
              </button>
            </div>
          </div>
        ) : activeTab === 'camera' ? (
          /* Live Camera View */
          <div>
            {cameras.length > 1 && (
              <div className="flex items-center justify-end mb-3">
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                  <SwitchCamera className="w-3.5 h-3.5 text-cyan-400" />
                  <select
                    value={selectedCameraId}
                    onChange={(e) => setSelectedCameraId(e.target.value)}
                    className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
                  >
                    {cameras.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.label || `Camera ${c.id.substring(0, 5)}...`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Viewport container */}
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-slate-800 flex items-center justify-center">
              <div id="qr-reader-viewport" className="w-full h-full" />
              
              {/* Overlay Laser Sweep Animation */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none border-2 border-cyan-400/40 rounded-2xl">
                  <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00F0FF] animate-bounce top-1/2" />
                </div>
              )}
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
              Point your camera steadily at any QR Code to automatically scan and open.
            </p>
          </div>
        ) : (
          /* File Upload View */
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Upload a QR Screenshot or Photo</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Saved a screenshot of a pass or website flyer? Upload it here to decode it instantly.
            </p>

            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm cursor-pointer shadow-lg shadow-cyan-500/20 transition-all">
              <Upload className="w-4 h-4" />
              <span>Select QR Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Hidden viewport container for Html5Qrcode file scan */}
            <div id="file-qr-temp-viewport" className="hidden" />
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Notice:</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-xs">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300">
          <span className="font-bold text-white block mb-1">⚡ Fast & In-Browser</span>
          Processing happens locally on your device with no latency or server upload.
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300">
          <span className="font-bold text-white block mb-1">🎫 Pass Verification</span>
          Instantly recognizes OLYMPUS Team Passes for entrance at Idea Lab.
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-300">
          <span className="font-bold text-white block mb-1">🔒 Completely Private</span>
          Camera feed is processed in real time and never recorded or transmitted.
        </div>
      </div>
    </div>
  );
};
