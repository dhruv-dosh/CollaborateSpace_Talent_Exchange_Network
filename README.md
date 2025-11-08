# 🌐 CollaborateSpace: Full-Stack Project & Skill Collaboration Platform

## 🧩 Introduction

**CollaborateSpace** is a full-stack web platform built to connect students and developers based on their **technical skills and project interests**.  
It helps students who have an idea but lack a team — and those who have skills but are looking for meaningful projects to join.  

The platform enables users to **create projects, collaborate with others, invite teammates, post requirements, comment, and communicate**, forming a complete ecosystem for student collaboration and innovation.

---

## 🎯 Objective

To create a **centralized collaboration platform** where:
- Students can showcase their projects and invite others with required skills.
- Developers can search for projects that match their expertise and join as contributors.
- Teams can manage projects, handle requirements, and communicate efficiently.

---

## 🌟 Core Features

### 👥 User Management
- **Register & Login:** Secure authentication using unique email credentials.
- **Profile Management:** Each user can maintain their personal details and skill set.

### 💡 Project Management
- **Create Project:** Upload new projects with title, description, and required skills.
- **CRUD Operations:** Edit, update, or delete projects anytime.
- **My Projects Page:** Displays all projects created by the logged-in user.
- **All Projects Page:** Explore all projects made by other users.

### 🧠 Smart Collaboration
- **Skill-Based Search:** Filter and discover projects that match your tech skills.
- **Requirements Section:** Project owners can post requirements for team members (e.g., “Need a React developer”).
- **Comments & Suggestions:** Users can comment on project requirements to discuss details or express interest.
- **Invite via Gmail:** Project owners can directly invite potential team members by entering their Gmail IDs.
- **Message System:** Allows users to send messages or suggestions on project pages for collaboration.

### 📂 Requirements Section
- Displays all open team member requirements across the platform.
- Users can respond to open requirements or post new ones inside their own projects.

### 🗂 Project Structure

| Section | Description |
|----------|--------------|
| **All Projects** | Displays every project uploaded by users. |
| **My Projects** | Shows user’s own projects with CRUD features. |
| **Requirements** | Displays and manages team member needs for each project. |
| **Messages/Comments** | Enables communication between collaborators. |

---

## 🧱 System Architecture

```plaintext
Frontend (ReactJS)  -->  Backend API (Spring Boot REST)  -->  Database (MySQL)
                          ↑
                          |
                      Gmail API (Invitations)
```
## 🛠️ Technology Stack
CollaborateSpace is built as a robust, enterprise-grade full-stack application.

### Frontend:
1.React.js, HTML, CSS, JavaScript. (Intuitive UI built as a Single Page Application (SPA).)
2.Axios. (Efficiently manages asynchronous HTTP requests to the backend.)

### Backend: 
1.Java / Spring Boot. (Core business logic and production-ready RESTful APIs)
2.Spring JPA. (Object-Relational Mapping (ORM) for efficient database interaction)
3.Spring Security / JWT. (Robust authentication, authorization, and secure endpoint access)

### Database:
1.MySQL. (Reliable, structured data storage)

### Tools:
1.Docker / Docker Compose. (Containerization)
2.Jenkins. (Declarative pipeline included in the Deploy branch for automated cloud deployment (e.g., AWS))
3.Postman. (Recommended tool for testing the RESTful endpoints exposed by the Spring Boot backend).

## ⚙️ User Manual (Local Deployment)
The entire application is deployed using Docker Compose, making the setup simple and hassle-free.

### Prerequisites
You must have Docker Desktop installed and running on your system.

### Deployment Steps

1. Clone the repository: Open your terminal or command prompt and clone the project:
```bash
git clone https://github.com/dhruv-dosh/CollaborateSpace.git
cd CollaborateSpace
```
2. Start the Full Stack: Execute this single command. 
It builds the necessary Docker images for the Frontend, Backend, and MySQL database, then starts them all in detached mode (-d):
```bash
docker-compose up --build -d
```
(Wait for all services to initialize. The Spring Boot backend and the database may take a minute or two to fully start.)

3. Access the Application: Once the command completes, the web application is accessible via the frontend port:
Web App (Frontend): http://localhost:5173
REST API (Backend): http://localhost:5054

4. Stopping the Application
To stop and remove the running containers and the network:

```bash
docker-compose down
```


 *For In Depth MySQL DataBase Notes [MySQL](https://github.com/dhruv-dosh/MySQL_Relational_Database_Notes)*
 
 *For In Depth Java Notes [Java_Notes](https://github.com/dhruv-dosh/Java_In_Depth_Notes)*
 
 *For Learning Spring Boot [Spring boot](https://github.com/dhruv-dosh/Spring_Java_Framework)*
 
 *For Learning Docker [Docker](https://github.com/dhruv-dosh/Docker_Notes_And_Commands)*
 
 *For Learning Jenkins [Jenkins](https://github.com/dhruv-dosh/Jenkins_Declarative_Pipeline_Setup)*

*Created and maintained by [dhruv-doshi](https://github.com/dhruv-dosh)*
