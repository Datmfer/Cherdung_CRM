"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import Footer from "../components/Footer";
import BlogFeed from "../components/blogs/BlogFeed";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading platform...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show the Blog Feed landing page with full navbar and dashboard access
  if (user) {
    return (
      <>
        <Navbar />
        <BlogFeed />
        <Footer />
      </>
    );
  }

  // If not logged in, show standard marketing landing page
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Footer />
    </>
  );
}
