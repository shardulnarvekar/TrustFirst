"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink } from "lucide-react"

export default function PaymentRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const res = await fetch(`/api/agreements/${params.agreementId}`)
        if (res.ok) {
          const data = await res.json()
          setPaymentData(data)
          
          // Auto-redirect to UPI on mobile
          if (data.lenderUPI && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            const upiLink = `upi://pay?pa=${data.lenderUPI}&pn=${encodeURIComponent(data.lenderName)}&am=${data.amount}&tn=TrustFirst_Payment&cu=INR`
            window.location.href = upiLink
          }
        } else {
          setError("Agreement not found")
        }
      } catch (err) {
        setError("Failed to load payment details")
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [params.agreementId])

  const handlePayNow = () => {
    if (paymentData?.lenderUPI) {
      const upiLink = `upi://pay?pa=${paymentData.lenderUPI}&pn=${encodeURIComponent(paymentData.lenderName)}&am=${paymentData.amount}&tn=TrustFirst_Payment&cu=INR`
      window.location.href = upiLink
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-lg text-destructive">{error}</p>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">Quick Payment</h1>
        <p className="mb-6 text-muted-foreground">
          Pay {paymentData?.lenderName} via UPI
        </p>

        <div className="mb-6 rounded-xl bg-primary/10 p-6">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-4xl font-bold text-primary">₹{paymentData?.amount}</p>
        </div>

        <Button
          onClick={handlePayNow}
          size="lg"
          className="w-full"
        >
          <ExternalLink className="mr-2 h-5 w-5" />
          Open UPI App
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          This will open your UPI app (GPay, PhonePe, PayTM, etc.)
        </p>
      </div>
    </div>
  )
}
