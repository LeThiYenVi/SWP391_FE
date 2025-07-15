import React, { useEffect, useState } from "react";
import { Card, Badge, Row, Col, List, Progress, Tooltip, Spin, DatePicker, Button, message, InputNumber, Form, Input, Select, Checkbox, Modal } from "antd";
import { CalendarOutlined, HeartOutlined, SmileOutlined, WarningOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "../../../services/customize-axios";
import dayjs from "dayjs";

const moodColors = {
  BINH_THUONG: "#52c41a",
  BUON: "#1890ff",
  LO_LANG: "#faad14",
  CAU_GAT: "#f5222d",
  HANH_PHUC: "#eb2f96",
  CANG_THANG: "#722ed1",
  NORMAL: "#52c41a",
  SAD: "#1890ff",
  ANXIOUS: "#faad14",
  IRRITATED: "#f5222d",
  HAPPY: "#eb2f96",
  STRESSED: "#722ed1"
};

const moodVi = {
  NORMAL: "Bình thường",
  SAD: "Buồn",
  ANXIOUS: "Lo lắng",
  IRRITATED: "Cáu gắt",
  HAPPY: "Hạnh phúc",
  STRESSED: "Căng thẳng",
};

const { Option } = Select;
const flowIntensityOptions = [
  { label: "Nhẹ", value: "LIGHT" },
  { label: "Vừa", value: "MEDIUM" },
  { label: "Nặng", value: "HEAVY" },
];
const moodOptions = [
  { label: "Bình thường", value: "NORMAL" },
  { label: "Buồn", value: "SAD" },
  { label: "Lo lắng", value: "ANXIOUS" },
  { label: "Cáu gắt", value: "IRRITATED" },
  { label: "Hạnh phúc", value: "HAPPY" },
  { label: "Căng thẳng", value: "STRESSED" },
];
const severityOptions = [
  { label: "Nhẹ", value: "MILD" },
  { label: "Vừa", value: "MODERATE" },
  { label: "Nặng", value: "SEVERE" },
];

const defaultSymptoms = [
  { symptomId: 1, symptomName: "Đau bụng kinh" },
  { symptomId: 2, symptomName: "Căng tức ngực" },
  { symptomId: 3, symptomName: "Mệt mỏi" },
  { symptomId: 4, symptomName: "Đau đầu" },
  { symptomId: 5, symptomName: "Thay đổi tâm trạng" },
];

const CycleTrackingPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ovulationDate, setOvulationDate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [periodDuration, setPeriodDuration] = useState(null);
  const [form] = Form.useForm();
  const [symptoms, setSymptoms] = useState([]);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [symptomForm] = Form.useForm();

  useEffect(() => {
    axios.get("/api/menstrual-cycle/dashboard")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveOvulation = () => {
    if (!ovulationDate) return;
    setSaving(true);
    setLoading(true); // Đặt loading ở đầu
    axios.post("/api/menstrual-cycle/log-enhanced", {
      ovulationDate: ovulationDate.format("YYYY-MM-DD"),
      periodDuration: periodDuration || null,
    })
      .then(() => {
        message.success("Đã lưu ngày rụng trứng/thời gian hành kinh!");
        setOvulationDate(null);
        setPeriodDuration(null);
        return axios.get("/api/menstrual-cycle/dashboard");
      })
      .then((res) => setData(res.data))
      .finally(() => {
        setSaving(false);
        setLoading(false); // Đảm bảo loading luôn về false
      });
  };

  const handleSaveLog = (values) => {
    setSaving(true);
    setLoading(true);
    // Chuẩn hóa dữ liệu gửi lên BE
    const payload = {
      logDate: values.logDate ? values.logDate.format("YYYY-MM-DDTHH:mm:ss") : null,
      isActualPeriod: values.isActualPeriod || false,
      flowIntensity: values.flowIntensity || null,
      mood: values.mood || null,
      temperature: values.temperature || null,
      symptoms: symptoms.length > 0 ? symptoms : null,
      notes: values.notes || null,
      ovulationDate: values.ovulationDate ? values.ovulationDate.format("YYYY-MM-DD") : null,
      periodDuration: values.periodDuration || null,
    };
    axios.post("/api/menstrual-cycle/log-enhanced", payload)
      .then(() => {
        message.success("Đã lưu log chu kỳ!");
        setOvulationDate(null);
        setPeriodDuration(null);
        setSymptoms([]);
        form.resetFields();
        setLoading(true);
        return axios.get("/api/menstrual-cycle/dashboard");
      })
      .then((res) => setData(res.data))
      .finally(() => {
        setSaving(false);
        setLoading(false);
      });
  };

  // Thêm triệu chứng
  const handleAddSymptom = (values) => {
    setSymptoms([...symptoms, values]);
    setShowSymptomModal(false);
    symptomForm.resetFields();
  };
  // Xóa triệu chứng
  const handleRemoveSymptom = (idx) => {
    setSymptoms(symptoms.filter((_, i) => i !== idx));
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "80px auto" }} />;
  if (!data) return <div>Không có dữ liệu</div>;

  // Thêm fallback cho các field
  const { periodPrediction = {}, fertilityWindow = {}, cycleAnalytics = {} } = data || {};
  if (!periodPrediction.nextPeriodDate || !fertilityWindow.ovulationDate || !cycleAnalytics.averageCycleLength) {
    return <div>Không có dữ liệu chu kỳ</div>;
  }

  return (
    <div style={{ padding: 32 }}>
      {/* Form nhập đầy đủ các trường log chu kỳ */}
      <Card style={{ marginBottom: 24 }}>
        <h3>Nhật ký chu kỳ kinh nguyệt</h3>
        <Form layout="vertical" form={form} onFinish={handleSaveLog}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label="Ngày log chu kỳ" name="logDate">
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Có phải ngày hành kinh thực tế?" name="isActualPeriod" valuePropName="checked">
                <Checkbox />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Mức độ ra máu" name="flowIntensity">
                <Select allowClear options={flowIntensityOptions} placeholder="Chọn mức độ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Tâm trạng" name="mood">
                <Select allowClear options={moodOptions} placeholder="Chọn tâm trạng" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Nhiệt độ cơ thể (°C)" name="temperature">
                <InputNumber min={34} max={42} step={0.1} style={{ width: '100%' }} placeholder="Nhập nhiệt độ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Số ngày hành kinh" name="periodDuration">
                <InputNumber min={1} max={15} style={{ width: '100%' }} placeholder="Nhập số ngày hoặc để trống" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Ngày rụng trứng thực tế" name="ovulationDate">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Chọn ngày rụng trứng" />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea rows={1} placeholder="Nhập ghi chú (nếu có)" />
              </Form.Item>
            </Col>
          </Row>
          {/* Triệu chứng */}
          <div style={{ marginBottom: 12 }}>
            <b>Triệu chứng:</b>
            <Button type="dashed" size="small" style={{ marginLeft: 8 }} onClick={() => setShowSymptomModal(true)}>+ Thêm triệu chứng</Button>
            <List
              size="small"
              dataSource={symptoms}
              renderItem={(item, idx) => (
                <List.Item actions={[<a onClick={() => handleRemoveSymptom(idx)}>Xóa</a>]}> 
                  {item.symptomName} ({item.severity}) {item.notes && `- ${item.notes}`}
                </List.Item>
              )}
              locale={{ emptyText: 'Chưa có triệu chứng' }}
              style={{ marginTop: 8 }}
            />
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving}>Lưu nhật ký chu kỳ</Button>
          </Form.Item>
        </Form>
        {/* Modal thêm triệu chứng */}
        <Modal open={showSymptomModal} onCancel={() => setShowSymptomModal(false)} onOk={() => symptomForm.submit()} title="Thêm triệu chứng" okText="Thêm" cancelText="Hủy">
          <Form form={symptomForm} layout="vertical" onFinish={handleAddSymptom}>
            <Form.Item label="Tên triệu chứng" name="symptomName" rules={[{ required: true, message: 'Nhập tên triệu chứng' }]}> 
              <Select showSearch placeholder="Chọn hoặc nhập triệu chứng" allowClear>
                {defaultSymptoms.map(s => <Option key={s.symptomId} value={s.symptomName}>{s.symptomName}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Mức độ" name="severity" rules={[{ required: true, message: 'Chọn mức độ' }]}> 
              <Select options={severityOptions} placeholder="Chọn mức độ" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="notes">
              <Input placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      {/* XÓA block nhập ngày rụng trứng thực tế & số ngày hành kinh ở dưới */}
      {/* <Card style={{ marginBottom: 24 }}> ... </Card> */}
      <h2 style={{ marginBottom: 24 }}>Theo dõi chu kỳ kinh nguyệt</h2>
      <Row gutter={[24, 24]}>
        {/* Kỳ kinh tiếp theo */}
        <Col xs={24} md={12}>
          <Card>
            <h3><CalendarOutlined /> Kỳ kinh tiếp theo</h3>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{periodPrediction.nextPeriodDate}</div>
            <div style={{ margin: "8px 0" }}>
              <Badge color={periodPrediction.confidence > 0.7 ? "#52c41a" : "#faad14"} text={`Độ tin cậy: ${Math.round(periodPrediction.confidence * 100)}%`} />
            </div>
            <div>Phương pháp dự đoán: <b>{periodPrediction.predictionMethod === 'default' ? 'Trung bình cộng' : periodPrediction.predictionMethod}</b></div>
            <div style={{ color: "#888" }}>{periodPrediction.reliabilityNote}</div>
          </Card>
        </Col>
        {/* Rụng trứng */}
        <Col xs={24} md={12}>
          <Card>
            <h3><HeartOutlined /> Ngày rụng trứng dự kiến</h3>
            <div style={{ fontSize: 20 }}>
              {fertilityWindow.ovulationDate || "Chưa thiết lập"}
              <Badge
                color={
                  fertilityWindow.fertilityStatus === "HIGH"
                    ? "#f5222d"
                    : fertilityWindow.fertilityStatus === "MEDIUM"
                    ? "#faad14"
                    : "#d9d9d9"
                }
                style={{ marginLeft: 8 }}
                text={
                  fertilityWindow.fertilityStatus === "HIGH"
                    ? "Khả năng cao"
                    : fertilityWindow.fertilityStatus === "MEDIUM"
                    ? "Trung bình"
                    : "Thấp"
                }
              />
            </div>
            <div>Thời kỳ dễ thụ thai: <b>{fertilityWindow.fertileWindowStart}</b> - <b>{fertilityWindow.fertileWindowEnd}</b></div>
            <div style={{ color: "#888" }}>{fertilityWindow.notes}</div>
          </Card>
        </Col>
        {/* Độ dài chu kỳ */}
        <Col xs={24} md={12}>
          <Card>
            <h3>Độ dài chu kỳ</h3>
            <div style={{ fontSize: 24 }}>{cycleAnalytics.averageCycleLength || "--"} ngày</div>
            <div>Thời gian hành kinh trung bình: <b>{cycleAnalytics.averagePeriodDuration || "--"} ngày</b></div>
            <div style={{ margin: "8px 0" }}>
              <Badge
                color={cycleAnalytics.isRegular ? "#52c41a" : "#f5222d"}
                text={cycleAnalytics.regularityStatus === "REGULAR" ? "Chu kỳ đều" : "Chu kỳ không đều"}
                icon={cycleAnalytics.isRegular ? <CheckCircleOutlined /> : <WarningOutlined />}
              />
            </div>
          </Card>
        </Col>
        {/* Cảm xúc & triệu chứng */}
        <Col xs={24} md={12}>
          <Card>
            <h3><SmileOutlined /> Thống kê cảm xúc</h3>
            <List
              locale={{emptyText: 'Không có dữ liệu'}}
              dataSource={Object.entries(cycleAnalytics.moodPatterns || {})}
              renderItem={([mood, value]) => (
                <List.Item>
                  <Badge color={moodColors[mood] || "#d9d9d9"} text={<b>{moodVi[mood] || mood}</b>} />
                  <Progress percent={parseFloat(value)} size="small" style={{ width: 120, marginLeft: 16 }} />
                </List.Item>
              )}
            />
            <h3 style={{ marginTop: 16 }}>Tần suất triệu chứng</h3>
            <List
              locale={{emptyText: 'Không có dữ liệu'}}
              dataSource={Object.entries(cycleAnalytics.symptomFrequency || {})}
              renderItem={([symptom, count]) => (
                <List.Item>
                  <Badge color="#722ed1" text={symptom} />
                  <span style={{ marginLeft: 16 }}>{count} lần</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        {/* Xu hướng & gợi ý sức khỏe */}
        <Col xs={24}>
          <Card>
            <h3>Xu hướng chu kỳ</h3>
            <List
              locale={{emptyText: 'Không có dữ liệu'}}
              dataSource={cycleAnalytics.trends || []}
              renderItem={trend => <List.Item>{trend}</List.Item>}
            />
            <h3 style={{ marginTop: 16 }}>Gợi ý sức khỏe</h3>
            <List
              locale={{emptyText: 'Không có dữ liệu'}}
              dataSource={cycleAnalytics.recommendations || []}
              renderItem={tip => (
                <List.Item><CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />{tip}</List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CycleTrackingPage;
