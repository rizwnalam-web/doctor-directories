import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDate, formatTime } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Appointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter.toUpperCase()}` : '';
      const response = await api.get(`/appointments${params}`);
      setAppointments(response.data.appointments);
    } catch (error: any) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error: any) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error: any) {
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No appointments found</p>
              {user?.role === 'PATIENT' && (
                <Link to="/doctors">
                  <Button>Find Doctors</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {user?.role === 'PATIENT' ? (
                              <>
                                Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                              </>
                            ) : (
                              <>
                                {appointment.patient.user.firstName} {appointment.patient.user.lastName}
                              </>
                            )}
                          </h3>
                          {user?.role === 'PATIENT' && appointment.doctor.specializations.length > 0 && (
                            <div className="flex gap-2 mb-2">
                              {appointment.doctor.specializations.map((spec: any) => (
                                <Badge key={spec.id} variant="secondary">
                                  {spec.specialization.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                        {user?.role === 'PATIENT' && appointment.doctor.city && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {appointment.doctor.city}, {appointment.doctor.state}
                          </div>
                        )}
                        {appointment.reason && (
                          <div className="mt-2">
                            <p className="font-medium">Reason:</p>
                            <p>{appointment.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {user?.role === 'DOCTOR' && appointment.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED')}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {user?.role === 'DOCTOR' && appointment.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(appointment.id, 'COMPLETED')}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {user?.role === 'PATIENT' && 
                        (appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {user?.role === 'PATIENT' && (
                        <Link to={`/doctors/${appointment.doctor.id}`}>
                          <Button size="sm" variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
