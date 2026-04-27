import React, { useState } from 'react'
import { MapPin, X, Crosshair, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function LocationModal({ isOpen, onClose }) {
  const [inputVal, setInputVal] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setDeliveryLocation } = useStore()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputVal.trim()) {
      setError('Please enter a pincode or address')
      return
    }

    const val = inputVal.trim()
    // Indian Pincode check
    const isPincode = /^\d{6}$/.test(val)
    
    setIsLoading(true)
    setError('')

    try {
      if (isPincode) {
        const response = await fetch(`https://api.postalpincode.in/pincode/${val}`)
        const data = await response.json()
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0]
          setDeliveryLocation({
            pincode: val,
            city: postOffice.District || postOffice.Block || postOffice.Region || 'Your City'
          })
          setInputVal('')
          onClose()
        } else {
          setError('Invalid Pincode')
        }
      } else {
        // If it's just an address string
        setDeliveryLocation({
          pincode: 'N/A',
          city: val
        })
        setInputVal('')
        onClose()
      }
    } catch (err) {
      setError('Failed to fetch location details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Free Nominatim reverse geocoding API
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`)
          const data = await res.json()
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.state_district || 'Your Location'
            const pincode = data.address.postcode || 'N/A'
            
            setDeliveryLocation({ city, pincode })
            onClose()
          } else {
            setError('Could not resolve your location details')
          }
        } catch (err) {
          setError('Failed to get location from coordinates')
        } finally {
          setIsLoading(false)
        }
      },
      (err) => {
        setError('Location access denied or unavailable')
        setIsLoading(false)
      }
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="p-6 border-b border-brand-100 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-brand-950">Choose your location</h2>
          <button onClick={onClose} className="text-brand-500 hover:text-brand-950 transition-colors disabled:opacity-50" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-brand-600 mb-6">
            Delivery options and delivery speeds may vary for different locations
          </p>
          
          <button 
            onClick={handleUseCurrentLocation}
            disabled={isLoading}
            className="w-full flex items-center gap-3 p-4 border border-brand-200 rounded-sm hover:bg-brand-50 hover:border-brand-300 transition-colors mb-6 text-brand-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="text-brand-600 animate-spin" /> : <Crosshair size={18} className="text-brand-600" />}
            {isLoading ? 'Locating...' : 'Use current location'}
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-brand-100"></div>
            <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">or enter manually</span>
            <div className="h-px flex-1 bg-brand-100"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Enter a 6-digit pincode or address"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-brand-50 border border-brand-200 rounded-sm focus:border-brand-900 focus:ring-1 focus:ring-brand-900 outline-none transition-all disabled:opacity-50"
              />
            </div>
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            
            <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 mt-4 disabled:opacity-70 flex items-center justify-center">
              {isLoading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              {isLoading ? 'Applying...' : 'Apply'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
