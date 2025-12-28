import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Heart } from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Integrations", href: "#integrations" },
      { name: "Pricing", href: "#pricing" },
      { name: "Documentation", href: "/dashboard/documentation" },
    ],
    resources: [
      { name: "API Reference", href: "/dashboard/documentation" },
      { name: "Guides", href: "/dashboard/documentation" },
      { name: "Blog", href: "#" },
      { name: "Support", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Contact", href: "#" },
    ],
  };

  return (
    <footer className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="relative h-10 w-10">
                  <Image
                    src="/images/logo-light.png"
                    alt="Stellar Tools"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain dark:hidden"
                  />
                  <Image
                    src="/images/logo-dark.png"
                    alt="Stellar Tools"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain hidden dark:block"
                  />
                </div>
                <span className="font-rosemary text-xl font-semibold text-foreground">
                  Stellar Tools
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
                Bring Stellar Payments to Every Platform Instantly. Unified adapters
                for BetterAuth, Medusa, Shopify, and more—make crypto-native payments
                seamless for your users.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/usepaykit/stellar-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/usepaykit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Section */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Get Started
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Start accepting Stellar payments in minutes.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Stellar Tools. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span>by</span>
              <span className="font-semibold text-foreground">Stellar</span>
            </div>
          </div>
        </div>
    </div>
    </footer>
  );
}
