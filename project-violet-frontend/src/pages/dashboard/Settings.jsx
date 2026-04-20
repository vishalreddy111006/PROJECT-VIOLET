import { useState } from 'react';
import { FiSave, FiLock, FiBell, FiGlobe, FiShield, FiAlertTriangle } from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Account Settings</h1>
        <p className="text-dark-500 mt-1">Manage your security, notifications, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'general' ? 'bg-primary-50 text-primary-700' : 'text-dark-600 hover:bg-dark-50'
            }`}
          >
            <FiGlobe className="w-5 h-5" /> General
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'security' ? 'bg-primary-50 text-primary-700' : 'text-dark-600 hover:bg-dark-50'
            }`}
          >
            <FiShield className="w-5 h-5" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'notifications' ? 'bg-primary-50 text-primary-700' : 'text-dark-600 hover:bg-dark-50'
            }`}
          >
            <FiBell className="w-5 h-5" /> Notifications
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          
          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark-900 mb-6 flex items-center gap-2">
                  <FiLock className="text-primary-600" /> Change Password
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="input" />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="button" className="btn btn-primary">
                      <FiSave className="w-4 h-4" /> Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="card p-6 border-l-4 border-l-warning">
                <h2 className="text-lg font-bold text-dark-900 mb-2 flex items-center gap-2">
                  <FiAlertTriangle className="text-warning" /> Two-Factor Authentication
                </h2>
                <p className="text-dark-500 text-sm mb-4">Add an extra layer of security to your account by requiring a code from your mobile device when logging in.</p>
                <button className="btn btn-outline border-warning text-warning hover:bg-warning/10">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Language</label>
                  <select className="input appearance-none bg-white">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Timezone</label>
                  <select className="input appearance-none bg-white">
                    <option>Pacific Time (PT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Coordinated Universal Time (UTC)</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="button" className="btn btn-primary">
                    <FiSave className="w-4 h-4" /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark-900 mb-6">Email Notifications</h2>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-dark-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    <div>
                      <p className="font-medium text-dark-900">Booking Updates</p>
                      <p className="text-sm text-dark-500">Get notified when a booking status changes.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-dark-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    <div>
                      <p className="font-medium text-dark-900">Security Alerts</p>
                      <p className="text-sm text-dark-500">Receive alerts about unusual account activity.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
                    <div>
                      <p className="font-medium text-dark-900">Marketing & Promos</p>
                      <p className="text-sm text-dark-500">Receive special offers and newsletter updates.</p>
                    </div>
                  </label>
                </div>

                <div className="pt-8 flex justify-end">
                  <button type="button" className="btn btn-primary">
                    <FiSave className="w-4 h-4" /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;