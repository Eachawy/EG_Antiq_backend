import "./dashboard.scss";

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Mail, Users, TrendingUp, UserPlus } from "lucide-react";
import PageHeader from "app/shared/components/page-header/page-header";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { getStatistics } from "../newsletter/newsletter.reducer";

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [statistics, setStatistics] = useState<any>(null);

  const $Statistics = useAppSelector((state) => state.Newsletter.statistics);
  const loading = useAppSelector((state) => state.Newsletter.loading);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if ($Statistics?.data) {
      setStatistics($Statistics.data);
    }
  }, [$Statistics]);

  const fetchStatistics = async () => {
    await dispatch(getStatistics());
  };

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to the admin dashboard"
        icon={<TrendingUp className="w-6 h-6" />}
      />

      <div className="mt-6">
        {/* Newsletter Statistics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail size={20} />
            Newsletter Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  {loading ? "..." : statistics?.total || 0}
                </div>
                <div className="text-gray-600 mt-2 text-sm">
                  Total Subscriptions
                </div>
              </div>
            </Card>

            <Card className="shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-full bg-green-100">
                    <Users className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {loading ? "..." : statistics?.subscribed || 0}
                </div>
                <div className="text-gray-600 mt-2 text-sm">
                  Active Subscribers
                </div>
              </div>
            </Card>

            <Card className="shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-full bg-orange-100">
                    <UserPlus className="text-orange-600" size={24} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-orange-600">
                  {loading ? "..." : statistics?.newThisMonth || 0}
                </div>
                <div className="text-gray-600 mt-2 text-sm">New This Month</div>
              </div>
            </Card>

            <Card className="shadow-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-full bg-red-100">
                    <Users className="text-red-600" size={24} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-red-600">
                  {loading ? "..." : statistics?.unsubscribed || 0}
                </div>
                <div className="text-gray-600 mt-2 text-sm">Unsubscribed</div>
              </div>
            </Card>
          </div>
        </div>

        {/* You can add more dashboard sections here */}
      </div>
    </div>
  );
};

export default Dashboard;
