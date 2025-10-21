import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDayName } from '../lib/utils';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch doctor details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointmentDate || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/appointments', {
        doctorId,
        ...formData
      });
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const calculateEndTime = (startTime: string) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleStartTimeChange = (time: string) => {
    setFormData({
      ...formData,
      startTime: time,
      endTime: calculateEndTime(time)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">
            Schedule an appointment with Dr. {doctor.user.firstName} {doctor.user.lastName}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Doctor Info */}
          <Card>
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold text-lg">
                  Dr. {doctor.user.firstName} {doctor.user.lastName}
                </p>
                {doctor.specializations.length > 0 && (
                  <p className="text-gray-600">
                    {doctor.specializations.map((s: any) => s.specialization.name).join(', ')}
                  </p>
                )}
                {doctor.consultationFee && (
                  <p className="text-gray-600">Consultation Fee: ${doctor.consultationFee}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          {doctor.availabilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {doctor.availabilities.map((avail: any) => (
                    <div key={avail.id} className="flex justify-between text-sm">
                      <span className="font-medium">{getDayName(avail.dayOfWeek)}</span>
                      <span className="text-gray-600">
                        {avail.startTime} - {avail.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Appointment Date *</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Regular checkup, consultation"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <textarea
                    id="notes"
                    placeholder="Any additional information for the doctor"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
