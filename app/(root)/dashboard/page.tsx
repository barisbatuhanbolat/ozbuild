import PageWrapper from "@/components/common/PageWrapper";
import DashboardCards from "@/components/layout/DashboardCards";
import Header from "@/components/layout/Header";
import { Search, Bell } from 'lucide-react';
import React from "react";

const Dashboard = () => {
  return (
    <PageWrapper>
      <Header />
      <div>
        {/* Main Content Area */}
        <div>
          <DashboardCards />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;