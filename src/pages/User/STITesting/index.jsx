import React, { useState } from "react";
import { TestTube, MapPin, Download, Eye, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "react-toastify";

const STITesting = () => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [activeTab, setActiveTab] = useState("booking"); // booking, history, results

  const availableTests = [
    {
      id: "hiv",
      name: "Xét nghiệm HIV",
      description: "Phát hiện virus gây suy giảm miễn dịch mắc phải (HIV)",
      price: 200000,
      duration: "30 phút",
      preparation: "Không cần nhịn ăn",
    },
    {
      id: "syphilis",
      name: "Xét nghiệm Giang mai",
      description: "Phát hiện vi khuẩn Treponema pallidum gây bệnh giang mai",
      price: 150000,
      duration: "20 phút",
      preparation: "Không cần nhịn ăn",
    },
    {
      id: "gonorrhea",
      name: "Xét nghiệm Lậu",
      description: "Phát hiện vi khuẩn Neisseria gonorrhoeae",
      price: 180000,
      duration: "25 phút",
      preparation: "Không quan hệ tình dục 24h trước xét nghiệm",
    },
    {
      id: "chlamydia",
      name: "Xét nghiệm Chlamydia",
      description: "Phát hiện vi khuẩn Chlamydia trachomatis",
      price: 170000,
      duration: "25 phút",
      preparation: "Không quan hệ tình dục 24h trước xét nghiệm",
    },
    {
      id: "herpes",
      name: "Xét nghiệm Herpes",
      description: "Phát hiện virus Herpes simplex type 1 và 2",
      price: 250000,
      duration: "30 phút",
      preparation: "Không cần nhịn ăn",
    },
    {
      id: "hepatitis",
      name: "Xét nghiệm Viêm gan B",
      description: "Phát hiện virus viêm gan B (HBV)",
      price: 220000,
      duration: "30 phút",
      preparation: "Nhịn ăn 8-12 tiếng trước xét nghiệm",
    },
  ];

  const testLocations = [
    {
      id: "center1",
      name: "Trung tâm Y tế Gynexa - Quận 1",
      address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "028 1234 5678",
      hours: "T2-T7: 7:00-17:00, CN: 7:00-12:00",
    },
    {
      id: "center2",
      name: "Trung tâm Y tế Gynexa - Quận 3",
      address: "456 Đường Võ Văn Tần, Quận 3, TP.HCM",
      phone: "028 8765 4321",
      hours: "T2-T7: 7:00-17:00, CN: Nghỉ",
    },
    {
      id: "center3",
      name: "Trung tâm Y tế Gynexa - Thủ Đức",
      address: "789 Đường Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
      phone: "028 9999 8888",
      hours: "T2-T7: 6:30-16:30, CN: 7:00-11:00",
    },
  ];

  const testHistory = [
    {
      id: 1,
      date: "2024-01-15",
      tests: ["HIV", "Giang mai"],
      status: "completed",
      location: "Trung tâm Y tế Gynexa - Quận 1",
      resultDate: "2024-01-17",
      totalCost: 350000,
    },
    {
      id: 2,
      date: "2024-01-20",
      tests: ["Chlamydia", "Lậu"],
      status: "pending",
      location: "Trung tâm Y tế Gynexa - Quận 3",
      resultDate: "2024-01-22",
      totalCost: 350000,
    },
  ];

  const handleTestSelection = (testId) => {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  };

  const calculateTotal = () => {
    return selectedTests.reduce((total, testId) => {
      const test = availableTests.find((t) => t.id === testId);
      return total + test.price;
    }, 0);
  };

  const handleBooking = () => {
    if (selectedTests.length === 0 || !selectedDate || !selectedLocation) {
      toast.error("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    // Mock booking logic
    toast.success("Đặt lịch xét nghiệm thành công!");
    setSelectedTests([]);
    setSelectedDate("");
    setSelectedLocation("");
  };

  const generateAvailableDates = () => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = addDays(new Date(), i + 1);
      return format(date, "yyyy-MM-dd");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Xét nghiệm STIs
            </h1>
            <p className="text-gray-600 mt-2">
              Tầm soát và theo dõi sức khỏe sinh sản an toàn, bảo mật
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: "booking", label: "Đặt lịch xét nghiệm" },
            { id: "history", label: "Lịch sử xét nghiệm" },
            { id: "results", label: "Kết quả xét nghiệm" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Booking Tab */}
        {activeTab === "booking" && (
          <div className="space-y-8">
            {/* Available Tests */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Chọn xét nghiệm
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableTests.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => handleTestSelection(test.id)}
                    className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all ${
                      selectedTests.includes(test.id)
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <TestTube
                          className={`h-6 w-6 mr-3 ${
                            selectedTests.includes(test.id)
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        />
                        <h3 className="font-semibold text-gray-900">
                          {test.name}
                        </h3>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedTests.includes(test.id)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedTests.includes(test.id) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {test.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Giá:</span>
                        <span className="font-semibold text-blue-600">
                          {test.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="text-gray-900">{test.duration}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <strong>Chuẩn bị:</strong> {test.preparation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTests.length > 0 && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Đã chọn {selectedTests.length} xét nghiệm
                      </h3>
                      <p className="text-sm text-blue-700">
                        {selectedTests
                          .map(
                            (id) =>
                              availableTests.find((t) => t.id === id)?.name
                          )
                          .join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">
                        Tổng: {calculateTotal().toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Selection */}
            {selectedTests.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Chọn địa điểm
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testLocations.map((location) => (
                    <div
                      key={location.id}
                      onClick={() => setSelectedLocation(location.id)}
                      className={`bg-white rounded-lg p-6 shadow-sm cursor-pointer transition-all ${
                        selectedLocation === location.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <MapPin
                            className={`h-6 w-6 mr-3 ${
                              selectedLocation === location.id
                                ? "text-blue-600"
                                : "text-gray-600"
                            }`}
                          />
                          <h3 className="font-semibold text-gray-900">
                            {location.name}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">{location.address}</p>
                        <p className="text-gray-600">📞 {location.phone}</p>
                        <p className="text-gray-600">🕒 {location.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date Selection */}
            {selectedTests.length > 0 && selectedLocation && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Chọn ngày
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {generateAvailableDates().map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 text-center rounded-lg border ${
                        selectedDate === date
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-xs text-gray-500">
                        {format(new Date(date), "EEE")}
                      </div>
                      <div className="text-sm font-medium">
                        {format(new Date(date), "dd/MM")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Button */}
            {selectedTests.length > 0 && selectedLocation && selectedDate && (
              <div className="text-center">
                <button
                  onClick={handleBooking}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Xác nhận đặt lịch xét nghiệm
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Lịch sử xét nghiệm
            </h2>
            <div className="space-y-4">
              {testHistory.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-semibold text-gray-900">
                          {format(new Date(record.date), "dd/MM/yyyy")}
                        </span>
                        <span
                          className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            record.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status === "completed"
                            ? "Hoàn thành"
                            : "Đang chờ"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Xét nghiệm:</strong> {record.tests.join(", ")}
                        </p>
                        <p>
                          <strong>Địa điểm:</strong> {record.location}
                        </p>
                        <p>
                          <strong>Ngày có kết quả:</strong>{" "}
                          {format(new Date(record.resultDate), "dd/MM/yyyy")}
                        </p>
                        <p>
                          <strong>Chi phí:</strong>{" "}
                          {record.totalCost.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>

                    <div className="ml-4">
                      {record.status === "completed" && (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                          Xem kết quả
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Kết quả xét nghiệm
            </h2>
            <div className="space-y-4">
              {testHistory
                .filter((record) => record.status === "completed")
                .map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Kết quả ngày{" "}
                          {format(new Date(record.resultDate), "dd/MM/yyyy")}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {record.tests.join(", ")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </button>
                        <button className="flex items-center bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">
                          <Download className="h-4 w-4 mr-2" />
                          Tải về
                        </button>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {record.tests.map((test, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-900">
                              {test}
                            </span>
                            <span className="text-green-600 font-semibold">
                              Âm tính
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default STITesting;
