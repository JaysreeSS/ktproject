import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function LayoutWithFooter() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <ScrollToTop />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
