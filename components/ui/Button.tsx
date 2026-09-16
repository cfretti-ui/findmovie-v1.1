"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motionEase } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "glass";
type ButtonSize = "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "fm-button-primary",
  secondary: "fm-button-secondary",
  ghost: "fm-button-ghost",
  inverse: "fm-button-inverse",
  glass: "fm-button-glass",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-7 text-[15px] sm:h-[52px] sm:px-8 sm:text-base",
};

interface SharedProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonProps = SharedProps &
  (Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined } | { href: string });

export function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const classes = `fm-button ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.2, ease: motionEase }} className="inline-flex">
        <Link href={props.href} className={classes}>{children}</Link>
      </motion.div>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <motion.button
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
      aria-label={buttonProps["aria-label"]}
      aria-disabled={buttonProps["aria-disabled"]}
      name={buttonProps.name}
      value={buttonProps.value}
      form={buttonProps.form}
      className={classes}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: motionEase }}
    >
      {children}
    </motion.button>
  );
}
