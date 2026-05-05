🧠 Research Data Collection System

🔗 Live Demo: https://estudio-app-silk.vercel.app/

📌 Project Overview

This project is a full-stack web application designed to support structured data collection for quasi-experimental research in educational settings.

The system enables researchers and evaluators to manage participants, create dynamic Likert-scale instruments, and capture pre-test and post-test data in a controlled and consistent manner.

Key features include:

Role-based workflow (Admin and Evaluators)
Participant registration with unique coded identifiers
Dynamic creation of multiple instruments (questionnaires)
Likert-scale data collection (1–4 scale)
Pre-test / Post-test structure
Duplicate submission prevention (per participant, instrument, and test type)
Relational data storage for clean analysis pipelines
CSV export ready for statistical analysis in JASP or spreadsheet tools

The system is optimized for mobile and tablet usage, enabling real-time data collection in field environments.

⚙️ Tech Stack
Next.js (App Router, Client Components)
JavaScript
Supabase (Authentication + PostgreSQL)
PostgreSQL
Tailwind CSS (v3 stable)
Papa Parse (CSV export)
Vercel (Deployment)

🏗️ System Architecture

The application follows a modular structure:

Public Layer
Login page (/)
Authentication handled via Supabase
Protected Panel
Dashboard
Participants management
Instruments (dynamic questionnaire creation)
Test application (pre/post)
Results & CSV export
Database Design (Relational)

Core tables:

participants
questionnaires
questions
responses
response_answers

This structure allows:

Multiple instruments
Scalable question sets
Clean row-based statistical datasets


## Login

![Login and Auth](/img/Login.png)

## Instruments

![Creation tool for Likert Test ](/img/Instruments.png)

## Participanst 

![Form](/img/Participants.png)

## Apply-test 

![Apply Test](/img/Apply-test.png)