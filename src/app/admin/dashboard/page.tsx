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
          <h2 className="font-serif text-2xl text-sage-800">Wedding Admin</h2>
          <p className="text-sm text-gray-600 mt-1">Welcome, {user?.email}</p>
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
                    ? 'bg-champagne-50 text-champagne-700 border-r-2 border-champagne-500'
                    : 'text-gray-600 hover:bg-gray-50'
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
      <h1 className="font-serif text-3xl text-sage-800 mb-8">Dashboard Overview</h1>
      
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
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-sage-800">{stat.value}</p>
                </div>
                <Icon className="text-champagne-500" size={24} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <h2 className="text-xl font-semibold text-sage-800 mb-4">Quick Actions</h2>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-3xl text-sage-800 mb-8">Content Editor</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-600">Content editor functionality will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Edit couple names, wedding date, hero text, and other content dynamically.</p>
      </div>
    </motion.div>
  )
}

// Media Gallery Tab
const MediaGalleryTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-3xl text-sage-800 mb-8">Media Gallery</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-600">Media management functionality will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Upload, edit, and organize photos and videos with drag-and-drop functionality.</p>
      </div>
    </motion.div>
  )
}

// Story Tab
const StoryTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-serif text-3xl text-sage-800 mb-8">Our Story Editor</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-600">Story milestone editor functionality will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Add, edit, and reorder story milestones with photos and descriptions.</p>
      </div>
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
      <h1 className="font-serif text-3xl text-sage-800 mb-8">Wedding Details</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-600">Wedding details editor functionality will be implemented here.</p>
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
      <h1 className="font-serif text-3xl text-sage-800 mb-8">Settings</h1>
      <div className="bg-white rounded-lg p-6 shadow-luxury">
        <p className="text-gray-600">Settings functionality will be implemented here.</p>
        <p className="text-sm text-gray-500 mt-2">Manage admin users, site preferences, and backup settings.</p>
      </div>
    </motion.div>
  )
}