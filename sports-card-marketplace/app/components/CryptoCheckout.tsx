"use client"

import { useState } from "react"
import QRCode from "qrcode.react"

const cryptoOptions = [
  { name: "Bitcoin", symbol: "BTC", address: "your-btc-address" },
  { name: "Ethereum", symbol: "ETH", address: "your-eth-address" },
  { name: "Solana", symbol: "SOL", address: "your-sol-address" },
  { name: "XRP", symbol: "XRP", address: "your-xrp-address" },
]

export default function CryptoCheckout({ amount }: { amount: number }) {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[0])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pay with Cryptocurrency</h2>
      <div className="mb-4">
        <label htmlFor="crypto-select" className="block mb-2">
          Select Cryptocurrency:
        </label>
        <select
          id="crypto-select"
          value={selectedCrypto.symbol}
          onChange={(e) => setSelectedCrypto(cryptoOptions.find((c) => c.symbol === e.target.value)!)}
          className="w-full px-3 py-2 border rounded"
        >
          {cryptoOptions.map((crypto) => (
            <option key={crypto.symbol} value={crypto.symbol}>
              {crypto.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <p>Amount to pay: {amount} USD</p>
        <p>Send {selectedCrypto.name} to this address:</p>
        <p className="font-mono break-all">{selectedCrypto.address}</p>
      </div>
      <div className="mb-4">
        <QRCode value={selectedCrypto.address} size={200} />
      </div>
      <p className="text-sm text-gray-600">
        Please send the equivalent amount in {selectedCrypto.name}. The exchange rate will be calculated at the time of
        transaction.
      </p>
    </div>
  )
}

