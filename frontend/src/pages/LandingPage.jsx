import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle,
  Wrench,
  FileText,
  Activity,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Device Illustration SVG
   ───────────────────────────────────────────── */
function DeviceIllustration() {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="device-svg-group"
    >
      {/* Soft glow base */}
      <ellipse cx="200" cy="300" rx="170" ry="28" fill="rgba(167,139,250,0.18)" />

      {/* Laptop body */}
      <rect x="60" y="80" width="230" height="155" rx="12" fill="#1e1e2e" />
      <rect x="68" y="88" width="214" height="139" rx="8" fill="#0f0f1a" />
      {/* Laptop screen content */}
      <rect x="75" y="95" width="200" height="125" rx="5" fill="#1a1a2e" />
      {/* Screen UI lines */}
      <rect x="84" y="102" width="80" height="6" rx="3" fill="rgba(91,92,247,0.6)" />
      <rect x="84" y="113" width="120" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x="84" y="122" width="100" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      <rect x="84" y="135" width="182" height="30" rx="6" fill="rgba(91,92,247,0.2)" />
      <rect x="91" y="141" width="40" height="4" rx="2" fill="rgba(91,92,247,0.8)" />
      <rect x="91" y="149" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
      <rect x="84" y="172" width="60" height="18" rx="4" fill="rgba(16,185,129,0.3)" />
      <rect x="150" y="172" width="50" height="18" rx="4" fill="rgba(91,92,247,0.25)" />
      {/* Laptop base */}
      <rect x="30" y="235" width="290" height="14" rx="7" fill="#2d2d44" />
      <rect x="130" y="235" width="90" height="6" rx="3" fill="#1a1a2e" />

      {/* Smartphone */}
      <rect x="285" y="110" width="68" height="118" rx="14" fill="#2d2d44" />
      <rect x="290" y="116" width="58" height="106" rx="10" fill="#0f0f1a" />
      <rect x="295" y="121" width="48" height="96" rx="6" fill="#1a1a2e" />
      {/* Phone screen content */}
      <rect x="299" y="127" width="40" height="5" rx="2" fill="rgba(91,92,247,0.7)" />
      <rect x="299" y="137" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="299" y="147" width="40" height="22" rx="5" fill="rgba(91,92,247,0.15)" />
      <rect x="302" y="151" width="16" height="3" rx="1.5" fill="rgba(91,92,247,0.9)" />
      <rect x="302" y="158" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="299" y="175" width="40" height="22" rx="5" fill="rgba(16,185,129,0.15)" />
      <rect x="302" y="179" width="20" height="3" rx="1.5" fill="rgba(16,185,129,0.9)" />
      <rect x="302" y="186" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      {/* Phone notch */}
      <rect x="311" y="118" width="18" height="5" rx="2.5" fill="#2d2d44" />

      {/* Smartwatch */}
      <rect x="280" y="240" width="44" height="48" rx="12" fill="#2d2d44" />
      <rect x="285" y="245" width="34" height="38" rx="8" fill="#0f0f1a" />
      <rect x="288" y="248" width="28" height="32" rx="5" fill="#1a1a2e" />
      {/* Watch screen */}
      <rect x="291" y="253" width="22" height="4" rx="2" fill="rgba(91,92,247,0.8)" />
      <rect x="295" y="260" width="14" height="8" rx="2" fill="rgba(16,185,129,0.5)" />
      {/* Watch band */}
      <rect x="289" y="228" width="10" height="14" rx="3" fill="#3d3d55" />
      <rect x="299" y="228" width="10" height="14" rx="3" fill="#3d3d55" />
      <rect x="289" y="286" width="10" height="14" rx="3" fill="#3d3d55" />
      <rect x="299" y="286" width="10" height="14" rx="3" fill="#3d3d55" />

      {/* AirPods case */}
      <ellipse cx="248" cy="270" rx="26" ry="30" fill="#e8e8f0" />
      <ellipse cx="248" cy="270" rx="20" ry="24" fill="white" />
      <ellipse cx="243" cy="266" rx="5" ry="8" fill="#ddd" />
      <ellipse cx="253" cy="266" rx="5" ry="8" fill="#ddd" />

      {/* Small plants / decorative */}
      <rect x="20" y="180" width="6" height="40" rx="3" fill="#6b7280" />
      <ellipse cx="23" cy="175" rx="12" ry="15" fill="rgba(134,239,172,0.7)" />
      <ellipse cx="14" cy="182" rx="9" ry="11" fill="rgba(134,239,172,0.5)" />
      <ellipse cx="32" cy="180" rx="9" ry="12" fill="rgba(134,239,172,0.6)" />

      {/* Platform/pedestal */}
      <ellipse cx="200" cy="252" rx="190" ry="18" fill="rgba(200,195,240,0.35)" />
      <ellipse cx="200" cy="252" rx="155" ry="12" fill="rgba(200,195,240,0.25)" />
    </svg>
  );
}



