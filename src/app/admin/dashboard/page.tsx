'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Image as ImageIcon, 
  FileText, 
  Heart, 
  Calendar, 
  Settings, 
  LogOut,
  Upload,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface AdminUser {
  id: string
  email: string
  role: string
}

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'content', label: 'Content Editor', icon: FileText },
  { id: 'media', label: 'Media Gallery', icon: ImageIcon },
  { id: 'story', label: 'Our Story', icon: Heart },
  { id: 'details', label: 'Wedding Details', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        router.push('/admin')
        return
      }

      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.data.user)
        } else {
          localStorage.removeItem('adminToken')
          router.push('/admin')
        }
      } catch (error) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  const previewSite = () => {
    window.open('/', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-serif text-2xl text-black">Wedding Admin</h2>
          <p className="text-sm text-gray-800 mt-1">Welcome, {user?.email}</p>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-champagne-50 text-black border-r-2 border-champagne-500'
                    : 'text-black hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Button
            variant="outline-luxury"
            onClick={previewSite}
            className="w-full text-sm"
          >
            <Eye size={16} className="mr-2" />
            Preview Site
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(true)}
            className="w-full text-sm"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <DashboardContent activeTab={activeTab} />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex space-x-4 justify-end">
          <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="luxury" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Modal>
    </div>
  )
}

// Dashboard Content Component
const DashboardContent: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  switch (activeTab) {
    case 'overview':
      return <OverviewTab />
    case 'content':
      return <ContentEditorTab />
    case 'media':
      return <MediaGalleryTab />
    case 'story':
      return <StoryTab />
    case 'details':
      return <DetailsTab />
    case 'settings':
      return <SettingsTab />
    default:
      return <OverviewTab />
  }
}

