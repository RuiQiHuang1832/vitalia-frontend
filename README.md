# Vitalia Frontend – EMR & Appointment Management UI

Vitalia Frontend is a clean, modern **Next.js** application that provides the user interface for the Vitalia health management platform.  
It offers role-based views for **patients**, **providers**, and **admins**, and connects directly to the Vitalia Backend EMR & Appointment System API.

The goal is a simple, professional, and functional UI, not flashy, designed to clearly demonstrate real healthcare workflows and solid full-stack integration.

## Features

Vitalia includes three role-based interfaces, each tailored to realistic clinical workflows.


##  Patient Portal

A streamlined view for patients to manage their information and access their medical records.

### **Features**
- **Login / Authentication**
- **View Profile Information**
- **Update Profile Details**
- **View Upcoming Appointments**
- **See EMR Summary**
  - Visit notes  
  - Vitals  
  - Medications  
  - Allergies  

Designed to mimic typical patient-facing portals in modern health systems.



##  Provider Dashboard

A professional interface for clinicians to manage patients, document visits, and coordinate care.

### **Features**
- **Provider Login**
- **Patient List** (sortable & searchable)
- **Patient Detail Page**
  - Add or update EMR entries:
    - Visit notes
    - Vitals
    - Medications
    - Allergies
- **Appointment Management**
  - View schedule
  - Create, update, cancel appointments

This view demonstrates core EMR workflows from the clinician’s perspective.



##  Admin Console

Lightweight admin tools for managing the platform.

### **Features**
- **Admin Login**
- **Create Providers**
- **Manage All Users**
- Basic system overview (optional)

This role showcases role-based UI gating and administrative flows.



##  Tech Stack

- **Next.js (App Router)**  
- **React**  
- **TypeScript**  
- **Tailwind CSS** 
- **shadcn/ui** 

##  Backend Integration

This frontend communicates directly with the Vitalia Backend:

### Uses:
- `POST /auth/login`  
- `GET /patients/:id`  
- `GET /providers/:id`  
- `GET /appointments`  
- `POST /notes`, `POST /vitals`, etc.  

The UI is intentionally minimal.

##  Pages

### **/login**  
Universal login screen → redirects based on user role.

### **/patient/**
- `/patient/dashboard`
- `/patient/profile`
- `/patient/appointments`
- `/patient/emr`  
  - notes  
  - vitals  
  - meds  
  - allergies  

### **/provider/**
- `/provider/dashboard`
- `/provider/patients`
- `/provider/patients/[id]`
- `/provider/appointments`
- `/provider/notes/create`  

### **/admin/** 
- `/admin/dashboard`
- `/admin/providers`
- `/admin/users`


##  Status

Actively under development.  
Pages will be built gradually as backend endpoints are completed.

Current focus:
- Authentication flow  
- Role-based routing  
- Patient dashboard  
- Provider patient list  


##  Goal

Deliver a **clean, functional, realistic** frontend that demonstrates:

- Full-stack integration  
- Role-based UI logic  
- Real EMR data workflows  
- Clean architecture and production-ready patterns  

This frontend doesn’t aim for animations or perfect UI polish. The focus is clarity, correctness, and professional engineering decisions.