/* ═══════════════════════════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const [quickTrackId, setQuickTrackId] = useState('');
  const navigate = useNavigate();

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    } else {
      navigate('/track');
    }
  };

  return (
    <div className="landing-page">
      {/* ── Navigation ── */}
      <header className="landing-nav">
        <div className="landing-nav-container">
          {/* Logo */}
          <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
            <div className="sidebar-logo-icon">
              <Wrench size={15} />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.025em' }}>RepairFlow</span>
          </Link>

          {/* Nav Links */}
          <nav className="landing-nav-links">
            <a href="#home" className="active">Home</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="hero-wrapper" id="home">
        <section className="hero-section">
          {/* Left column */}
          <div className="hero-left">
            <div className="hero-label">
              Device Repairs Made Simple
            </div>

            <h1 className="hero-headline">
              Repairs, without<br />
              <span className="accent">the uncertainty.</span>
            </h1>

            <p className="hero-subtitle">
              RepairFlow helps you manage device repairs with complete transparency.
              Create repair requests, track progress in real time and get your
              devices back with confidence.
            </p>

            {/* Entry Cards */}
            <div className="entry-cards-grid">
              <Link to="/track" className="entry-card customer-card">
                <div className="entry-card-icon">
                  <Search size={20} />
                </div>
                <div className="entry-card-body">
                  <div className="entry-card-title">Track Your Repair</div>
                  <div className="entry-card-desc">Enter your repair ID to check status</div>
                </div>
                <div className="entry-card-arrow">
                  <ArrowRight size={14} />
                </div>
              </Link>
            </div>
          </div>

          {/* Right column: illustration */}
          <div className="hero-right">
            <div className="device-illustration">
              {/* Floating card: Estimated Time */}
              <div className="float-card card-time">
                <div className="float-icon orange">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="float-card-label">Estimated Time</div>
                  <div className="float-card-value">2 – 5 Days</div>
                  <div style={{ height: 3, background: 'var(--primary)', borderRadius: 99, width: '60%', marginTop: 4 }} />
                </div>
              </div>

              {/* Device SVG */}
              <div className="device-scene">
                <DeviceIllustration />
              </div>

              {/* Floating card: Real-time Tracking */}
              <div className="float-card card-tracking">
                <div className="float-icon indigo">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="float-card-label">Real-time Tracking</div>
                  <div className="float-card-sub">Get updates at every stage</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Repair Progress Strip ── */}
        <div className="repair-progress-strip">
          <div className="repair-progress-inner">
            <div className="rp-step">
              <div className="rp-icon received">
                <FileText size={16} />
              </div>
              <div className="rp-label">Received</div>
              <div className="rp-sub">We've got your device</div>
            </div>
            <div className="rp-step">
              <div className="rp-icon diagnosing">
                <Activity size={16} />
              </div>
              <div className="rp-label">Diagnosing</div>
              <div className="rp-sub">Identifying the issue</div>
            </div>
            <div className="rp-step">
              <div className="rp-icon in-repair">
                <Wrench size={16} />
              </div>
              <div className="rp-label">In Repair</div>
              <div className="rp-sub">Our experts are working</div>
            </div>
            <div className="rp-step">
              <div className="rp-icon completed">
                <CheckCircle size={16} />
              </div>
              <div className="rp-label">Completed</div>
              <div className="rp-sub">Your device is ready</div>
            </div>
          </div>
        </div>
      </div>



      {/* ── Footer ── */}
      <footer className="landing-footer" id="about">
        <div className="footer-container">
          <div className="footer-brand">
            <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
              <div className="sidebar-logo-icon">
                <Wrench size={15} />
              </div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>RepairFlow</span>
            </Link>
            <p>
              A modern repair management platform built for small electronics shops.
              Transparent tracking, organised workflows, and billing in ₹ — all in one place.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Platform</h4>
            <Link to="/track">Track a Repair</Link>
            <Link to="/staff/login">Staff Sign In</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 RepairFlow. Built with React, Java Spring Boot &amp; PostgreSQL. Monetary values displayed in Indian Rupees (₹).
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
