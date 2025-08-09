import React from "react"
import { cn } from "../../lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
  children: React.ReactNode
}

const containerSizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none"
}

export function Container({ 
  size = "xl", 
  className, 
  children, 
  ...props 
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Layout wrapper that combines common layout elements
interface MainLayoutProps {
  children: React.ReactNode
  className?: string
  containerSize?: ContainerProps["size"]
}

export function MainLayout({ 
  children, 
  className,
  containerSize = "xl" 
}: MainLayoutProps) {
  return (
    <main className={cn("flex-1 py-6", className)}>
      <Container size={containerSize}>
        {children}
      </Container>
    </main>
  )
}

// Grid layout helpers
interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2", 
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  12: "grid-cols-12"
}

const gridGaps = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8"
}

export function GridLayout({ 
  cols = 2, 
  gap = "md",
  className, 
  children, 
  ...props 
}: GridLayoutProps) {
  return (
    <div
      className={cn(
        "grid",
        gridCols[cols],
        gridGaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Stack layout for vertical spacing
interface StackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const stackSpacing = {
  sm: "space-y-4",
  md: "space-y-6", 
  lg: "space-y-8"
}

export function StackLayout({ 
  spacing = "md",
  className, 
  children, 
  ...props 
}: StackLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        stackSpacing[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Flex layout helpers
interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly"
  gap?: "sm" | "md" | "lg"
  wrap?: boolean
  children: React.ReactNode
}

const flexDirection = {
  row: "flex-row",
  col: "flex-col"
}

const flexAlign = {
  start: "items-start",
  center: "items-center", 
  end: "items-end",
  stretch: "items-stretch"
}

const flexJustify = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end", 
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
}

const flexGaps = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6"
}

export function FlexLayout({ 
  direction = "row",
  align = "start",
  justify = "start",
  gap = "md",
  wrap = false,
  className, 
  children, 
  ...props 
}: FlexLayoutProps) {
  return (
    <div
      className={cn(
        "flex",
        flexDirection[direction],
        flexAlign[align],
        flexJustify[justify],
        flexGaps[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Responsive layout that stacks on mobile
interface ResponsiveLayoutProps {
  sidebar: React.ReactNode
  main: React.ReactNode
  sidebarWidth?: "sm" | "md" | "lg"
  className?: string
}

const sidebarWidths = {
  sm: "md:w-64",
  md: "md:w-80", 
  lg: "md:w-96"
}

export function ResponsiveLayout({ 
  sidebar,
  main,
  sidebarWidth = "md",
  className 
}: ResponsiveLayoutProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-6", className)}>
      <aside className={cn("w-full", sidebarWidths[sidebarWidth])}>
        {sidebar}
      </aside>
      <main className="flex-1 min-w-0">
        {main}
      </main>
    </div>
  )
}

// Dashboard grid layout
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {children}
    </div>
  )
}

// Two column layout with main content and sidebar
export function TwoColumnLayout({ 
  main, 
  sidebar, 
  sidebarPosition = "right",
  className 
}: {
  main: React.ReactNode
  sidebar: React.ReactNode
  sidebarPosition?: "left" | "right"
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {sidebarPosition === "left" && (
        <aside className="lg:col-span-1">
          {sidebar}
        </aside>
      )}
      <main className="lg:col-span-2">
        {main}
      </main>
      {sidebarPosition === "right" && (
        <aside className="lg:col-span-1">
          {sidebar}
        </aside>
      )}
    </div>
  )
}