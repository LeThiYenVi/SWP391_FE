import React, { useState } from 'react';
import TestResultModal from './TestResultModal';

const TestResultModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for testing - case with resultType
  const mockResult = {
    bookingId: "12345",
    serviceName: "Xét nghiệm STI toàn diện",
    resultDate: new Date().toISOString(),
    sampleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    appointmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    resultType: "Bình thường",
    status: "COMPLETED",
    result: JSON.stringify([
      { parameter: "HIV", value: "Âm tính", reference: "Âm tính", status: "normal" },
      { parameter: "Syphilis", value: "Âm tính", reference: "Âm tính", status: "normal" },
      { parameter: "Hepatitis B", value: "Âm tính", reference: "Âm tính", status: "normal" },
      { parameter: "Gonorrhea", value: "Âm tính", reference: "Âm tính", status: "normal" },
      { parameter: "Chlamydia", value: "Âm tính", reference: "Âm tính", status: "normal" }
    ]),
    notes: "Kết quả xét nghiệm bình thường. Khuyến nghị tiếp tục duy trì lối sống lành mạnh và thực hiện xét nghiệm định kỳ theo lịch hẹn."
  };

  // Mock data for testing - case without resultType (should show "Hoàn thành")
  const mockResultCompleted = {
    bookingId: "12346",
    serviceName: "Xét nghiệm vitamin và khoáng chất",
    resultDate: new Date().toISOString(),
    sampleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    appointmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "COMPLETED",
    result: JSON.stringify([
      { parameter: "Vitamin D", value: "32 ng/mL", reference: "30-100 ng/mL", status: "normal" },
      { parameter: "Vitamin B12", value: "450 pg/mL", reference: "200-900 pg/mL", status: "normal" },
      { parameter: "Iron", value: "85 μg/dL", reference: "60-170 μg/dL", status: "normal" }
    ]),
    notes: "Tất cả các chỉ số đều trong giới hạn bình thường."
  };

  const mockPatient = {
    id: "USER123",
    fullName: "Nguyễn Văn A",
    dateOfBirth: "1990-05-15",
    gender: "MALE",
    phoneNumber: "0123456789",
    email: "nguyenvana@email.com"
  };

  const [currentResult, setCurrentResult] = useState(mockResult);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Result Modal Demo</h1>
      <div className="space-x-4 mb-4">
        <button
          onClick={() => {
            setCurrentResult(mockResult);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Mở Modal - Có ResultType
        </button>
        <button
          onClick={() => {
            setCurrentResult(mockResultCompleted);
            setIsModalOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Mở Modal - Chỉ có Status COMPLETED
        </button>
      </div>

      <TestResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={currentResult}
        patientInfo={mockPatient}
      />
    </div>
  );
};

export default TestResultModalDemo;
