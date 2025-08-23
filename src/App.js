import { Route, Routes } from 'react-router-dom'
import './App.css';
import Dashboard from './Component/VictimDashboard/Dashboard';
import Report from './Component/VictimDashboard/ReportDisaster/Report';
import Aid from './Component/VictimDashboard/RequestAid/Aid';
import Claim from './Component/VictimDashboard/DisasterClaim/Claim';
import React from 'react';
import Footer from './Component/VictimDashboard/Footer/Footer';

function App() {
  return (
    <div >
      <Dashboard/>
      <Footer/>
      <React.Fragment>
        <Routes>
          {/* Define your routes here */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/aid" element={<Aid />} />
          <Route path="/claim" element={<Claim />} />
        </Routes>
      </React.Fragment> 
    </div>
  );
}

export default App;








