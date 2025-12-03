"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, MessageSquare, Check } from "lucide-react"

interface FeedbackPopupProps {
  visible: boolean
  onClose: () => void
}

export function FeedbackPopup({ visible, onClose }: FeedbackPopupProps) {
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!visible) return null

  const handleSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFeedback("")
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <MessageSquare className="w-4 h-4" />
          Feedback
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {submitted ? (
        <div className="p-8 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-foreground font-medium">Thanks for your feedback!</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <Textarea
            placeholder="Tell us what you think..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmit} className="w-full" disabled={!feedback.trim()}>
            Submit Feedback
          </Button>
        </div>
      )}
    </div>
  )
}
