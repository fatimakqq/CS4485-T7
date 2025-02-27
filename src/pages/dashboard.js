import { useAuth0 } from '@auth0/auth0-react';
import React, { useContext, createContext, useState } from 'react';
import Navbar from '../components/header';
import Unauthenticated from '../components/unauthenticated';
import { NavLink } from 'react-router-dom';
import { ChevronLast, ChevronFirst } from "lucide-react";
import Usecase1 from '../components/usecase1';
import DataGeneration from '../components/datageneration';

const SidebarContext = createContext();

export function SidebarItem({ to, label, onClick }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li className="relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-gray-500 text-gray-600">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-full flex items-center ${isActive ? "text-electricblue font-semibold" : ""}`
        }
        onClick={onClick} // Call the onClick function when the item is clicked
      >
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
          {label}
        </span>
      </NavLink>
    </li>
  );
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth0();
  const [expanded, setExpanded] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null); // State for active component

  const toggleSidebar = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const sidebarItems = [
    { label: 'Exploratory Data Analysis', component: <Usecase1 /> },
    { label: 'Data Ingestion' },
    { label: 'Dashboarding' },
    { label: 'Data Pipelining' },
    { label: 'KPI Formulas' },
    { label: 'Data Generation', component: <DataGeneration /> },
    { label: 'Security Management' },
    { label: 'Fault Management' },
    { label: 'Performance Metrics' },
  ];

  // Function to handle the click event on sidebar items
  const handleSidebarClick = (component) => {
    setActiveComponent(component); // Set the active component
  };

  if (!isAuthenticated) {
    return <Unauthenticated />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-4.5rem)] mt-[4.5rem] overflow-hidden">
        <div className={`bg-yellow-300 transition-all h-[calc(100vh-4.5rem)] ${expanded ? "w-[20%]" : "w-[5%]"}`}>
          <aside className="h-full overflow-hidden">
            <nav className="h-full flex flex-row bg-background border-r border-gray-200 shadow-sm">
              {/* Left Column - Sidebar Items */}
              <div className={`transition-all ${expanded ? "w-[90%]" : "w-0"}`}>
                <SidebarContext.Provider value={{ expanded }}>
                  <ul className="flex flex-col items-center justify-center px-3 overflow-hidden h-full">
                    {sidebarItems.map((item, index) => (
                      <SidebarItem 
                        key={index} 
                        to={item.to} 
                        label={item.label} 
                        onClick={() => handleSidebarClick(item.component)} // Pass the component to the click handler
                      />
                    ))}
                  </ul>
                </SidebarContext.Provider>
              </div>

              {/* Right Column - Toggle Button */}
              <div className="flex mx-auto w-[10%] h-full items-center justify-center">
                <button onClick={toggleSidebar} className="p-1.5">
                  {expanded ? <ChevronFirst /> : <ChevronLast />}
                </button>
              </div>
            </nav>
          </aside>
        </div>
        <div className="bg-background h-[calc(100vh-4.5rem)] flex-1 overflow-hidden">
          {activeComponent || <Usecase1 />} {/* Render the active component */}
        </div>
        <div className="bg-blue-300 h-[calc(100vh-4.5rem)] w-[20%] overflow-hidden" />
      </div>
    </div>
  );
}

