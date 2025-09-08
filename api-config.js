/**
 * Backend API Configuration for Nabha HealthConnect PWA
 * Defines all API endpoints, data models, and integration patterns
 * for seamless backend communication
 */

// API Configuration
export const API_CONFIG = {
    // Base URLs for different environments
    ENVIRONMENTS: {
        development: 'http://localhost:3000/api/v1',
        staging: 'https://staging-api.nabha-health.gov.in/api/v1',
        production: 'https://api.nabha-health.gov.in/api/v1'
    },
    
    // Current environment (should be set via environment variables)
    CURRENT_ENV: process.env.NODE_ENV || 'development',
    
    // Request timeout settings
    TIMEOUT: {
        default: 10000, // 10 seconds
        upload: 30000,  // 30 seconds for file uploads
        video: 60000    // 60 seconds for video calls
    },
    
    // Retry configuration
    RETRY: {
        attempts: 3,
        delay: 1000, // 1 second
        backoff: 1.5 // exponential backoff multiplier
    },
    
    // Authentication configuration
    AUTH: {
        tokenKey: 'nabha_health_token',
        refreshTokenKey: 'nabha_health_refresh_token',
        tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
    }
};

// API Endpoints Configuration
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        VERIFY: '/auth/verify',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },
    
    // User Management
    USERS: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        PREFERENCES: '/users/preferences',
        VILLAGES: '/users/villages',
        LANGUAGE: '/users/language'
    },
    
    // Healthcare Providers
    DOCTORS: {
        LIST: '/doctors',
        SEARCH: '/doctors/search',
        AVAILABILITY: '/doctors/availability',
        SPECIALIZATIONS: '/doctors/specializations',
        PROFILE: (id) => `/doctors/${id}`,
        REVIEWS: (id) => `/doctors/${id}/reviews`,
        SCHEDULE: (id) => `/doctors/${id}/schedule`
    },
    
    // Appointments
    APPOINTMENTS: {
        BOOK: '/appointments',
        LIST: '/appointments',
        DETAILS: (id) => `/appointments/${id}`,
        UPDATE: (id) => `/appointments/${id}`,
        CANCEL: (id) => `/appointments/${id}/cancel`,
        RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
        CONFIRM: (id) => `/appointments/${id}/confirm`,
        HISTORY: '/appointments/history',
        UPCOMING: '/appointments/upcoming',
        NOTIFICATIONS: '/appointments/notifications'
    },
    
    // Symptom Checker & AI
    SYMPTOMS: {
        ANALYZE: '/symptoms/analyze',
        SYMPTOMS_LIST: '/symptoms/list',
        COMBINATIONS: '/symptoms/combinations',
        FEEDBACK: '/symptoms/feedback',
        HISTORY: '/symptoms/history',
        EXPORT: '/symptoms/export'
    },
    
    // Pharmacies & Medicine
    PHARMACIES: {
        LIST: '/pharmacies',
        SEARCH: '/pharmacies/search',
        NEARBY: '/pharmacies/nearby',
        DETAILS: (id) => `/pharmacies/${id}`,
        STOCK: (id) => `/pharmacies/${id}/stock`,
        HOURS: (id) => `/pharmacies/${id}/hours`
    },
    
    MEDICINES: {
        SEARCH: '/medicines/search',
        DETAILS: (id) => `/medicines/${id}`,
        ALTERNATIVES: (id) => `/medicines/${id}/alternatives`,
        INTERACTIONS: '/medicines/interactions',
        AVAILABILITY: '/medicines/availability'
    },
    
    // Health Records
    RECORDS: {
        LIST: '/records',
        UPLOAD: '/records/upload',
        DOWNLOAD: (id) => `/records/${id}/download`,
        SHARE: (id) => `/records/${id}/share`,
        DELETE: (id) => `/records/${id}`,
        PRESCRIPTIONS: '/records/prescriptions',
        LAB_REPORTS: '/records/lab-reports',
        HISTORY: '/records/history'
    },
    
    // Video Consultations
    VIDEO: {
        START: '/video/start',
        JOIN: (id) => `/video/${id}/join`,
        END: (id) => `/video/${id}/end`,
        TOKEN: (id) => `/video/${id}/token`,
        RECORDING: (id) => `/video/${id}/recording`,
        QUALITY: '/video/quality-test',
        SETTINGS: '/video/settings'
    },
    
    // Emergency Services
    EMERGENCY: {
        ALERT: '/emergency/alert',
        CONTACTS: '/emergency/contacts',
        SERVICES: '/emergency/services',
        HOSPITALS: '/emergency/hospitals',
        AMBULANCE: '/emergency/ambulance',
        LOCATION: '/emergency/location',
        HISTORY: '/emergency/history'
    },
    
    // Analytics & Monitoring
    ANALYTICS: {
        TRACK_EVENT: '/analytics/events',
        PERFORMANCE: '/analytics/performance',
        ERRORS: '/analytics/errors',
        USER_BEHAVIOR: '/analytics/behavior',
        HEALTH_METRICS: '/analytics/health'
    },
    
    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: (id) => `/notifications/${id}/read`,
        PREFERENCES: '/notifications/preferences',
        PUSH_SUBSCRIBE: '/notifications/push/subscribe',
        PUSH_UNSUBSCRIBE: '/notifications/push/unsubscribe'
    },
    
    // File Management
    FILES: {
        UPLOAD: '/files/upload',
        DOWNLOAD: (id) => `/files/${id}`,
        DELETE: (id) => `/files/${id}`,
        THUMBNAIL: (id) => `/files/${id}/thumbnail`,
        METADATA: (id) => `/files/${id}/metadata`
    }
};