// Overview Tab
const OverviewTab: React.FC = () => {
  const stats = [
    { label: 'Total Photos', value: '24', icon: ImageIcon },
    { label: 'Story Milestones', value: '4', icon: Heart },
    { label: 'Page Views', value: '1,247', icon: Eye },
    { label: 'RSVP Responses', value: '89', icon: Calendar },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-3xl text-black mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-luxury"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-800">{stat.label}</p>
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                </div>
                <Icon className="text-champagne-500" size={24} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <h2 className="text-xl font-semibold text-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="luxury" className="justify-start">
            <Upload size={16} className="mr-2" />
            Upload New Photos
          </Button>
          <Button variant="outline-luxury" className="justify-start">
            <Edit size={16} className="mr-2" />
            Edit Story Content
          </Button>
          <Button variant="outline-luxury" className="justify-start">
            <Calendar size={16} className="mr-2" />
            Update Wedding Details
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// Content Editor Tab
const ContentEditorTab: React.FC = () => {
  const [contentData, setContentData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Transform data into sections for easier editing
        const sections: any = {}
        data.data.forEach((item: any) => {
          if (!sections[item.section]) {
            sections[item.section] = {}
          }
          // Handle content_value - it might be a string or already parsed JSON
          let contentValue = item.content_value
          try {
            // Try to parse as JSON if it's a string
            if (typeof contentValue === 'string') {
              contentValue = JSON.parse(contentValue)
            }
          } catch (e) {
            // If parsing fails, use the original string value
            contentValue = item.content_value
          }
          sections[item.section][item.content_key] = contentValue
        })
        setContentData(sections)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContentChange = (section: string, key: string, value: any) => {
    setContentData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const saveContent = async (section: string, key: string, value: any) => {
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section,
          content_key: key,
          content_value: value
        })
      })

      if (response.ok) {
        setMessage('Content saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-black">Content Editor</h1>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {message}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg p-6 shadow-luxury">
          <h2 className="text-xl font-semibold text-black mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Bride Name</label>
              <input
                type="text"
                value={contentData.hero?.couple_names?.bride || ''}
                onChange={(e) => {
                  const newValue = {
                    ...contentData.hero?.couple_names,
                    bride: e.target.value
                  }
                  handleContentChange('hero', 'couple_names', newValue)
                }}
                onBlur={() => saveContent('hero', 'couple_names', contentData.hero?.couple_names)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Groom Name</label>
              <input
                type="text"
                value={contentData.hero?.couple_names?.groom || ''}
                onChange={(e) => {
                  const newValue = {
                    ...contentData.hero?.couple_names,
                    groom: e.target.value
                  }
                  handleContentChange('hero', 'couple_names', newValue)
                }}
                onBlur={() => saveContent('hero', 'couple_names', contentData.hero?.couple_names)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Wedding Date</label>
              <input
                type="date"
                value={contentData.hero?.wedding_date?.date || ''}
                onChange={(e) => {
                  const newValue = {
                    ...contentData.hero?.wedding_date,
                    date: e.target.value,
                    display: new Date(e.target.value).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  }
                  handleContentChange('hero', 'wedding_date', newValue)
                }}
                onBlur={() => saveContent('hero', 'wedding_date', contentData.hero?.wedding_date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
            <div>
                            <label className="block text-sm font-medium text-black mb-2">Hero Title</label>
              <input
                type="text"
                value={contentData.hero?.hero_text?.title || ''}
                onChange={(e) => {
                  const newValue = {
                    ...contentData.hero?.hero_text,
                    title: e.target.value
                  }
                  handleContentChange('hero', 'hero_text', newValue)
                }}
                onBlur={() => saveContent('hero', 'hero_text', contentData.hero?.hero_text)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Hero Subtitle</label>
              <textarea
                value={contentData.hero?.hero_text?.subtitle || ''}
                onChange={(e) => {
                  const newValue = {
                    ...contentData.hero?.hero_text,
                    subtitle: e.target.value
                  }
                  handleContentChange('hero', 'hero_text', newValue)
                }}
                onBlur={() => saveContent('hero', 'hero_text', contentData.hero?.hero_text)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
          </div>
        </div>

        {/* Venue Section */}
        <div className="bg-white rounded-lg p-6 shadow-luxury">
          <h2 className="text-xl font-semibold text-black mb-4">Venue Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ceremony */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Ceremony</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={contentData.venue?.ceremony?.name || ''}
                    onChange={(e) => {
                      const newValue = {
                        ...contentData.venue?.ceremony,
                        name: e.target.value
                      }
                      handleContentChange('venue', 'ceremony', newValue)
                    }}
                    onBlur={() => saveContent('venue', 'ceremony', contentData.venue?.ceremony)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Address</label>
                  <textarea
                    value={contentData.venue?.ceremony?.address || ''}
                    onChange={(e) => {
                      const newValue = {
                        ...contentData.venue?.ceremony,
                        address: e.target.value
                      }
                      handleContentChange('venue', 'ceremony', newValue)
                    }}
                    onBlur={() => saveContent('venue', 'ceremony', contentData.venue?.ceremony)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Time</label>
                  <input
                    type="time"
                    value={contentData.venue?.ceremony?.time || ''}
                    onChange={(e) => {
                      const newValue = {
                        ...contentData.venue?.ceremony,
                        time: e.target.value
                      }
                      handleContentChange('venue', 'ceremony', newValue)
                    }}
                    onBlur={() => saveContent('venue', 'ceremony', contentData.venue?.ceremony)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Reception */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Reception</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={contentData.venue?.reception?.name || ''}
                    onChange={(e) => {
                      const newValue = {
                        ...contentData.venue?.reception,
                        name: e.target.value
                      }
                      handleContentChange('venue', 'reception', newValue)
                    }}
                    onBlur={() => saveContent('venue', 'reception', contentData.venue?.reception)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Address</label>
                  <textarea
                    value={contentData.venue?.reception?.address || ''}
                    onChange={(e) => {
                      const newValue = {
                        ...contentData.venue?.reception,
                        address: e.target.value
                      }
                      handleContentChange('venue', 'reception', newValue)
                    }}
                    onBlur={() => saveContent('venue', 'reception', contentData.venue?.reception)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Time</label>
                  <input
                    type="time"
                    value={contentData.venue?.reception?.time || ''}
                    onChange={(e) => {
                      const newValue = {
                        ...contentData.venue?.reception,
                        time: e.target.value
                      }
                      handleContentChange('venue', 'reception', newValue)
                    }}
                    onBlur={() => saveContent('venue', 'reception', contentData.venue?.reception)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Media Gallery Tab
const MediaGalleryTab: React.FC = () => {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/media', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setImages(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('category', 'gallery')

      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        fetchImages() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-black">Media Gallery</h1>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
          <Button variant="luxury" disabled={uploading}>
            <Upload size={16} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </label>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-luxury">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne-500"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-800 text-lg">No images uploaded yet</p>
            <p className="text-sm text-gray-500 mt-2">Upload your first wedding photo to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.alt_text || 'Wedding photo'}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      // Implement delete functionality
                      if (confirm('Delete this image?')) {
                        // Delete image logic here
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Story Tab
const StoryTab: React.FC = () => {
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    image_url: '',
    sort_order: 0
  })

  useEffect(() => {
    fetchMilestones()
  }, [])

  const fetchMilestones = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/story', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const method = editingMilestone ? 'PUT' : 'POST'
      const body = editingMilestone 
        ? { id: editingMilestone.id, ...formData }
        : formData

      const response = await fetch('/api/story', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchMilestones()
        setShowAddModal(false)
        setEditingMilestone(null)
        setFormData({ title: '', description: '', date: '', image_url: '', sort_order: 0 })
      }
    } catch (error) {
      console.error('Failed to save milestone:', error)
    }
  }

  const deleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/story?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchMilestones()
      }
    } catch (error) {
      console.error('Failed to delete milestone:', error)
    }
  }

  const startEdit = (milestone: any) => {
    setEditingMilestone(milestone)
    setFormData({
      title: milestone.title,
      description: milestone.description,
      date: milestone.date,
      image_url: milestone.image_url || '',
      sort_order: milestone.sort_order
    })
    setShowAddModal(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-black">Our Story Editor</h1>
        <Button 
          variant="luxury" 
          onClick={() => {
            setEditingMilestone(null)
            setFormData({ title: '', description: '', date: '', image_url: '', sort_order: milestones.length + 1 })
            setShowAddModal(true)
          }}
        >
          Add Milestone
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-champagne-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-luxury"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-black">{milestone.title}</h3>
                    <span className="text-sm text-black bg-champagne-50 px-2 py-1 rounded">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">Order: {milestone.sort_order}</span>
                  </div>
                  <p className="text-gray-800 mb-3">{milestone.description}</p>
                  {milestone.image_url && (
                    <img 
                      src={milestone.image_url} 
                      alt={milestone.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(milestone)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMilestone(milestone.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingMilestone(null)
        }}
        title={editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Image URL (optional)</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-champagne-500 text-black"
            />
          </div>
          <div className="flex space-x-4 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="luxury">
              {editingMilestone ? 'Update' : 'Add'} Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}

// Details Tab
const DetailsTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-3xl text-black mb-8">Wedding Details</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-800">Wedding details editor functionality will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Update ceremony and reception details, timeline, and dress code.</p>
      </div>
    </motion.div>
  )
}

// Settings Tab
const SettingsTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-3xl text-black mb-8">Settings</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-800">Settings functionality will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Manage admin users, site preferences, and backup settings.</p>
      </div>
    </motion.div>
  )
}
