import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Users, Star, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDayName } from '../lib/utils';

export default function DoctorDashboard() {
  const { user, fetchProfile } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    yearsOfExperience: '',
    consultationFee: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    fetchStats();
    fetchSpecializations();
    if (user?.doctor) {
      setProfileData({
        bio: user.doctor.bio || '',
        yearsOfExperience: user.doctor.yearsOfExperience?.toString() || '',
        consultationFee: user.doctor.consultationFee?.toString() || '',
        address: user.doctor.address || '',
        city: user.doctor.city || '',
        state: user.doctor.state || '',
        zipCode: user.doctor.zipCode || ''
      });
      setSelectedSpecs(user.doctor.specializations?.map((s: any) => s.specializationId) || []);
      setAvailabilities(user.doctor.availabilities || []);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/appointments');
      const appointments = response.data.appointments;
      setStats({
        total: appointments.length,
        pending: appointments.filter((a: any) => a.status === 'PENDING').length,
        confirmed: appointments.filter((a: any) => a.status === 'CONFIRMED').length,
        completed: appointments.filter((a: any) => a.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await api.get('/specializations');
      setSpecializations(response.data.specializations);
    } catch (error) {
      console.error('Failed to fetch specializations:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/doctors/profile', {
        ...profileData,
        specializationIds: selectedSpecs
      });
      await fetchProfile();
      setEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile');
    }
  };

  const handleUpdateAvailability = async () => {
    try {
      await api.put('/doctors/availability', { availabilities });
      await fetchProfile();
      toast.success('Availability updated successfully');
    } catch (error: any) {
      toast.error('Failed to update availability');
    }
  };

  const addAvailability = () => {
    setAvailabilities([
      ...availabilities,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true }
    ]);
  };

  const removeAvailability = (index: number) => {
    setAvailabilities(availabilities.filter((_, i) => i !== index));
  };

  const updateAvailability = (index: number, field: string, value: any) => {
    const updated = [...availabilities];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilities(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">
            Welcome, Dr. {user?.firstName} {user?.lastName}
          </p>
          {user?.doctor?.status === 'PENDING' && (
            <Badge className="mt-2 bg-yellow-100 text-yellow-800">
              Account Pending Verification
            </Badge>
          )}
          {user?.doctor?.status === 'VERIFIED' && (
            <Badge className="mt-2 bg-green-100 text-green-800">
              Verified Doctor
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Appointments</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Professional Profile</CardTitle>
                {!editingProfile && (
                  <Button onClick={() => setEditingProfile(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Specializations</Label>
                    <div className="space-y-2">
                      {specializations.map((spec) => (
                        <label key={spec.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedSpecs.includes(spec.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSpecs([...selectedSpecs, spec.id]);
                              } else {
                                setSelectedSpecs(selectedSpecs.filter(id => id !== spec.id));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{spec.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={profileData.yearsOfExperience}
                        onChange={(e) => setProfileData({ ...profileData, yearsOfExperience: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fee">Consultation Fee ($)</Label>
                      <Input
                        id="fee"
                        type="number"
                        value={profileData.consultationFee}
                        onChange={(e) => setProfileData({ ...profileData, consultationFee: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip</Label>
                      <Input
                        id="zipCode"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Specializations</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user?.doctor?.specializations?.map((spec: any) => (
                        <Badge key={spec.id} variant="secondary">
                          {spec.specialization.name}
                        </Badge>
                      )) || <p className="text-sm text-gray-500">Not set</p>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{user?.doctor?.yearsOfExperience || 'Not set'} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="font-medium">${user?.doctor?.consultationFee || 'Not set'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availabilities.map((avail, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Day</Label>
                      <select
                        value={avail.dayOfWeek}
                        onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map(day => (
                          <option key={day} value={day}>{getDayName(day)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Start</Label>
                      <Input
                        type="time"
                        value={avail.startTime}
                        onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">End</Label>
                      <Input
                        type="time"
                        value={avail.endTime}
                        onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeAvailability(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={addAvailability} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                  <Button onClick={handleUpdateAvailability}>
                    Save Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