// Data Models and Validation Schemas
export const DATA_MODELS = {
    // User Model
    USER: {
        id: 'string',
        name: 'string',
        email: 'string',
        phone: 'string',
        village: 'string',
        age: 'number',
        gender: 'string',
        language: 'string',
        preferences: 'object',
        createdAt: 'date',
        updatedAt: 'date'
    },
    
    // Appointment Model
    APPOINTMENT: {
        id: 'string',
        patientId: 'string',
        doctorId: 'string',
        patientName: 'string',
        phoneNumber: 'string',
        villageName: 'string',
        doctorType: 'string',
        specialization: 'string',
        preferredDate: 'date',
        preferredTime: 'string',
        actualDate: 'date',
        actualTime: 'string',
        reason: 'string',
        status: 'string', // pending, confirmed, completed, cancelled
        type: 'string', // in-person, video, phone
        notes: 'string',
        prescription: 'object',
        followUp: 'object',
        createdAt: 'date',
        updatedAt: 'date'
    },
    
    // Doctor Model
    DOCTOR: {
        id: 'string',
        name: 'string',
        specialization: 'string',
        qualification: 'string',
        experience: 'number',
        hospital: 'string',
        location: 'string',
        phone: 'string',
        email: 'string',
        availability: 'object',
        consultationFee: 'number',
        rating: 'number',
        reviewsCount: 'number',
        languages: 'array',
        profileImage: 'string',
        isAvailable: 'boolean',
        createdAt: 'date',
        updatedAt: 'date'
    },
    
    // Symptom Analysis Model
    SYMPTOM_ANALYSIS: {
        id: 'string',
        userId: 'string',
        symptoms: 'array',
        analysis: 'object',
        confidence: 'number',
        urgency: 'string',
        recommendations: 'array',
        followUpRequired: 'boolean',
        createdAt: 'date'
    },
    
    // Pharmacy Model
    PHARMACY: {
        id: 'string',
        name: 'string',
        address: 'string',
        phone: 'string',
        location: 'object',
        hours: 'object',
        services: 'array',
        isOpen: 'boolean',
        medicines: 'array',
        rating: 'number',
        createdAt: 'date',
        updatedAt: 'date'
    },
    
    // Health Record Model
    HEALTH_RECORD: {
        id: 'string',
        patientId: 'string',
        type: 'string', // prescription, lab-report, scan, etc.
        title: 'string',
        description: 'string',
        doctorName: 'string',
        hospital: 'string',
        date: 'date',
        files: 'array',
        tags: 'array',
        isShared: 'boolean',
        sharedWith: 'array',
        createdAt: 'date',
        updatedAt: 'date'
    }
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

// API Response Formats
export const RESPONSE_FORMATS = {
    SUCCESS: {
        success: true,
        data: null,
        message: '',
        timestamp: new Date().toISOString()
    },
    
    ERROR: {
        success: false,
        error: {
            code: '',
            message: '',
            details: null
        },
        timestamp: new Date().toISOString()
    },
    
    PAGINATED: {
        success: true,
        data: [],
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        },
        timestamp: new Date().toISOString()
    }
};

