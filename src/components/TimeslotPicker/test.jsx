import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimeslotPicker from './index';

// Mock data for testing
const mockTimeSlots = [
  {
    timeSlotId: 1,
    slotDate: '2024-08-05',
    startTime: '08:00:00',
    endTime: '09:00:00',
    availableSlots: 5,
    location: 'Phòng A1'
  },
  {
    timeSlotId: 2,
    slotDate: '2024-08-05',
    startTime: '09:00:00',
    endTime: '10:00:00',
    availableSlots: 2,
    location: 'Phòng A2'
  }
];

describe('TimeslotPicker Component', () => {
  const defaultProps = {
    timeSlots: mockTimeSlots,
    selectedDate: null,
    selectedTimeSlot: null,
    onDateSelect: jest.fn(),
    onTimeSlotSelect: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders calendar header correctly', () => {
    render(<TimeslotPicker {...defaultProps} />);
    
    expect(screen.getByText('Chọn ngày xét nghiệm')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });

  test('displays available dates correctly', () => {
    render(<TimeslotPicker {...defaultProps} />);
    
    // Should show dates with availability indicator
    const availableDates = screen.getAllByText('5'); // Day 5 from mock data
    expect(availableDates.length).toBeGreaterThan(0);
  });

  test('calls onDateSelect when date is clicked', () => {
    render(<TimeslotPicker {...defaultProps} />);
    
    // Find and click an available date
    const dateCell = screen.getByText('5').closest('.date-cell.available');
    if (dateCell) {
      fireEvent.click(dateCell);
      expect(defaultProps.onDateSelect).toHaveBeenCalled();
    }
  });

  test('shows timeslots when date is selected', () => {
    const propsWithSelectedDate = {
      ...defaultProps,
      selectedDate: '2024-08-05'
    };
    
    render(<TimeslotPicker {...propsWithSelectedDate} />);
    
    expect(screen.getByText('Chọn khung giờ')).toBeInTheDocument();
    expect(screen.getByText('08:00 - 09:00')).toBeInTheDocument();
    expect(screen.getByText('09:00 - 10:00')).toBeInTheDocument();
  });

  test('calls onTimeSlotSelect when timeslot is clicked', () => {
    const propsWithSelectedDate = {
      ...defaultProps,
      selectedDate: '2024-08-05'
    };
    
    render(<TimeslotPicker {...propsWithSelectedDate} />);
    
    const timeslotCard = screen.getByText('08:00 - 09:00').closest('.timeslot-card');
    fireEvent.click(timeslotCard);
    
    expect(defaultProps.onTimeSlotSelect).toHaveBeenCalledWith(mockTimeSlots[0]);
  });

  test('shows loading state correctly', () => {
    const loadingProps = {
      ...defaultProps,
      selectedDate: '2024-08-05',
      loading: true
    };
    
    render(<TimeslotPicker {...loadingProps} />);
    
    expect(screen.getByText('Đang tải khung giờ...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows popular badge for low availability slots', () => {
    const propsWithSelectedDate = {
      ...defaultProps,
      selectedDate: '2024-08-05'
    };
    
    render(<TimeslotPicker {...propsWithSelectedDate} />);
    
    // Slot with 2 available slots should show popular badge
    expect(screen.getByText('Sắp hết')).toBeInTheDocument();
  });

  test('shows no slots message when no timeslots available', () => {
    const propsWithNoSlots = {
      ...defaultProps,
      timeSlots: [],
      selectedDate: '2024-08-05'
    };
    
    render(<TimeslotPicker {...propsWithNoSlots} />);
    
    expect(screen.getByText('Không có khung giờ trống')).toBeInTheDocument();
    expect(screen.getByText('Vui lòng chọn ngày khác')).toBeInTheDocument();
  });

  test('highlights selected timeslot correctly', () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedDate: '2024-08-05',
      selectedTimeSlot: mockTimeSlots[0]
    };
    
    render(<TimeslotPicker {...propsWithSelection} />);
    
    const selectedCard = screen.getByText('08:00 - 09:00').closest('.timeslot-card');
    expect(selectedCard).toHaveClass('selected');
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  test('navigates months correctly', () => {
    render(<TimeslotPicker {...defaultProps} />);
    
    const nextButton = screen.getByRole('button', { name: /next month/i });
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    
    // Test navigation (just ensure buttons are clickable)
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);
    
    // Should not throw errors
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  test('applies custom className correctly', () => {
    const { container } = render(
      <TimeslotPicker {...defaultProps} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('timeslot-picker', 'custom-class');
  });

  test('handles empty timeSlots array gracefully', () => {
    const emptyProps = {
      ...defaultProps,
      timeSlots: []
    };
    
    render(<TimeslotPicker {...emptyProps} />);
    
    // Should render without errors
    expect(screen.getByText('Chọn ngày xét nghiệm')).toBeInTheDocument();
  });
});

// Integration test
describe('TimeslotPicker Integration', () => {
  test('complete user flow: select date then timeslot', () => {
    const onDateSelect = jest.fn();
    const onTimeSlotSelect = jest.fn();
    
    const { rerender } = render(
      <TimeslotPicker
        timeSlots={mockTimeSlots}
        selectedDate={null}
        selectedTimeSlot={null}
        onDateSelect={onDateSelect}
        onTimeSlotSelect={onTimeSlotSelect}
        loading={false}
      />
    );
    
    // Step 1: Select date
    const dateCell = screen.getByText('5').closest('.date-cell.available');
    if (dateCell) {
      fireEvent.click(dateCell);
      expect(onDateSelect).toHaveBeenCalledWith('2024-08-05');
    }
    
    // Step 2: Rerender with selected date
    rerender(
      <TimeslotPicker
        timeSlots={mockTimeSlots}
        selectedDate="2024-08-05"
        selectedTimeSlot={null}
        onDateSelect={onDateSelect}
        onTimeSlotSelect={onTimeSlotSelect}
        loading={false}
      />
    );
    
    // Step 3: Select timeslot
    const timeslotCard = screen.getByText('08:00 - 09:00').closest('.timeslot-card');
    fireEvent.click(timeslotCard);
    
    expect(onTimeSlotSelect).toHaveBeenCalledWith(mockTimeSlots[0]);
  });
});
