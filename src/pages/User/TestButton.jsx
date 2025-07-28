import React, { useState } from 'react';
import { Button, Modal, Form, DatePicker, InputNumber, Checkbox, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const TestButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleSubmit = (values) => {
    setSaving(true);
    console.log('Form values:', values);
    
    // Mock API call
    setTimeout(() => {
      message.success('Tạo chu kỳ thành công!');
      setShowModal(false);
      form.resetFields();
      setSaving(false);
    }, 1000);
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Test Button</h1>
      
      <Button
        type="primary"
        size="large"
        icon={<PlusOutlined />}
        onClick={() => {
          alert('Button clicked!');
          console.log('Opening modal...');
          setShowModal(true);
        }}
      >
        Tạo chu kỳ mới
      </Button>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        title="Tạo chu kỳ kinh nguyệt mới"
        okText="Tạo chu kỳ"
        cancelText="Hủy"
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Ngày bắt đầu kỳ kinh gần nhất"
            name="startDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu kỳ kinh' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
              placeholder="Chọn ngày bắt đầu kỳ kinh"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="Độ dài chu kỳ (ngày)"
            name="cycleLength"
            initialValue={28}
          >
            <InputNumber
              min={21}
              max={35}
              style={{ width: '100%' }}
              placeholder="Nhập độ dài chu kỳ (21-35 ngày)"
            />
          </Form.Item>

          <Form.Item
            label="Số ngày hành kinh"
            name="periodDuration"
            initialValue={5}
          >
            <InputNumber
              min={3}
              max={10}
              style={{ width: '100%' }}
              placeholder="Nhập số ngày hành kinh (3-10 ngày)"
            />
          </Form.Item>

          <Form.Item
            label="Chu kỳ đều đặn"
            name="isRegular"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Chu kỳ của tôi thường đều đặn</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestButton;
