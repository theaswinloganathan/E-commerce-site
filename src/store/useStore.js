import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { products } from '../lib/mockData'

// Helper to safely get from localStorage
const getLocalStorage = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const saved = localStorage.getItem(key)
    if (!saved || saved === 'undefined' || saved === 'null') return defaultValue
    return JSON.parse(saved)
  } catch (e) {
    console.error('LocalStorage error:', e)
    return defaultValue
  }
}

export const useCartStore = create((set, get) => ({
  items: getLocalStorage('velora-cart', []),
  
  addItem: async (product, size, color, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      )
      
      let newItems
      if (existingItem) {
        newItems = state.items.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...state.items, { id: Math.random().toString(36).substr(2, 9), product, size, color, quantity }]
      }
      
      localStorage.setItem('velora-cart', JSON.stringify(newItems))
      return { items: newItems }
    })

    // Supabase sync (optional background)
    const user = useStore.getState().user
    if (user) {
      supabase.from('cart_items').upsert({ 
        user_id: user.id, product_id: product.id, size, color, quantity 
      }, { onConflict: 'user_id,product_id,size,color' }).then(({ error }) => {
        if (error) console.error('Sync error:', error)
      })
    }
  },

  removeItem: async (id) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id)
      localStorage.setItem('velora-cart', JSON.stringify(newItems))
      return { items: newItems }
    })

    const user = useStore.getState().user
    const item = get().items.find(i => i.id === id)
    if (user && item) {
      await supabase.from('cart_items').delete().match({ user_id: user.id, product_id: item.product.id, size: item.size, color: item.color })
    }
  },

  updateQuantity: async (id, quantity) => {
    set((state) => {
      const newItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      localStorage.setItem('velora-cart', JSON.stringify(newItems))
      return { items: newItems }
    })

    const user = useStore.getState().user
    const item = get().items.find(i => i.id === id)
    if (user && item) {
      await supabase.from('cart_items').update({ quantity }).match({ user_id: user.id, product_id: item.product.id, size: item.size, color: item.color })
    }
  },

  clearCart: async () => {
    localStorage.removeItem('velora-cart')
    set({ items: [] })
    const user = useStore.getState().user
    if (user) await supabase.from('cart_items').delete().eq('user_id', user.id)
  },

  fetchCart: async (userId) => {
    const { data, error } = await supabase.from('cart_items').select('*').eq('user_id', userId)
    if (!error && data) {
      const dbItems = data.map(item => ({
        id: item.id,
        product: products.find(p => p.id === item.product_id),
        size: item.size,
        color: item.color,
        quantity: item.quantity
      })).filter(i => i.product)
      
      set((state) => {
        const combined = [...state.items]
        dbItems.forEach(dbItem => {
          if (!combined.some(li => li.product.id === dbItem.product.id && li.size === dbItem.size && li.color === dbItem.color)) {
            combined.push(dbItem)
          }
        })
        localStorage.setItem('velora-cart', JSON.stringify(combined))
        return { items: combined }
      })
    }
  },
  
  get totalItems() { return get().items.reduce((acc, item) => acc + item.quantity, 0) },
  get subtotal() { return get().items.reduce((acc, item) => acc + (item.product.discount_price || item.product.price) * item.quantity, 0) }
}))

