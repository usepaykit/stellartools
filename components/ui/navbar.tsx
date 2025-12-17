"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import type { ReactElement } from "react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { CirclePlus, LogOut, Monitor, Moon, Sun } from "@aliimam/icons";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Paykit } from "../icon";

const cloud: {
  title: string;
  logoUrl: string;
  href: string;
  description: string;
}[] = [
  {
    title: "AI SDK",
    href: "https://ai-sdk.dev/",
    logoUrl: "/images/integrations/aisdk.jpg",
    description: "Unified SDK for integrating AI models in TypeScript.",
  },
  {
    title: "Better Auth",
    href: "https://www.better-auth.com/",
    logoUrl: "/images/integrations/better-auth.png",
    description: "Simple, secure authentication and session management.",
  },
  {
    title: "Shopify",
    href: "https://shopify.dev/",
    logoUrl: "/images/integrations/shopify.png",
    description: "Connect your app with Shopify’s e-commerce platform.",
  },
  {
    title: "Medus",
    href: "https://www.medusajs.com/",
    logoUrl: "/images/integrations/medusa.svg",
    description: "Headless commerce backend for custom online stores.",
  },
  {
    title: "UploadThing",
    href: "https://uploadthing.com/",
    logoUrl: "/images/integrations/uploadthing.png",
    description: "Secure, easy file upload service for web apps.",
  },
  {
    title: "PayloadCms",
    href: "https://payloadcms.com/",
    logoUrl: "/images/integrations/payloadcms.png",
    description: "Developer-friendly headless CMS and API backend.",
  },
];

const cases: {
  title: string;
  href: string;
  description: string;
  logoUrl: string;
}[] = [
  {
    title: "Al Apps",
    href: "#",
    description: "Deploy at the speed of Al",
    logoUrl: "/images/integrations/better-auth.png",
  },
  {
    title: "Composable Commerce",
    href: "#",
    description: "Power storefronts that convert",
    logoUrl: "/images/integrations/better-auth.png",
  },
  {
    title: "Marketing Sites",
    href: "#",
    description: "Jumpstart app development",
    logoUrl: "/images/integrations/better-auth.png",
  },
  {
    title: "Multi-tenant Platforms",
    href: "#",
    description: "Scale apps with one codebase",
    logoUrl: "/images/integrations/better-auth.png",
  },

  {
    title: "Web Apps",
    href: "#",
    description: "Ship features, not infrastructure",
    logoUrl: "/images/integrations/better-auth.png",
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = false;
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`flex sticky px-4 z-50 top-0 w-full bg-background items-center h-16 justify-between transition-border duration-300 ${
        scrolled ? "border-b" : "border-b-0"
      }`}
    >
      {" "}
      <div className="flex items-center justify-between w-full  mx-auto max-w-7xl">
        <div className="flex h-14 justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Paykit className="size-8" />
            <span className="text-muted-foreground">/</span>
            <Image
              src="/images/logo-light.png"
              alt="Stellar Tools logo"
              width={32}
              height={32}
              className="size-8 object-contain rounded-md"
            />
            <span className="text-lg font-semibold font-rosemary">
              Stellar Tools
            </span>
          </Link>
          <NavigationMenu className="ml-8 hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-7.5 font-normal text-muted-foreground"
                  )}
                >
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background pt-3">
                  <ul className="w-[300px]">
                    <div>
                      <span className="p-4 text-muted-foreground">
                        Adapters
                      </span>
                      {cloud.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          logoUrl={component.logoUrl}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-7.5 font-normal text-muted-foreground"
                  )}
                >
                  Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background pt-3">
                  <ul className="w-[300px]">
                    <div>
                      <span className="p-4 text-muted-foreground">
                        Use Cases
                      </span>
                      {cases.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          logoUrl={component.logoUrl}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </div>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-7.5 font-normal text-muted-foreground"
                  )}
                >
                  <Link href="#">Enterprise</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-7.5 font-normal text-muted-foreground"
                  )}
                >
                  <Link href="#">Docs</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full h-7.5 font-normal text-muted-foreground"
                  )}
                >
                  <Link href="#">Pricing</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <>
              <Button variant={"outline"} size={"sm"}>
                Contact
              </Button>
              <Button variant={"outline"} size={"sm"}>
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={"secondary"}
                size={"sm"}
                className="shadow-buttons-inverted shadow-md"
              >
                Docs
              </Button>
              <Button variant={"default"} size={"sm"}>
                Get Started
              </Button>
            </>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="border">
              <AvatarImage
                src="https://raw.githubusercontent.com/aliimam-in/templates/refs/heads/main/apps/vercel/public/ali.jpg"
                alt="Ali Imam"
              />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-70 p-3 rounded-xl" align="end">
            <div className="p-2">
              <h1 className="font-semibold">Ali Imam</h1>
              <p className="text-sm text-muted-foreground">
                contact@aliimam.in
              </p>
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem className="py-3">Dadhboard</DropdownMenuItem>
              <DropdownMenuItem className="py-3">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 justify-between">
                Create Taems <CirclePlus strokeWidth={2} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="-mx-3" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="py-3 justify-between">
                Theme <ThemeSwitcher />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="-mx-3" />

            <DropdownMenuItem className="py-3 justify-between">
              Logout <LogOut strokeWidth={2} />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="-mx-3" />
            <DropdownMenuItem className="pt-3">
              <Button className="w-full">Upgrade to Pro</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ListItem({
  title,
  icon,
  logoUrl,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: ReactElement;
  logoUrl?: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild className="hover:bg-transparent w-fit">
        <Link href={href} target="_blank" rel="noreferrer">
          <div className="flex gap-3 items-start rounded p-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${title} logo`}
                width={24}
                height={24}
                className="size-6 object-contain rounded-full"
              />
            ) : icon ? (
              <div className="border rounded-sm p-2 icon-container">{icon}</div>
            ) : null}
            <div className="text-container">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="text-muted-foreground line-clamp-2 pt-1 text-xs leading-snug">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
      <style jsx>{`
        li:hover .icon-container {
          background-color: var(--foreground);
          color: var(--background);
          transform: scale(1.05);
          transition: all 0.2s ease;
        }
        li:hover .text-container .text-sm {
          color: var(--foreground);
          transition: color 0.2s ease;
        }
        li:hover .text-container p {
          color: var(--foreground);
          transition: color 0.2s ease;
        }
      `}</style>
    </li>
  );
}

const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme",
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme",
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme",
  },
];

export type ThemeSwitcherProps = {
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
};

const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative isolate flex h-7 rounded-full bg-background p-1 ring-1 ring-border",
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            className="relative h-5 w-6 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key as "light" | "dark" | "system")}
            type="button"
          >
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-secondary" />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-3.5 w-3.5",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
