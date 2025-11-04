import React from "react";

const Footer = () => (
  <footer className="bg-white border-t mt-20 py-10 px-10 text-sm">
    <div className="grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold text-lg mb-2">AgroIntelX</h3>
        <p className="text-gray-600">Empowering farmers with AI-driven agriculture insights.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Product</h4>
        <ul className="space-y-1 text-gray-600">
          <li>Features</li>
          <li>Pricing</li>
          <li>Dashboard</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Company</h4>
        <ul className="space-y-1 text-gray-600">
          <li>About</li>
          <li>Contact</li>
          <li>Blog</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Legal</h4>
        <ul className="space-y-1 text-gray-600">
          <li>Privacy</li>
          <li>Terms</li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
