import React from "react";
import { cn } from "@/lib/utils";

// ---- Heading 1 ----
export function TypographyH1({ children, className, ...props }) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-2xl md:text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

// ---- Heading 2 ----
export function TypographyH2({ children, className, ...props }) {
  return (
    <h2
      className={cn("text-2xl md:text-3xl font-bold tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

// ---- Heading 3 ----
export function TypographyH3({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-lg md:text-2xl font-bold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

// ---- Heading 4 ----
export function TypographyH4({ children, className, ...props }) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

// ---- Heading 5 ----
export function TypographyH5({ children, className, ...props }) {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h5>
  );
}

// ---- Paragraph ----
export function TypographyP({ children, className, ...props }) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    >
      {children}
    </p>
  );
}

// ---- Blockquote ----
export function TypographyBlockquote({ children, className, ...props }) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    >
      {children}
    </blockquote>
  );
}

// ---- Inline Code ----
export function TypographyInlineCode({ children, className, ...props }) {
  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

// ---- Lead Paragraph ----
export function TypographyLead({ children, className, ...props }) {
  return (
    <p className={cn("text-muted-foreground text-xl", className)} {...props}>
      {children}
    </p>
  );
}

// ---- Large Text ----
export function TypographyLarge({ children, className, ...props }) {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </div>
  );
}

// ---- Small Text ----
export function TypographySmall({ children, className, ...props }) {
  return (
    <small
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    >
      {children}
    </small>
  );
}

// ---- Muted Text ----
export function TypographyMuted({ children, className, ...props }) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props}>
      {children}
    </p>
  );
}
