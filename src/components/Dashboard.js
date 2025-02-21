// src/components/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #333;
  color: white;
  padding: 20px;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const TopNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #444;
  color: white;
  padding: 10px 20px;
`;

const UserIcon = styled.div`
  cursor: pointer;
`;

const Dashboard = () => {
//   const history = useHistory();

  const handleLogout = () => {
    // Implement your logout logic here
    // history.push('/login');
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
          <li><Link to="/dashboard/profile">Profile</Link></li>
        </ul>
      </Sidebar>
      <MainContent>
        <TopNav>
          <h1>MyShop Dashboard</h1>
          <UserIcon onClick={handleLogout}>Logout</UserIcon>
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