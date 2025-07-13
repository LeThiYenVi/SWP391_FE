import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Row, Col, message, Spin, Typography, Select } from 'antd';
import axios from '../../services/customize-axios';

const { Title } = Typography;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({});

  // Load profile
  useEffect(() => {
    setLoading(true);
    axios.get('/api/user/profile')
      .then(res => {
        // Chuyển null thành '' cho các field để form không bị undefined
        const cleanData = Object.fromEntries(
          Object.entries(res.data).map(([k, v]) => [k, v == null ? '' : v])
        );
        console.log('DATA PROFILE:', cleanData); // Debug dữ liệu trả về
        // Nếu BE trả về key không khớp, map lại cho đúng
        const mappedData = {
          fullName: cleanData.fullName || cleanData.fullname || cleanData.name || '',
          email: cleanData.email || '',
          phoneNumber: cleanData.phoneNumber || cleanData.phone || '',
          dateOfBirth: cleanData.dateOfBirth || cleanData.dob || '',
          address: cleanData.address || '',
          gender: cleanData.gender || '',
          description: cleanData.description || '',
        };
        setProfile(mappedData);
        form.setFieldsValue(mappedData); // fill lại form
      })
      .catch(() => message.error('Không thể tải thông tin hồ sơ!'))
      .finally(() => setLoading(false));
  }, [form]);

  // Cập nhật profile
  const handleFinish = (values) => {
    setSaving(true);
    axios.post('/api/user/profile', values)
      .then(() => {
        message.success('Cập nhật hồ sơ thành công!');
        setLoading(true);
        axios.get('/api/user/profile')
          .then(res => {
            const cleanData = Object.fromEntries(
              Object.entries(res.data).map(([k, v]) => [k, v == null ? '' : v])
            );
            setProfile(cleanData);
            form.setFieldsValue(cleanData);
          })
          .finally(() => setLoading(false));
      })
      .catch(() => message.error('Cập nhật hồ sơ thất bại!'))
      .finally(() => setSaving(false));
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>Hồ sơ cá nhân</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Nhập họ tên' }]}> <Input /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}> <Input disabled /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phoneNumber"> <Input /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày sinh" name="dateOfBirth"> <Input type="date" /> </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Địa chỉ" name="address"> <Input /> </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Giới tính" name="gender">
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description"> <Input.TextArea rows={2} /> </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={saving}>Cập nhật hồ sơ</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserProfile; 