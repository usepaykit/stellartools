"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface FullscreenModalProps {

  open: boolean
 
  onOpenChange: (open: boolean) => void

  title: string

  description?: string

  children: React.ReactNode

  footer?: React.ReactNode

  animationConfig?: {
 
    initialScale?: number
 
    stiffness?: number
  
    damping?: number
 
    duration?: number
  }

  contentClassName?: string

  showCloseButton?: boolean
}

/**
 * FullscreenModal - A reusable full-screen modal component with smooth animations
 * 
 * @example
 * ```tsx
 * <FullscreenModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Configure destination"
 *   description="Tell Stripe where to send events..."
 *   footer={<Button>Save</Button>}
 * >
 *   <YourContent />
 * </FullscreenModal>
 * ```
 */
export function FullscreenModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  animationConfig = {},
  contentClassName,
  showCloseButton = false,
}: FullscreenModalProps) {
  const {
    initialScale = 0.8,
    stiffness = 300,
    damping = 30,
    duration = 0.3,
  } = animationConfig

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className={cn(
              "max-w-none w-full h-full max-h-screen m-0 rounded-none p-0 gap-0",
              "sm:max-w-none sm:w-full sm:h-full",
              "!top-0 !left-0 !translate-x-0 !translate-y-0",
              "!grid-rows-none"
            )}
            showCloseButton={showCloseButton}
          >
            <motion.div
              initial={{ scale: initialScale, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: initialScale, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness,
                damping,
                duration,
              }}
              className="w-full h-full flex flex-col bg-background"
            >
              {/* Header */}
              <DialogHeader className="px-6 pt-8 pb-6 border-b shrink-0">
                <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-base mt-2">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Content - Scrollable */}
              <ScrollArea
                className={cn(
                  "flex-1 min-h-0",
                  contentClassName
                )}
              >
                <div className="px-6 py-6">
                  {children}
                </div>
              </ScrollArea>

              {/* Footer - Sticky */}
              {footer && (
                <DialogFooter className="px-6 py-4 border-t bg-background shrink-0 sticky bottom-0 z-10">
                  {footer}
                </DialogFooter>
              )}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

