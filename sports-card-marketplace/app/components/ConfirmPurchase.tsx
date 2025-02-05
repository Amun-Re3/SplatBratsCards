"use client"

import { useState } from "react"

interface ConfirmPurchaseProps {
  cardName: string
  price: number
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmPurchase({ cardName, price, onConfirm, onCancel }: ConfirmPurchaseProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = () => {
    setIsConfirming(true)
    onConfirm()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Confirm Purchase</h2>
        <p className="mb-4">
          Are you sure you want to purchase {cardName} for ${price.toFixed(2)}?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isConfirming}
          >
            {isConfirming ? "Processing..." : "Confirm Purchase"}
          </button>
        </div>
      </div>
    </div>
  )
}

