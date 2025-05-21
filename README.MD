# CSIT314 Scrumbags

This is a GitHub monorepo containing the code for our CSIT314 Group Project.

## 📂 Project Contributors

- 🧑‍💻 [Rohit Panda](https://www.linkedin.com/in/rohit-panda/)
- 🧑‍💻 [Alexander Neo](https://www.linkedin.com/in/alexanderneo427/)
- 🧑‍💻 [Ryan Hong Yang Tan](https://www.linkedin.com/in/ryantan012/)
- 🧑‍💻 [Rong Xiang Ng](https://www.linkedin.com/in/rong-xiang-ng-632079201/)
- 🧑‍💻 [Asher Tan Jing Kai](https://www.linkedin.com/in/asher-tan-jing-kai/)
- 🧑‍💻 [Muhammad Zafiq bin Abdul](https://www.linkedin.com/in/muhd-zafiq-8821b9276/)
- 🧑‍💻 [Aloysius Lee Cheng Long](https://www.linkedin.com/in/your-linkedin-username/)

## 📂 Project Resources

### 📹 Video Demo

[![Watch the Video Demo](https://img.youtube.com/vi/Xr3Xc3_fczg/0.jpg)](https://youtu.be/Xr3Xc3_fczg)

> 🔗 [Click to watch on YouTube](https://youtu.be/Xr3Xc3_fczg) (14:53)

---

### 📝 Documentation
- 📄 Project Specification (PDF)](./Project%20Specification.pdf)

- 📄 [Final Report (View Only)](https://uowmailedu-my.sharepoint.com/:w:/g/personal/rp863_uowmail_edu_au/EdY5kNCVEQ1FtZA6aJTfvo4B3Ubx6rt6mFJBU8SGydW3Aw?e=dDEViz)

---

### 📊 Project Planning

- 📅 [Gantt Chart (Google Sheets)](https://docs.google.com/spreadsheets/d/1SJM-ADDR-Ly5h_FfYFsgKHPNKgxdTiRJYzL-ZkaZfgg/edit?usp=sharing)
- 📋 [Taiga Backlog & Sprint Board](https://tree.taiga.io/project/roh00t-scrumbags/backlog)

---

### 💻 Source Code

- [GitHub Repository](https://github.com/Roh00t/CSIT314ScrumBags)

## Setting Up

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Roh00t/CSIT314ScrumBags.git
   cd CSIT314ScrumBags
   ```

# CSIT314 Scrumbags | Backend

### Pre-requisites:

```
Before processing with the following steps, ensure that
* You have 'cd' into the 'backend' directory
* You have 'nodeJS' installed and added to your path
* You have Docker installed and running
```

### Downloaded the repo for the first time?

1. `npm i` to install necessary dependencies for the backend
2. `docker compose up -d` to start the Dockerized PostgreSQL instance (Docker must be running!)
3. `npm run db:push` to update the schema
4. `npm run db:seed` to populate the database with test data

### Running the development environment or tests

`npm run dev` to run the start the development server

### Trouble starting the dev server? Try the following

1. `docker compose down -v` delete the old running Dockerized PostgreSQL instance
2. `docker compose up -d` start a fresh Dockerized PostgreSQL instance
3. `npm run dev` To try starting the dev server again

# CSIT314 Scrumbags | Frontend

### Pre-requisites:

```
Before processing with the following steps, ensure that
* You have 'cd' into the 'frontend' directory.
* You have 'nodeJS' installed and added to your path
```

### Downloaded the repo for the first time?

`npm i` to install the necessary dependencies

### Running the development environment

`npm run dev` to start the dev server
