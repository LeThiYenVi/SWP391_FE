import React from 'react';
import { Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { format, subHours, addHours } from 'date-fns';
import { vi } from 'date-fns/locale';

const TimeValidationHelper = ({ type = 'sample' }) => {
  const now = new Date();
  const twoHoursAgo = subHours(now, 2);
  const twoHoursLater = addHours(now, 2);

  const sampleTimeInfo = {
    title: 'Hướng dẫn chọn thời gian lấy mẫu',
    icon: <Clock className="h-5 w-5 text-green-600" />,
    rules: [
      {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        text: `Thời gian sớm nhất: ${format(twoHoursAgo, 'HH:mm dd/MM/yyyy', { locale: vi })}`,
        type: 'success'
      },
      {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        text: `Thời gian muộn nhất: ${format(now, 'HH:mm dd/MM/yyyy', { locale: vi })}`,
        type: 'success'
      },
      {
        icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        text: 'Không được chọn thời gian quá 2 tiếng trước',
        type: 'error'
      },
      {
        icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        text: 'Không được chọn thời gian trong tương lai',
        type: 'error'
      }
    ]
  };

  const resultTimeInfo = {
    title: 'Hướng dẫn chọn thời gian trả kết quả',
    icon: <Clock className="h-5 w-5 text-blue-600" />,
    rules: [
      {
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
        text: `Thời gian sớm nhất: ${format(now, 'HH:mm dd/MM/yyyy', { locale: vi })}`,
        type: 'success'
      },
      {
        icon: <Info className="h-4 w-4 text-blue-600" />,
        text: 'Có thể chọn bất kỳ thời gian nào trong tương lai',
        type: 'info'
      },
      {
        icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        text: 'Không được chọn thời gian trong quá khứ',
        type: 'error'
      },
      {
        icon: <AlertCircle className="h-4 w-4 text-red-600" />,
        text: 'Phải sau thời gian lấy mẫu',
        type: 'error'
      }
    ]
  };

  const info = type === 'sample' ? sampleTimeInfo : resultTimeInfo;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
      <div className="flex items-center mb-3">
        {info.icon}
        <h5 className="ml-2 text-sm font-medium text-gray-900">{info.title}</h5>
      </div>
      <div className="space-y-2">
        {info.rules.map((rule, index) => (
          <div key={index} className="flex items-start">
            {rule.icon}
            <span className={`ml-2 text-xs ${
              rule.type === 'success' ? 'text-green-700' :
              rule.type === 'error' ? 'text-red-700' :
              rule.type === 'info' ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {rule.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeValidationHelper;
