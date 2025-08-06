import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { X, Download, Printer, FileText, User, Calendar, Clock, Shield, CheckCircle } from 'lucide-react';
import './TestResultModal.css';

const TestResultModal = ({ isOpen, onClose, result, patientInfo }) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    // Add a small delay to ensure the modal is fully rendered
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadPDF = () => {
    // For now, trigger print dialog which allows saving as PDF
    // In the future, this could be enhanced with a proper PDF generation library
    handlePrint();
  };

  // Mock data for demonstration - in real app, this would come from props
  const clinicInfo = {
    name: "PHÒNG KHÁM ĐA KHOA GYNEXA",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "(028) 1234 5678",
    email: "info@gynexa.com",
    license: "Giấy phép hoạt động số: 123/GP-SYT"
  };

  const doctorInfo = {
    name: "BS. Nguyễn Văn A",
    title: "Bác sĩ chuyên khoa Sản phụ khoa",
    license: "Chứng chỉ hành nghề số: 12345",
    signature: "Dr. Nguyen Van A"
  };

  // Parse result data - handle both structured and text format
  const parseTestResults = (resultText) => {
    // Default sample data if no result provided
    const defaultResults = [
      { parameter: "Estradiol (E2)", value: "45.2 pg/mL", reference: "30-400 pg/mL", status: "normal" },
      { parameter: "Progesterone", value: "12.8 ng/mL", reference: "0.2-25 ng/mL", status: "normal" },
      { parameter: "Testosterone", value: "0.8 ng/mL", reference: "0.1-0.9 ng/mL", status: "normal" },
      { parameter: "LH (Luteinizing Hormone)", value: "8.5 mIU/mL", reference: "2.4-12.6 mIU/mL", status: "normal" },
      { parameter: "FSH (Follicle Stimulating Hormone)", value: "6.2 mIU/mL", reference: "3.5-12.5 mIU/mL", status: "normal" },
      { parameter: "Prolactin", value: "18.4 ng/mL", reference: "4.8-23.3 ng/mL", status: "normal" }
    ];

    if (!resultText) return defaultResults;

    try {
      // Try to parse as JSON first (structured format)
      const parsed = JSON.parse(resultText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(item => ({
          parameter: item.parameter || item.name || 'N/A',
          value: item.value || item.result || 'N/A',
          reference: item.reference || item.normalRange || 'N/A',
          status: item.status || (item.value === 'Âm tính' || item.value === 'Negative' ? 'normal' : 'unknown')
        }));
      }
    } catch (e) {
      // If not JSON, treat as plain text and create a single result entry
      if (resultText.trim()) {
        return [{
          parameter: result.serviceName || 'Kết quả xét nghiệm',
          value: resultText,
          reference: 'Tham khảo ý kiến bác sĩ',
          status: result.resultType === 'Bình thường' ? 'normal' :
                  result.resultType === 'Bất thường' ? 'abnormal' : 'unknown'
        }];
      }
    }

    return defaultResults;
  };

  const testResults = parseTestResults(result.result);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:relative print:bg-white print:p-0">
      <div className="test-result-modal bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto print:max-h-none print:overflow-visible print:rounded-none print:max-w-none print-content">
        {/* Modal Controls - Hidden when printing */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 print:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Phiếu kết quả xét nghiệm</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="In phiếu kết quả"
            >
              <Printer className="h-4 w-4 mr-2" />
              In
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Tải về PDF"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Medical Report Content */}
        <div className="p-8 print:p-6">
          {/* Header - Clinic Information */}
          <div className="text-center border-b-2 border-blue-600 pb-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-blue-900 mb-2">{clinicInfo.name}</h1>
                <p className="text-sm text-gray-600 mb-1">{clinicInfo.address}</p>
                <p className="text-sm text-gray-600">ĐT: {clinicInfo.phone} | Email: {clinicInfo.email}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">{clinicInfo.license}</p>
          </div>

          {/* Report Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">PHIẾU KẾT QUẢ XÉT NGHIỆM</h2>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
            <p className="text-sm text-gray-600 mt-2">Kết quả xét nghiệm y tế chính thức</p>
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="patient-info-card rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin bệnh nhân
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Họ và tên:</span>
                  <span className="text-gray-900 font-semibold">{patientInfo?.fullName || patientInfo?.name || 'Nguyễn Thị Anh'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Ngày sinh:</span>
                  <span className="text-gray-900">
                    {patientInfo?.dateOfBirth ?
                      format(new Date(patientInfo.dateOfBirth), 'dd/MM/yyyy', { locale: vi }) :
                      patientInfo?.birthDate ?
                      format(new Date(patientInfo.birthDate), 'dd/MM/yyyy', { locale: vi }) : '15/05/1990'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Giới tính:</span>
                  <span className="text-gray-900">
                    {patientInfo?.gender === 'MALE' ? 'Nam' :
                     patientInfo?.gender === 'FEMALE' ? 'Nữ' :
                     patientInfo?.gender || 'Nữ'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Mã bệnh nhân:</span>
                  <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">#{patientInfo?.id || patientInfo?.userId || result.bookingId}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Số điện thoại:</span>
                  <span className="text-gray-900">{patientInfo?.phoneNumber || '0123456789'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Địa chỉ:</span>
                  <span className="text-gray-900">{patientInfo?.address || 'TP. Hồ Chí Minh'}</span>
                </div>
              </div>
            </div>

            <div className="test-info-card rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin xét nghiệm
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Tên xét nghiệm:</span>
                  <span className="text-gray-900 font-semibold">{result.serviceName || result.testName || 'Xét nghiệm hormone sinh sản'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Mã xét nghiệm:</span>
                  <span className="text-gray-900 font-mono bg-white px-2 py-1 rounded border">XN{result.bookingId || result.id || '007'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Ngày lấy mẫu:</span>
                  <span className="text-gray-900">
                    {result.sampleCollectionDate ? format(new Date(result.sampleCollectionDate), 'dd/MM/yyyy HH:mm', { locale: vi }) :
                     result.sampleDate ? format(new Date(result.sampleDate), 'dd/MM/yyyy HH:mm', { locale: vi }) :
                     result.appointmentDate ? format(new Date(result.appointmentDate), 'dd/MM/yyyy', { locale: vi }) :
                     format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Ngày có kết quả:</span>
                  <span className="text-gray-900">
                    {result.resultDate ? format(new Date(result.resultDate), 'dd/MM/yyyy HH:mm', { locale: vi }) :
                     format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Bác sĩ phụ trách:</span>
                  {/* WORKFLOW: Hiển thị tên bác sĩ từ API thay vì hardcode */}
                  {/* Ưu tiên: result.doctorName > sampleCollectionProfile.doctorName > fallback */}
                  <span className="text-gray-900">{result.doctorName || result.sampleCollectionProfile?.doctorName || doctorInfo.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-36">Trạng thái:</span>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    result.resultType === 'Bình thường' || result.status === 'NORMAL'
                      ? 'bg-green-100 text-green-800'
                      : result.resultType === 'Bất thường' || result.status === 'ABNORMAL'
                      ? 'bg-red-100 text-red-800'
                      : result.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.resultType ||
                     (result.status === 'NORMAL' ? 'Bình thường' :
                      result.status === 'ABNORMAL' ? 'Bất thường' :
                      result.status === 'COMPLETED' ? 'Hoàn thành' : 'Chưa xác định')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kết quả xét nghiệm chi tiết</h3>
            <div className="overflow-x-auto">
              <table className="result-table w-full">
                <thead>
                  <tr>
                    <th>Chỉ số</th>
                    <th>Kết quả</th>
                    <th>Tham chiếu</th>
                    <th>Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((test, index) => (
                    <tr key={index}>
                      <td className="font-medium text-gray-900">{test.parameter}</td>
                      <td className="text-gray-900">{test.value}</td>
                      <td className="text-gray-600">{test.reference}</td>
                      <td>
                        <span className={`status-badge ${
                          test.status === 'normal'
                            ? 'status-normal'
                            : test.status === 'abnormal'
                            ? 'status-abnormal'
                            : 'status-unknown'
                        }`}>
                          {test.status === 'normal' ? 'Bình thường' : test.status === 'abnormal' ? 'Bất thường' : 'Cần theo dõi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conclusion and Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kết luận và khuyến nghị của bác sĩ</h3>
            <div className="conclusion-card border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Kết luận:
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">
                    {result.resultType === 'Bình thường'
                      ? 'Tất cả các chỉ số hormone sinh sản đều nằm trong giới hạn bình thường. Không phát hiện dấu hiệu bất thường nào. Chức năng sinh sản hoạt động tốt.'
                      : result.resultType === 'Bất thường'
                      ? 'Phát hiện một số chỉ số hormone không nằm trong khoảng tham chiếu bình thường. Cần tham khảo ý kiến bác sĩ chuyên khoa để đánh giá chi tiết và có phương án điều trị phù hợp.'
                      : 'Kết quả xét nghiệm cần được bác sĩ chuyên khoa đánh giá chi tiết để đưa ra kết luận chính xác về tình trạng sức khỏe sinh sản.'
                    }
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Khuyến nghị:
                </h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <ul className="text-gray-800 leading-relaxed space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {result.notes || 'Duy trì chế độ ăn uống cân bằng, giàu vitamin và khoáng chất'}
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Tập thể dục đều đặn, tránh stress và căng thẳng
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Thực hiện xét nghiệm định kỳ theo lịch hẹn của bác sĩ (6-12 tháng/lần)
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      Liên hệ ngay với bác sĩ nếu có bất kỳ triệu chứng bất thường nào
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Doctor Information and Signature */}
          <div className="border-t-2 border-gray-200 pt-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Left: Print Info */}
              <div className="text-sm text-gray-600">
                <p className="mb-2 font-medium">Thông tin in phiếu:</p>
                <p className="mb-1">Ngày in: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                <p className="text-xs text-gray-500">Mã phiếu: #{result.bookingId || 'XN007'}-{format(new Date(), 'yyyyMMdd')}</p>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Phiếu này có giá trị khi có chữ ký và con dấu của cơ sở y tế
                </p>
              </div>

              {/* Center: QR Code placeholder */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400 text-center">QR Code<br/>Xác thực</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Quét để xác thực</p>
              </div>

              {/* Right: Doctor Signature */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Bác sĩ phụ trách:</p>
                {/* WORKFLOW: Hiển thị tên bác sĩ trong chữ ký từ API data */}
                <p className="text-base font-bold text-gray-900 mb-1">{result.doctorName || result.sampleCollectionProfile?.doctorName || doctorInfo.name}</p>
                <p className="text-xs text-gray-600 mb-1">{doctorInfo.title}</p>
                <p className="text-xs text-gray-500 mb-3">{doctorInfo.license}</p>
                <div className="w-32 h-16 signature-box mx-auto">
                  <span className="text-xs text-gray-400 italic">Chữ ký điện tử</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ký ngày: {format(new Date(), 'dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
            </div>

            {/* Bottom disclaimer */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Kết quả này chỉ có giá trị tham khảo và cần được bác sĩ chuyên khoa tư vấn thêm.
                Mọi thắc mắc xin liên hệ: {clinicInfo.phone} hoặc {clinicInfo.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultModal;
