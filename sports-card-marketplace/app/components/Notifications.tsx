"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchNotifications() {
      if (session) {
        const response = await fetch("/api/notifications")
        const data = await response.json()
        setNotifications(data.notifications)
      }
    }
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [session])

  return (
    <div className="relative">
      <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {notifications.length}
        </span>
      )}
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {notifications.map((notification: any) => (
              <div key={notification._id} className="px-4 py-2 hover:bg-gray-100">
                <p className="text-sm">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

