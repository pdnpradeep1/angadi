// // src/components/Dashboard.js

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import styled, { keyframes } from "styled-components";
// import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// `;

// const DashboardContainer = styled.div`
//   display: flex;
//   height: 100vh;
//   background-color: #f4f4f4;
//   font-family: "Arial", sans-serif;
// `;

// const Sidebar = styled.div`
//   width: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
//   background-color: #2c3e50;
//   color: white;
//   padding: 20px;
//   transition: width 0.3s;
//   overflow: hidden;
//   position: relative;
//   box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
// `;

// const SidebarToggle = styled.div`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   cursor: pointer;
//   color: white;
//   font-size: 1.5rem;
// `;

// const SidebarContent = styled.div`
//   display: ${({ isOpen }) => (isOpen ? "block" : "none")};
//   margin-top: 20px;
// `;

// const MenuItem = styled.li`
//   list-style: none;
//   margin: 15px 0;
//   transition: background 0.3s;

//   &:hover {
//     background-color: #34495e;
//     border-radius: 5px;
//   }

//   a {
//     color: white;
//     text-decoration: none;
//     font-size: 1.1rem;
//     display: block;
//     padding: 10px;
//   }
// `;

// const MainContent = styled.div`
//   flex: 1;
//   padding: 20px;
//   animation: ${fadeIn} 0.5s ease-in-out;
// `;

// const TopNav = styled.nav`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   background-color: #2980b9;
//   color: white;
//   padding: 15px 20px;
//   border-radius: 8px;
//   margin-bottom: 20px;
// `;

// const UserIcon = styled.div`
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   font-size: 1.1rem;

//   &:hover {
//     opacity: 0.8;
//   }
// `;

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const handleLogout = () => {
//     // Implement your logout logic here
//     navigate("/login");
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prevState) => !prevState);
//   };

//   return (
//     <DashboardContainer>
//       <Sidebar isOpen={isSidebarOpen}>
//         <SidebarToggle onClick={toggleSidebar}>
//           {isSidebarOpen ? <FaTimes /> : <FaBars />}
//         </SidebarToggle>
//         <SidebarContent isOpen={isSidebarOpen}>
//           <h2>Dashboard</h2>
//           <ul>
//             <MenuItem>
//               <Link to="/dashboard">Home</Link>
//             </MenuItem>
//             <MenuItem>
//               <Link to="/dashboard/settings">Settings</Link>
//             </MenuItem>
//             <MenuItem>
//               <Link to="/dashboard/profile">Profile</Link>
//             </MenuItem>
//           </ul>
//         </SidebarContent>
//       </Sidebar>
//       <MainContent>
//         <TopNav>
//           <h1>MyShop Dashboard</h1>
//           <UserIcon onClick={handleLogout}>
//             <FaUserCircle /> Logout
//           </UserIcon>
//         </TopNav>
//         <div>
//           <h2>Welcome to the Dashboard</h2>
//           <p>This is the main content area.</p>
//         </div>
//       </MainContent>
//     </DashboardContainer>
//   );
// };

// export default Dashboard;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars, FaTimes, FaUserCircle, FaHome, FaCog, FaUser, FaChartBar, FaShoppingCart } from "react-icons/fa";
// import "../styles/dashboard.css"; // Import custom CSS

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const handleLogout = () => {
//     navigate("/login");
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className={`dashboard-sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
//         <button onClick={toggleSidebar} className="toggle-button">
//           {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//         </button>

//         <h2 className={isSidebarOpen ? "" : "hidden"}>Dashboard</h2>

//         <ul>
//           <li>
//             <FaHome size={20} />
//             {isSidebarOpen && <Link to="/dashboard">Home</Link>}
//           </li>
//           <li>
//             <FaChartBar size={20} />
//             {isSidebarOpen && <Link to="/dashboard/stats">Statistics</Link>}
//           </li>
//           <li>
//             <FaShoppingCart size={20} />
//             {isSidebarOpen && <Link to="/dashboard/orders">Orders</Link>}
//           </li>
//           <li>
//             <FaCog size={20} />
//             {isSidebarOpen && <Link to="/dashboard/settings">Settings</Link>}
//           </li>
//           <li>
//             <FaUser size={20} />
//             {isSidebarOpen && <Link to="/dashboard/profile">Profile</Link>}
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="dashboard-content">
//         <div className="dashboard-topnav">
//           <h1>MyShop Dashboard</h1>
//           <button onClick={handleLogout} className="logout-button">
//             <FaUserCircle /> Logout
//           </button>
//         </div>

//         {/* Dashboard Cards */}
//         <div className="dashboard-cards">
//           <div className="dashboard-card">
//             <h3>Total Sales</h3>
//             <p className="text-green-500">$12,345</p>
//           </div>
//           <div className="dashboard-card">
//             <h3>New Users</h3>
//             <p className="text-blue-500">120</p>
//           </div>
//           <div className="dashboard-card">
//             <h3>Orders</h3>
//             <p className="text-purple-500">75</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// src/components/Dashboard.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f4f4;
  font-family: "Arial", sans-serif;
`;

const Sidebar = styled.div`
  width: ${({ isOpen }) => (isOpen ? "250px" : "60px")};
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  transition: width 0.3s;
  overflow: hidden;
  position: relative;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarToggle = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
`;

const SidebarContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  margin-top: 20px;
`;

const MenuItem = styled.li`
  list-style: none;
  margin: 15px 0;
  transition: background 0.3s;

  &:hover {
    background-color: #34495e;
    border-radius: 5px;
  }

  a {
    color: white;
    text-decoration: none;
    font-size: 1.1rem;
    display: block;
    padding: 10px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const TopNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2980b9;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const UserIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;

  &:hover {
    opacity: 0.8;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Implement your logout logic here
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarToggle onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </SidebarToggle>
        <SidebarContent isOpen={isSidebarOpen}>
          <h2>Dashboard</h2>
          <ul>
            <MenuItem>
              <Link to="/dashboard">Home</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/dashboard/settings">Settings</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/dashboard/profile">Profile</Link>
            </MenuItem>
          </ul>
        </SidebarContent>
      </Sidebar>
      <MainContent>
        <TopNav>
          <h1>MyShop Dashboard</h1>
          <UserIcon onClick={handleLogout}>
            <FaUserCircle /> Logout
          </UserIcon>
        </TopNav>
        <div>
          <h2>Welcome to the Dashboard</h2>
          <p>This is the main content area.</p>
        </div>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;