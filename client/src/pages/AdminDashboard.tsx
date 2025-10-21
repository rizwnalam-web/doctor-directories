import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, UserCheck, UserX, Calendar, Star, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'users'>('overview');

  useEffect(() => {
    fetchStats();
    fetchPendingDoctors();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to fetch stats');
    }
  };

  const fetchPendingDoctors = async () => {
    try {
      const response = await api.get('/admin/doctors/pending');
      setPendingDoctors(response.data.doctors);
    } catch (error) {
      toast.error('Failed to fetch pending doctors');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?limit=50');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleVerifyDoctor = async (doctorId: string) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/verify`);
      toast.success('Doctor verified successfully');
      fetchPendingDoctors();
      fetchStats();
    } catch (error) {
      toast.error('Failed to verify doctor');
    }
  };

  const handleRejectDoctor = async (doctorId: string) => {
    if (!confirm('Are you sure you want to reject this doctor application?')) return;
    
    try {
      await api.put(`/admin/doctors/${doctorId}/reject`);
      toast.success('Doctor application rejected');
      fetchPendingDoctors();
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject doctor');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, doctors, and platform settings</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'doctors' ? 'default' : 'outline'}
            onClick={() => setActiveTab('doctors')}
          >
            Pending Doctors ({pendingDoctors.length})
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            All Users
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Verified Doctors</p>
                    <p className="text-2xl font-bold">{stats.verifiedDoctors}</p>
                    <p className="text-xs text-gray-500">of {stats.totalDoctors} total</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Doctors</p>
                    <p className="text-2xl font-bold">{stats.pendingDoctors}</p>
                  </div>
                  <UserX className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Appointments</p>
                    <p className="text-2xl font-bold">{stats.totalAppointments}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Appointments</p>
                    <p className="text-2xl font-bold">{stats.pendingAppointments}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pending Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="space-y-4">
            {pendingDoctors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending doctor applications</p>
                </CardContent>
              </Card>
            ) : (
              pendingDoctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          Dr. {doctor.user.firstName} {doctor.user.lastName}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Email:</strong> {doctor.user.email}</p>
                          <p><strong>Phone:</strong> {doctor.user.phone || 'Not provided'}</p>
                          <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
                          <p><strong>Applied:</strong> {formatDate(doctor.user.createdAt)}</p>
                          
                          {doctor.specializations.length > 0 && (
                            <div>
                              <strong>Specializations:</strong>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {doctor.specializations.map((spec: any) => (
                                  <Badge key={spec.id} variant="secondary">
                                    {spec.specialization.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {doctor.educations.length > 0 && (
                            <div>
                              <strong>Education:</strong>
                              <ul className="mt-1 space-y-1">
                                {doctor.educations.map((edu: any) => (
                                  <li key={edu.id}>
                                    {edu.degree} in {edu.fieldOfStudy} - {edu.institution}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {doctor.experiences.length > 0 && (
                            <div>
                              <strong>Experience:</strong>
                              <ul className="mt-1 space-y-1">
                                {doctor.experiences.map((exp: any) => (
                                  <li key={exp.id}>
                                    {exp.position} at {exp.hospital}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleVerifyDoctor(doctor.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Verify Doctor
                        </Button>
                        <Button
                          onClick={() => handleRejectDoctor(doctor.id)}
                          variant="destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* All Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={
                            user.role === 'ADMIN' ? 'default' :
                            user.role === 'DOCTOR' ? 'secondary' :
                            'outline'
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.isActive ? 'default' : 'destructive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          {user.role !== 'ADMIN' && (
                            <Button
                              size="sm"
                              variant={user.isActive ? 'destructive' : 'default'}
                              onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
