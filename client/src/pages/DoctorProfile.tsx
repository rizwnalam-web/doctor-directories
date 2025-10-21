import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MapPin, Star, DollarSign, Calendar, GraduationCap, Briefcase, Clock } from 'lucide-react';
import { formatDate, getDayName, formatTime } from '../lib/utils';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/doctors/${id}`);
      setDoctor(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch doctor profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading doctor profile...</p>
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
      <div className="container mx-auto px-4">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  Dr. {doctor.user.firstName} {doctor.user.lastName}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.specializations.map((spec: any) => (
                    <Badge key={spec.id} variant="secondary">
                      {spec.specialization.name}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  {doctor.city && doctor.state && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      {doctor.address}, {doctor.city}, {doctor.state} {doctor.zipCode}
                    </div>
                  )}
                  {doctor.yearsOfExperience && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-5 w-5 mr-2" />
                      {doctor.yearsOfExperience} years of experience
                    </div>
                  )}
                  {doctor.consultationFee && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-5 w-5 mr-2" />
                      ${doctor.consultationFee} consultation fee
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{doctor.averageRating}</span>
                    <span className="text-gray-600 ml-2">({doctor.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
              {user?.role === 'PATIENT' && (
                <div className="flex items-start">
                  <Link to={`/book-appointment/${doctor.id}`}>
                    <Button size="lg">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {doctor.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{doctor.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {doctor.educations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctor.educations.map((edu: any) => (
                      <div key={edu.id} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">
                          {edu.startYear} - {edu.endYear || 'Present'}
                        </p>
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {doctor.experiences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctor.experiences.map((exp: any) => (
                      <div key={exp.id} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-gray-600">{exp.hospital}</p>
                        <p className="text-sm text-gray-500">
                          {exp.startYear} - {exp.endYear || 'Present'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {doctor.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5" />
                    Patient Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {doctor.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">
                              {review.patient.user.firstName} {review.patient.user.lastName}
                            </p>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            {doctor.availabilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {doctor.availabilities.map((avail: any) => (
                      <div key={avail.id} className="flex justify-between text-sm">
                        <span className="font-medium">{getDayName(avail.dayOfWeek)}</span>
                        <span className="text-gray-600">
                          {formatTime(avail.startTime)} - {formatTime(avail.endTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {doctor.user.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{doctor.user.email}</p>
                    </div>
                  )}
                  {doctor.user.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{doctor.user.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
