import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Camera, 
  ShieldCheck, 
  Wifi, 
  Smartphone, 
  Calendar, 
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const QRPortalPage: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [useCustomUrl, setUseCustomUrl] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const origin = window.location.origin;
    setCurrentUrl(origin);
    setCustomUrl(origin);
  }, []);

  const activeUrl = useCustomUrl && customUrl.trim() ? customUrl.trim() : (currentUrl || 'https://olympus-2026.vercel.app');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OLYMPUS 2026 | National Level Tech Fest',
          text: 'Join OLYMPUS 2026 organized by the Department of Electronics and Computer Engineering at Idea Lab, SVERI\'s College of Engineering!',
          url: activeUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('olympus-qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OLYMPUS-2026-Direct-QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPrintPoster = () => {
    // Render a high-resolution 1200x1600 printable poster
    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = 1200;
    posterCanvas.height = 1600;
    const ctx = posterCanvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 1600);
    bgGradient.addColorStop(0, '#060B18');
    bgGradient.addColorStop(0.5, '#0B1528');
    bgGradient.addColorStop(1, '#030712');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 1600);

    // Cyber border
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 1120, 1520);

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, 1090, 1490);

    // Header Text
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText("DEPARTMENT OF ELECTRONICS AND COMPUTER ENGINEERING", 600, 130);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '28px sans-serif';
    ctx.fillText("SVERI'S COLLEGE OF ENGINEERING, PANDHARPUR", 600, 175);

    // Title OLYMPUS
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 110px sans-serif';
    ctx.fillText("OLYMPUS 2026", 600, 290);

    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 32px monospace';
    ctx.fillText("NATIONAL LEVEL TECHNICAL SYMPOSIUM", 600, 350);

    // Date & Venue Pill
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(150, 390, 900, 100);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3;
    ctx.strokeRect(150, 390, 900, 100);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText("📅 02 OCTOBER 2026   |   📍 IDEA LAB, SVERI COE", 600, 452);

    // White box for QR code
    ctx.fillStyle = '#FFFFFF';
    ctx.roundRect ? ctx.roundRect(260, 530, 680, 680, 30) : ctx.fillRect(260, 530, 680, 680);
    ctx.fill();

    // Draw QR from original canvas
    const qrCanvas = document.getElementById('olympus-qr-canvas') as HTMLCanvasElement;
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, 300, 570, 600, 600);
    }

    // Call to Action
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 42px monospace';
    ctx.fillText("SCAN TO REGISTER & EXPLORE", 600, 1280);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '28px sans-serif';
    ctx.fillText("Scan with any Phone Camera, Google Lens, or Paytm", 600, 1330);

    ctx.fillStyle = '#38BDF8';
    ctx.font = '30px monospace';
    ctx.fillText(activeUrl, 600, 1390);

    ctx.fillStyle = '#64748B';
    ctx.font = '22px sans-serif';
    ctx.fillText("Permanent Direct URL  •  Zero Expiration  •  Open on Any 4G/5G/Wi-Fi", 600, 1480);

    // Download
    const a = document.createElement('a');
    a.href = posterCanvas.toDataURL('image/png');
    a.download = 'OLYMPUS-2026-Official-Print-Poster.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-4">
          <QrCode className="w-4 h-4" />
          <span>Non-Expiring Universal QR Code</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          OLYMPUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">QR PORTAL</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Direct, permanent QR Code for the OLYMPUS event website. Anyone on <strong className="text-slate-200">any network</strong> (Airtel, Jio, Vi, College Wi-Fi, 4G/5G) can scan using their native phone camera, Google Lens, or Paytm to immediately access the portal with <strong className="text-cyan-400">zero expiration</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md bg-slate-900/90 border-2 border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/40 relative group hover:border-cyan-400/60 transition-all">
            {/* Cyber Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

            <div className="text-center mb-5">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold block">
                Department of Electronics & Computer Engineering
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide mt-1">
                OLYMPUS 2026
              </h2>
              <p className="text-xs text-slate-400">Idea Lab, SVERI's College of Engineering</p>
            </div>

            {/* QR Code Canvas */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-inner flex flex-col items-center justify-center mx-auto" ref={canvasRef}>
              <QRCodeSVG
                value={activeUrl}
                size={240}
                level="H"
                includeMargin={true}
                className="w-full h-auto max-w-[240px]"
              />
              {/* Hidden Canvas used for high-res PNG export */}
              <div className="hidden">
                <QRCodeCanvas
                  id="olympus-qr-canvas"
                  value={activeUrl}
                  size={800}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Status indicators */}
            <div className="mt-5 space-y-2 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Code Expiration:
                </span>
                <span className="font-mono text-emerald-400 font-semibold uppercase">NEVER (Static Direct URL)</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  Network Compatibility:
                </span>
                <span className="font-mono text-cyan-300 font-medium">All Networks (4G/5G/Wi-Fi)</span>
              </div>
            </div>

            {/* Download and Share Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={downloadQRCode}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600/50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download QR</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Link</span>
              </button>
            </div>

            <button
              onClick={downloadPrintPoster}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Download Printable Event Poster</span>
            </button>
          </div>
        </div>

        {/* Right Column: Configuration & Scanner Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target URL Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              Target Website URL
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              This is the exact destination URL encoded into the QR code. Once deployed to your production domain or Vercel/Netlify link, the QR will lead directly to this address.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-slate-400 uppercase">Current Encoded URL</label>
                  <button
                    onClick={() => setUseCustomUrl(!useCustomUrl)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    {useCustomUrl ? 'Reset to Current Domain' : 'Enter Custom Production Domain'}
                  </button>
                </div>
                {useCustomUrl ? (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://olympus.sveri.ac.in or https://your-domain.vercel.app"
                      className="flex-grow bg-slate-800/90 border border-cyan-500/40 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg p-2.5">
                    <span className="font-mono text-sm text-cyan-300 truncate flex-grow">
                      {activeUrl}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                      title="Copy URL"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={activeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-white"
                      title="Open URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Scanner Action Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase mb-2">
                  <Camera className="w-3.5 h-3.5" />
                  <span>In-Browser Camera Scanner</span>
                </div>
                <h2 className="text-xl font-bold text-white">Need to Scan a Code or Ticket Pass?</h2>
                <p className="text-sm text-slate-300 mt-1 max-w-md">
                  Use our live in-browser scanner on any mobile device or laptop camera to scan QR codes, verify passes at Idea Lab, or open event links.
                </p>
              </div>
              <Link
                to="/scanner"
                className="whitespace-nowrap px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>Open QR Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Why this QR will never expire & works on all networks */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Why this QR Code Never Expires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/40 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Zero Third-Party Redirects
                </div>
                <p className="text-slate-400">
                  Unlike commercial QR generators that create temporary redirect links (which expire after 14 days), this code directly embeds the permanent destination URL.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/40 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  Any Cellular Network / Wi-Fi
                </div>
                <p className="text-slate-400">
                  Once the website is deployed to the internet (e.g. Vercel, Netlify, or college server), anyone with 4G/5G mobile data or Wi-Fi can scan and open it from anywhere in the world.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/40 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Event Day Ready (02 Oct 2026)
                </div>
                <p className="text-slate-400">
                  Ready for print on flyers, student IDs, posters, and presentation screens for registration and live result checking.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/40 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Idea Lab, SVERI COE
                </div>
                <p className="text-slate-400">
                  Coordinators can place printouts across all departments, labs, and entrance gates for seamless student check-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
