import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const companiesLogo = [
    { logo: <div className="text-gray-400">Logo 1</div> },
    { logo: <div className="text-gray-400">Logo 2</div> },
    { logo: <div className="text-gray-400">Logo 3</div> },
    { logo: <div className="text-gray-400">Logo 4</div> },
    { logo: <div className="text-gray-400">Logo 5</div> },
  ];

  return (
    <div className="min-h-screen pb-20">

      {/* ================= NAVBAR ================= */}
      <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">

        {/* Logo */}
        <a href="/">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-slate-800">
          <a href="#" className="hover:text-green-600">Home</a>
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#testimonials" className="hover:text-green-600">Testimonials</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
        </div>

        {/* ================= AUTH BUTTONS ================= */}
        <div className="hidden md:flex gap-2">

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <Link
                to="/app?state=register"
                className="px-6 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white"
              >
                Get started
              </Link>

              <Link
                to="/app?state=login"
                className="px-6 py-2 border hover:bg-slate-50 active:scale-95 transition-all rounded-full text-slate-700"
              >
                Login
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <Link
              to="/app"
              className="px-8 py-2 bg-green-500 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white"
            >
              Dashboard
            </Link>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-2xl">
          ☰
        </button>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 bg-black/50 flex flex-col items-center justify-center gap-6 text-white text-lg transition ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <a href="#">Home</a>
        <a href="#features">Features</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>

        <button
          onClick={() => setMenuOpen(false)}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
          Get more interviews with{" "}
          <span className="text-green-600">AI-powered</span> resumes.
        </h1>

        <p className="mt-4 text-gray-600 max-w-md">
          Create, edit and download professional resumes with AI-powered assistance.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Link
            to="/app"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-9 h-12 flex items-center transition-colors"
          >
            Get Started
          </Link>

          <button className="border px-6 py-3 rounded-full">
            Try Demo
          </button>
        </div>

        {/* Logos */}
        <div className="flex gap-6 mt-12 flex-wrap justify-center">
          {companiesLogo.map((item, index) => (
            <div key={index}>{item.logo}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;