export const useStore = create((set, get) => ({
  wishlist: getLocalStorage('velora-wishlist', []),
  orders: getLocalStorage('velora-orders', []),
  user: getLocalStorage('velora-user', null),
  deliveryLocation: getLocalStorage('velora-delivery-location', null),
  isLoadingOrders: false,
  orderError: null,

  setDeliveryLocation: (location) => {
    set({ deliveryLocation: location })
    localStorage.setItem('velora-delivery-location', JSON.stringify(location))
  },

  toggleWishlist: async (product) => {
    set((state) => {
      const exists = state.wishlist.some(p => p.id === product.id)
      const newList = exists ? state.wishlist.filter(p => p.id !== product.id) : [...state.wishlist, product]
      localStorage.setItem('velora-wishlist', JSON.stringify(newList))
      return { wishlist: newList }
    })
    
    const user = get().user
    if (user) {
      const exists = get().wishlist.some(p => p.id === product.id)
      if (exists) await supabase.from('wishlist').delete().match({ user_id: user.id, product_id: product.id })
      else await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id })
    }
  },

  placeOrder: async (orderData) => {
    const user = get().user
    if (!user) {
      console.error('User not logged in')
      return { success: false, error: 'User not logged in' }
    }

    const newOrder = {
      ...orderData,
      id: orderData.id || `ORD-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: orderData.status || 'Processing',
      trackingSteps: orderData.trackingSteps || ['Order Placed']
    }
    
    // Save to Supabase
    try {
      const { data, error } = await supabase.from('orders').insert({
        user_id: user.id,
        payment_id: newOrder.id, // Using payment_id as found in probe
        total_amount: newOrder.total, // Using total_amount as found in probe
        status: newOrder.status, // Using status as found in probe
        items: newOrder.items,
        shipping_address: newOrder.address, // Using shipping_address as found in probe
        payment_method: newOrder.payment_method,
        // Omitted payment_status and tracking_steps as they don't exist in the current DB schema
      }).select()

      if (error) {
        console.error('Failed to save order to Supabase:', error)
        return { success: false, error: error.message }
      }

      // Update local state only after successful Supabase insert
      set((state) => {
        const newOrders = [newOrder, ...state.orders]
        localStorage.setItem('velora-orders', JSON.stringify(newOrders))
        return { orders: newOrders }
      })

      return { success: true, data }
    } catch (err) {
      console.error('Unexpected error placing order:', err)
      return { success: false, error: err.message }
    }
  },

  fetchOrders: async (userId) => {
    if (!userId) {
      console.warn('fetchOrders called without userId');
      return;
    }
    set({ isLoadingOrders: true, orderError: null })
    console.log('Fetching orders for user:', userId);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Supabase fetchOrders error:', error);
        set({ orderError: error.message })
        return;
      }

      console.log('Orders data received:', data);
      
      if (data) {
        const dbOrders = data.map(o => ({
          id: o.payment_id || o.order_id || o.id,
          date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          total: o.total_amount || o.total,
          status: o.status || o.order_status,
          items: o.items,
          address: o.shipping_address || o.address,
          payment_method: o.payment_method,
          trackingSteps: o.tracking_steps || [o.status || o.order_status]
        }))
        set({ orders: dbOrders, orderError: null })
        localStorage.setItem('velora-orders', JSON.stringify(dbOrders))
      }
    } catch (err) {
      console.error('Unexpected error in fetchOrders:', err);
      set({ orderError: err.message })
    } finally {
      set({ isLoadingOrders: false })
    }
  },

  setUser: (user) => {
    set({ user })
    localStorage.setItem('velora-user', JSON.stringify(user))
    if (user) {
      useCartStore.getState().fetchCart(user.id)
      get().fetchWishlist(user.id)
      get().fetchOrders(user.id)
    } else {
      useCartStore.getState().clearCart()
      set({ wishlist: [], orders: [] })
      localStorage.removeItem('velora-wishlist')
      localStorage.removeItem('velora-orders')
    }
  },

  fetchWishlist: async (userId) => {
    const { data, error } = await supabase.from('wishlist').select('*').eq('user_id', userId)
    if (!error && data) {
      const dbList = data.map(item => products.find(p => p.id === item.product_id)).filter(Boolean)
      set((state) => {
        const combined = [...state.wishlist]
        dbList.forEach(item => { if (!combined.some(p => p.id === item.id)) combined.push(item) })
        localStorage.setItem('velora-wishlist', JSON.stringify(combined))
        return { wishlist: combined }
      })
    }
  }
}))

