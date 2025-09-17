# Nabha HealthConnect – Enhanced Rural Telemedicine Platform

Prototype submission for **Smart India Hackathon 2025** 

---

## 📌 Project Overview
Nabha HealthConnect is a **Progressive Web App (PWA)** prototype designed to bring accessible and reliable healthcare to **173 villages in the Nabha region**.  
The platform aims to address the shortage of doctors in rural hospitals by enabling remote consultations, digital records, and emergency support.  

⚠️ **Note**: This is a **prototype** and not yet fully functional. The current build demonstrates UI, offline readiness, and integration structure.

---

## 🚀 Achievements So Far

### 🌐 Frontend (Prototype UI)
- Responsive **PWA interface** (`index.html`) with:
  - **Hero section** displaying coverage (173 villages, multilingual, offline support).  
  - **Navigation cards** for:
    - 🔍 AI Symptom Checker  <img width="1387" height="682" alt="image" src="https://github.com/user-attachments/assets/06d7a73e-3691-4faf-8c0f-2b8ee7b3eaf8" />

    - 📅 Appointment Booking  <img width="1208" height="802" alt="image" src="https://github.com/user-attachments/assets/f96bc31e-4cee-43f1-89ba-f9a4c1b70b60" />

    - 💊 Medicine Finder  <img width="1209" height="804" alt="image" src="https://github.com/user-attachments/assets/68b70af0-433f-4c01-96fd-fcd3b73eb83b" />

    - 📋 Digital Health Records  <img width="1207" height="804" alt="image" src="https://github.com/user-attachments/assets/19944217-9b83-4af2-b96a-bab72e89fc64" />

    - 💻 Video Consultation  <img width="1247" height="782" alt="image" src="https://github.com/user-attachments/assets/f58e3381-29e8-4d88-a04a-c7c3e772283c" />

    - 🚨 Emergency Services  <img width="1191" height="869" alt="image" src="https://github.com/user-attachments/assets/1df1299a-50e8-4615-b8b8-6f827ca75d91" />

  - Multilingual support: **English, Hindi, Punjabi**.  
  - Offline indicator, chatbot widget, and voice recording placeholder.

### 📲 PWA Features
- `manifest.json` setup with:
  - App metadata, theme colors, splash icons.  
  - Shortcuts for **Emergency, Symptom Checker, Appointments, Video Consult**.  
  - Installable on mobile/desktop with standalone mode.  

### ⚡ Service Worker (Offline-first)
- Implemented advanced caching strategies (`service-worker.js`):
  - **Static, dynamic, API, and image caching**.  
  - **Background sync** for:
    - Appointment bookings  
    - Emergency alerts  
    - Symptom analysis  
  - Offline fallback responses and indicators.  
  - Push notification structure.

### 🔗 Backend API Config (Planned Integration)
- Defined structured API endpoints (`api-config.js`) for:
  - Authentication & user profiles  
  - Doctors, appointments, and health records  
  - Symptom checker & AI endpoints  
  - Pharmacies & medicine stock  
  - Emergency services (contacts, hospitals, ambulance)  
  - Video consultation via **WebRTC** configuration  
- Data models created for **User, Doctor, Appointment, Symptom Analysis, Pharmacy, Health Records**.  

---

## 📂 Project Structure
```
├── index.html                # Main PWA interface
├── manifest.json             # PWA manifest
├── service-worker.js         # Offline caching & background sync
├── api-config.js             # API endpoints & data models
```

---

## ✅ Next Steps
- Implement backend services and database integration.  
- Connect API endpoints to frontend UI.  
- Enable real-time **video consultations**.  
- Finalize **AI-powered symptom analysis** module.  
- Secure authentication & role-based access (patient, doctor, admin).  
- Expand pharmacy/medicine availability integration.  

---

## ⚠️ Disclaimer
This project is currently in **prototype stage** and intended for **demonstration at SIH 2025**.  
It does **not** yet provide actual medical services.  
