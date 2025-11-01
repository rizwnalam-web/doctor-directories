/*
  Warnings:

  - A unique constraint covering the columns `[patientId,doctorId,appointmentDate]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointments_patientId_doctorId_appointmentDate_key" ON "appointments"("patientId", "doctorId", "appointmentDate");