// WebRTC Configuration for Video Calls
export const WEBRTC_CONFIG = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
            urls: 'turn:turn.nabha-health.gov.in:3478',
            username: 'nabhahealth',
            credential: 'secure_credential'
        }
    ],
    iceCandidatePoolSize: 10
};

// Push Notification Configuration
export const PUSH_CONFIG = {
    publicKey: 'YOUR_VAPID_PUBLIC_KEY_HERE',
    privateKey: 'YOUR_VAPID_PRIVATE_KEY_HERE',
    subject: 'mailto:admin@nabha-health.gov.in'
};

// Database Configuration (for reference)
export const DB_CONFIG = {
    TABLES: {
        users: 'users',
        doctors: 'doctors',
        appointments: 'appointments',
        symptom_analyses: 'symptom_analyses',
        pharmacies: 'pharmacies',
        medicines: 'medicines',
        health_records: 'health_records',
        notifications: 'notifications',
        emergency_alerts: 'emergency_alerts',
        analytics_events: 'analytics_events'
    },
    
    INDEXES: [
        'users_email_idx',
        'users_phone_idx',
        'appointments_patient_date_idx',
        'doctors_specialization_idx',
        'pharmacies_location_idx',
        'health_records_patient_date_idx'
    ]
};

// Error Handling Configuration
export const ERROR_CODES = {
    // Authentication Errors
    AUTH_INVALID_CREDENTIALS: 'AUTH_001',
    AUTH_TOKEN_EXPIRED: 'AUTH_002',
    AUTH_TOKEN_INVALID: 'AUTH_003',
    AUTH_USER_NOT_FOUND: 'AUTH_004',
    
    // Appointment Errors
    APPOINTMENT_SLOT_UNAVAILABLE: 'APPT_001',
    APPOINTMENT_NOT_FOUND: 'APPT_002',
    APPOINTMENT_ALREADY_CANCELLED: 'APPT_003',
    APPOINTMENT_PAST_DATE: 'APPT_004',
    
    // Doctor Errors
    DOCTOR_NOT_AVAILABLE: 'DOC_001',
    DOCTOR_NOT_FOUND: 'DOC_002',
    
    // Pharmacy Errors
    PHARMACY_NOT_FOUND: 'PHAR_001',
    MEDICINE_OUT_OF_STOCK: 'PHAR_002',
    
    // Video Errors
    VIDEO_SESSION_EXPIRED: 'VIDEO_001',
    VIDEO_CONNECTION_FAILED: 'VIDEO_002',
    VIDEO_PERMISSION_DENIED: 'VIDEO_003',
    
    // General Errors
    VALIDATION_ERROR: 'GEN_001',
    NETWORK_ERROR: 'GEN_002',
    SERVER_ERROR: 'GEN_003',
    RATE_LIMIT_EXCEEDED: 'GEN_004'
};

