<div align="center">
  <img src="https://i.imgur.com/gL5g5rW.png" alt="NexusShare Logo" width="120"/>
  <h1>NexusShare</h1>
  <p>A secure, real-time file sharing and collaboration platform.</p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io">
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  </p>
</div>

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## About The Project

NexusShare is a full-stack MERN application designed to solve the challenges of modern file management. It provides a secure, centralized platform for users to upload, organize, and share files with real-time notifications, making collaboration seamless and efficient.

This project moves beyond simple cloud storage, offering advanced features like version control and password-protected public links, all wrapped in a clean, responsive user interface.

---

## Key Features

- **⚡ Real-Time Notifications:** Powered by Socket.io for instant updates on file shares.
- **🔐 Secure Authentication:** JWT-based system to keep user data safe.
- **📁 Drag & Drop Interface:** Modern, intuitive UI for easy file uploads.
- **🔗 Advanced Sharing Options:** Create public links with optional passwords and expiration dates.
- **🕰️ Version History:** Automatically saves previous versions of files, so you never lose your work.
- **📱 Responsive Design:** Fully accessible and functional on all devices, from desktop to mobile.
- **🔍 Powerful Search:** Quickly locate files and folders within your personal library.

---

## Built With

This project leverages a modern and powerful stack of technologies:

* **Frontend:**
    * React.js
    * Tailwind CSS
* **Backend:**
    * Node.js
    * Express.js
* **Database:**
    * MongoDB with Mongoose
* **Real-Time Engine:**
    * Socket.io
* **Authentication:**
    * JSON Web Tokens (JWT)
    * bcryptjs

---

## Getting Started

To get a local instance of NexusShare up and running, please follow these steps.

### Prerequisites

Ensure you have the following software installed on your machine:
* Node.js (v14.x or newer)
* npm (v6.x or newer)
* MongoDB (running locally or via a service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository to your local machine:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/nexus-share.git](https://github.com/YOUR_USERNAME/nexus-share.git)
    cd nexus-share
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Create a `.env` file in the `backend` directory** and populate it with your environment variables:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Install frontend dependencies:**
    ```bash
    cd ..
    npm install
    ```

5.  **Run the application:**
    You will need two separate terminal sessions to run both the frontend and backend servers concurrently.

    * **Terminal 1: Start the Backend Server**
        ```bash
        cd backend
        npm run dev
        ```

    * **Terminal 2: Start the Frontend Client**
        ```bash
        # From the project's root directory
        npm run dev
        ```

    Your application should now be accessible at `http://localhost:5173`.

---

## Roadmap

Here are some of the exciting features planned for the future of NexusShare:

-   [ ] **Team Workspaces:** Dedicated collaborative spaces for teams.
-   [ ] **In-App Commenting:** Allow users to comment directly on files.
-   [ ] **Advanced Analytics:** Provide insights into file usage and storage.
-   [ ] **Third-Party Integrations:** Connect with services like Slack and Google Drive.
-   [ ] **Desktop & Mobile Apps:** Native applications for a more integrated experience.

See the [open issues](https://github.com/Ysaiguggilla2004/NexusShare/issues) for a full list of proposed features (and known issues).

---

## Contributing

Contributions are welcome and greatly appreciated! They are the foundation of the open-source community.

If you have a suggestion that would make this project better, please fork the repository and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## Contact

Sai Guggila - guggillaprakash161@gmail.com


