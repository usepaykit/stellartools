"use client"

import React, { useState } from 'react'
import { FullscreenModal } from '@/components/fullscreen-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebhooksModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WEBHOOK_EVENTS = [
  { id: 'customer_created', label: 'Customer Created' },
  { id: 'invoice_created', label: 'Invoice Created' },
  { id: 'payment_succeded', label: 'Payment Succeeded' },
  { id: 'payment_failed', label: 'Payment Failed' },
] as const

export type WebhookEvent = typeof WEBHOOK_EVENTS[number]['id']

export function WebHooksModal({ open, onOpenChange }: WebhooksModalProps) {
  const [destinationName, setDestinationName] = useState('exquisite-legacy')
  const [endpointUrl, setEndpointUrl] = useState('https://')
  const [description, setDescription] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<Set<WebhookEvent>>(new Set())

  const generateDestinationName = () => {
    const adjectives = ['exquisite', 'elegant', 'smooth', 'bright', 'swift', 'bold', 'calm', 'keen']
    const nouns = ['legacy', 'stream', 'pulse', 'wave', 'spark', 'glow', 'edge', 'peak']
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    setDestinationName(`${randomAdj}-${randomNoun}`)
  }

  const handleEventToggle = (eventId: WebhookEvent) => {
    const newSelected = new Set(selectedEvents)
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId)
    } else {
      newSelected.add(eventId)
    }
    setSelectedEvents(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedEvents.size === WEBHOOK_EVENTS.length) {
      setSelectedEvents(new Set())
    } else {
      setSelectedEvents(new Set(WEBHOOK_EVENTS.map(e => e.id)))
    }
  }

  const handleCreateDestination = () => {
    console.log('Create destination', {
      destinationName,
      endpointUrl,
      description,
      events: Array.from(selectedEvents),
    })
    onOpenChange(false)
  }

  const footer = (
    <div className="flex w-full justify-between">
      <Button
        type="button"
        variant="ghost"
        onClick={() => onOpenChange(false)}
        className="text-muted-foreground hover:text-foreground"
      >
        Cancel
      </Button>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleCreateDestination}
          className="gap-2"
          disabled={selectedEvents.size === 0}
        >
          Create destination
        </Button>
      </div>
    </div>
  )

  return (
    <FullscreenModal
      open={open}
      onOpenChange={onOpenChange}
      title="Configure destination"
      description="Tell Stripe where to send events and give your destination a helpful description."
      footer={footer}
    >
      <div className="space-y-8">
        {/* Read-only Info Section */}
        <div className="space-y-3 p-4 rounded-lg border border-transparent bg-transparent">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Events from:</span>
              <span className="ml-2 font-medium">Your account</span>
            </div>
            <div>
              <span className="text-muted-foreground">Payload style:</span>
              <span className="ml-2 font-medium">Thin</span>
            </div>
            <div>
              <span className="text-muted-foreground">API version:</span>
              <span className="ml-2 font-medium">Unversioned</span>
            </div>
    <div>
              <span className="text-muted-foreground">Listening to:</span>
              <span className="ml-2 font-medium font-mono text-xs">
                v2.core.account_link.returned
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6 max-w-2xl">
          {/* Destination Name */}
          <div className="space-y-2">
            <Label htmlFor="destination-name">Destination name</Label>
            <div className="flex gap-2">
              <Input
                id="destination-name"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="flex-1 shadow-none"
              />
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={generateDestinationName}
                className="gap-2 shadow-none"
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>

          {/* Endpoint URL */}
          <div className="space-y-2">
            <Label htmlFor="endpoint-url">Endpoint URL</Label>
            <p className="text-sm text-muted-foreground">
              Webhooks require a URL to send events to.
            </p>
            <Input
              id="endpoint-url"
              type="url"
              value={endpointUrl}
              className="shadow-none"
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder="https://"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
      
              onChange={(e) => setDescription(e.target.value)}
              placeholder="An optional description of the destination..."
              className="min-h-24 resize-y shadow-none"
            />
          </div>

          {/* Events Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Events</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-auto py-1 px-2 text-xs shadow-none"
              >
                {selectedEvents.size === WEBHOOK_EVENTS.length ? 'Deselect all' : 'Select all'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose which events this webhook should listen to.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WEBHOOK_EVENTS.map((event) => {
                const isChecked = selectedEvents.has(event.id)
                return (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                      "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isChecked
                        ? "bg-primary/5 border-primary/30 "
                        : "bg-background border-border hover:bg-muted/30"
                    )}
                    onClick={() => handleEventToggle(event.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleEventToggle(event.id)
                      }
                    }}
                  >
                    <Checkbox
                      id={event.id}
                      checked={isChecked}
                      onCheckedChange={() => handleEventToggle(event.id)}
                      className="pointer-events-none"
                    />
                    <Label
                      htmlFor={event.id}
                      className="text-sm font-medium cursor-pointer flex-1 select-none"
                      onClick={(e) => e.preventDefault()}
                    >
                      {event.label}
                    </Label>
                  </div>
                )
              })}
            </div>
            {selectedEvents.size === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Please select at least one event to continue.
              </p>
            )}
          </div>
        </div>
    </div>
    </FullscreenModal>
  )
}

export default WebHooksModal
