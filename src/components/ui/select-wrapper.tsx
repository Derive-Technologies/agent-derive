'use client'

// This is a wrapper around the Select component to handle React 19 compatibility
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"

// Re-export all components
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

// Create a wrapped version that suppresses ref warnings
export const SafeSelect = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Select>
>((props, _ref) => {
  // Ignore the ref for now until Radix UI updates for React 19
  return <Select {...props} />
})
SafeSelect.displayName = "SafeSelect"

export const SafeSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof SelectTrigger>
>((props, _ref) => {
  // Ignore the ref for now until Radix UI updates for React 19
  return <SelectTrigger {...props} />
})
SafeSelectTrigger.displayName = "SafeSelectTrigger"