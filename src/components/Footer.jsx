import React from "react";

export default function Footer() {
    return (
        <footer className="bg-primary border-t border-white/10 py-6 px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <p className="text-xs text-white/80 font-medium">
                    © {new Date().getFullYear()} KT Project. All rights reserved by Ideassion.
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
}
