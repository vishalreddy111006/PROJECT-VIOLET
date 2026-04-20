// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate days between dates
export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    accepted: 'success',
    completed: 'success',
    cancelled: 'error',
    active: 'success',
    inactive: 'error',
    'in-progress': 'primary',
  };
  return colors[status] || 'primary';
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const baseClass = 'badge';
  const colorClass = `badge-${getStatusColor(status)}`;
  return `${baseClass} ${colorClass}`;
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// Get file size in readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal
};

// Format distance
export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km}km`;
};

// Get API URL for uploaded files
export const getUploadedFileUrl = (path) => {
  if (!path) return null;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}/${path}`;
};
