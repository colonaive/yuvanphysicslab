import Link, { type LinkProps } from "next/link";
import { type ClassValue } from "clsx";
import type React from "react";
import { cn } from "@/lib/utils";
import { semanticClasses } from "@/theme/tokens";

type ButtonVariant = "primary" | "outline" | "ghost";

interface BaseButtonProps {
  variant?: ButtonVariant;
  className?: ClassValue;
  children: React.ReactNode;
}

type NativeButtonProps = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    href: LinkProps["href"];
  };

type ButtonProps = NativeButtonProps | LinkButtonProps;

const variantMap: Record<ButtonVariant, string> = {
  primary: semanticClasses.buttonPrimary,
  outline: semanticClasses.buttonOutline,
  ghost: semanticClasses.buttonGhost,
};

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return typeof (props as LinkButtonProps).href !== "undefined";
}

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children } = props;
  const sharedClassName = cn(variantMap[variant], className);

  if (isLinkButton(props)) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={sharedClassName} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={sharedClassName} {...buttonProps}>
      {children}
    </button>
  );
}
