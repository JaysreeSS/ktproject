# Project KT (Knowledge Transfer) System

A comprehensive web application designed to streamline the knowledge transfer process between teams and individuals. This system facilitates structured handovers, ensuring that critical project information, documentation, and responsibilities are effectively transferred from an **Initiator** (outgoing member) to a **Receiver** (incoming member).

## 🚀 Overview

The **Project Knowledge Transfer & Handover Management System** solves the problem of unstructured and incomplete handovers. It provides a governed framework where Administrators define mandatory sections, Managers oversee project lifecycles, and team members execute structured handover tasks.

### Core Features

*   **Role-Based Access Control**: specialized dashboards for Admins, Managers, Developers, and QA.
*   **Admin Governance**:
    *   **User Management**: Create and manage users with specific roles (Admin, Manager, Dev, QA).
    *   **Template Management**: Define mandatory "Governance Templates" (sections) that every project handover must include. Now supports **File Attachments** for standard templates.
*   **Structured Handovers**:
    *   **Initiators**: Fill out sections, upload proofs/documents, and mark items as "Explained".
    *   **Receivers**: Review content, ask for clarification, and mark items as "Understood".
*   **Dynamic Workflows**: Real-time status tracking (Clarification Needed, Understood, Pending).
*   **Supabase Integration**:
    *   **PostgreSQL**: Persistent storage for Users, Templates, and Project data.
    *   **Object Storage**: Secure file uploads for documents and assets.

## 🛠️ Tech Stack

*   **Frontend**: React (JavaScript) + Vite
*   **Styling**: Tailwind CSS + Shadcn UI (for a premium, glassmorphism aesthetic)
*   **Backend**: Supabase (PostgreSQL Database & Auth)
*   **Storage**: Supabase Storage
*   **Icons**: Lucide React

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/JaysreeSS/ktproject.git
cd ktproject
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Setup Database
Run the SQL scripts provided in `SUPABASE_SETUP.md` in your Supabase SQL Editor to create the necessary tables (`users`, `templates`) and storage buckets.

### 5. Run Locally
```bash
npm run dev
```

## 📝 Usage Guide

*   **Admin Portal**: Access via `/admin` (or login as Admin). Manage the "Blueprint" (sections) and Users.
*   **Manager Dashboard**: Create new projects and assign Initiators/Receivers.
*   **Handover Flow**:
    1.  **Initiator** logs in, selects the project, and fills in the "Governance Sections".
    2.  **Receiver** logs in, reviews the content, and accepts the handover.

## 📄 License

This project is for internal knowledge transfer usage.