// Security Configuration
export const SECURITY_CONFIG = {
    // CORS settings
    CORS: {
        origin: [
            'https://nabha-health.gov.in',
            'https://www.nabha-health.gov.in',
            'http://localhost:3000'
        ],
        credentials: true,
        optionsSuccessStatus: 200
    },
    
    // Rate limiting
    RATE_LIMITS: {
        login: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
        api: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
        emergency: { windowMs: 60 * 1000, max: 10 } // 10 emergency alerts per minute
    },
    
    // Input validation
    VALIDATION: {
        phone: /^[+]?[1-9][\d\s\-\(\)]{7,15}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        appointmentId: /^APT[0-9]{6}$/,
        patientId: /^[A-Za-z0-9]{4,20}$/
    }
};

// Internationalization Configuration
export const I18N_CONFIG = {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'hi', 'pa'],
    fallbackLanguage: 'en',
    dateFormat: {
        en: 'MM/DD/YYYY',
        hi: 'DD/MM/YYYY',
        pa: 'DD/MM/YYYY'
    },
    timeFormat: {
        en: '12', // 12-hour format
        hi: '24', // 24-hour format
        pa: '12'  // 12-hour format
    }
};

// Caching Strategy Configuration
export const CACHE_CONFIG = {
    // Cache durations in milliseconds
    DURATIONS: {
        static: 24 * 60 * 60 * 1000, // 24 hours
        api: 5 * 60 * 1000, // 5 minutes
        images: 7 * 24 * 60 * 60 * 1000, // 7 days
        user_data: 30 * 60 * 1000, // 30 minutes
        doctors: 60 * 60 * 1000, // 1 hour
        pharmacies: 2 * 60 * 60 * 1000 // 2 hours
    },
    
    // Cache keys
    KEYS: {
        user_profile: (userId) => `user_profile_${userId}`,
        doctors_list: 'doctors_list',
        pharmacies_nearby: (lat, lng) => `pharmacies_${lat}_${lng}`,
        appointments: (userId) => `appointments_${userId}`,
        symptom_history: (userId) => `symptoms_${userId}`
    }
};

// Monitoring and Analytics Configuration
export const MONITORING_CONFIG = {
    // Performance metrics to track
    METRICS: [
        'page_load_time',
        'api_response_time',
        'error_rate',
        'user_engagement',
        'feature_usage',
        'offline_usage',
        'video_call_quality'
    ],
    
    // Error tracking
    ERROR_TRACKING: {
        enabled: true,
        endpoint: '/analytics/errors',
        sampleRate: 1.0 // Track all errors
    },
    
    // User analytics
    USER_ANALYTICS: {
        enabled: true,
        endpoint: '/analytics/events',
        batchSize: 10,
        flushInterval: 30000 // 30 seconds
    }
};

// Export default configuration object
export default {
    API_CONFIG,
    API_ENDPOINTS,
    DATA_MODELS,
    HTTP_STATUS,
    RESPONSE_FORMATS,
    WEBRTC_CONFIG,
    PUSH_CONFIG,
    DB_CONFIG,
    ERROR_CODES,
    SECURITY_CONFIG,
    I18N_CONFIG,
    CACHE_CONFIG,
    MONITORING_CONFIG
};

// Utility function to get current API base URL
export const getBaseURL = () => {
    const env = API_CONFIG.CURRENT_ENV;
    return API_CONFIG.ENVIRONMENTS[env] || API_CONFIG.ENVIRONMENTS.development;
};

// Utility function to build full endpoint URL
export const buildURL = (endpoint) => {
    return `${getBaseURL()}${endpoint}`;
};

// Utility function to validate data against model
export const validateData = (data, model) => {
    const errors = [];
    
    for (const [field, type] of Object.entries(model)) {
        if (!(field in data)) {
            errors.push(`Missing required field: ${field}`);
            continue;
        }
        
        const value = data[field];
        const actualType = Array.isArray(value) ? 'array' : 
                          value instanceof Date ? 'date' : 
                          typeof value;
        
        if (actualType !== type) {
            errors.push(`Invalid type for ${field}: expected ${type}, got ${actualType}`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};