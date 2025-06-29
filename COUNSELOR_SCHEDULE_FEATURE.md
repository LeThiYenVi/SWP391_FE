# Counselor Work Schedule Feature Documentation

## Overview
The counselor management page (`AdminCounselor.jsx`) has been enhanced with a comprehensive work schedule management feature called "Lịch làm việc" (Work Schedule).

## Features Implemented

### 1. Schedule Management Button
- Added a "Quản lý" (Manage) button in the counselor table with a schedule icon
- Located in a new "Lịch làm việc" column in the table
- Clicking opens the schedule management dialog

### 2. Schedule Management Dialog
The dialog includes two tabs:

#### Tab 1: "Xem lịch" (View Schedule)
- Displays the current weekly schedule for the selected counselor
- Shows schedule in a responsive grid layout (cards for each day)
- Each day shows available time slots as colored chips
- Days without schedules show "Không có lịch làm việc" message

#### Tab 2: "Chỉnh sửa lịch" (Edit Schedule)
- Allows editing the weekly schedule for the selected counselor
- Multi-select dropdown for each day to choose available time slots
- Time slots: 8:00-10:00, 10:00-12:00, 14:00-16:00, 16:00-18:00, 19:00-21:00
- Selected slots are displayed as chips
- Save button to persist changes

### 3. Mock Data Integration
- Generated mock schedule data for all existing counselors
- Schedules are randomly generated with various time slots
- Data is stored in component state and persists during the session

### 4. User Experience Features
- Responsive design that works on different screen sizes
- Color-coded UI with consistent theme colors (#3B6774)
- Success toast notifications when saving changes
- Clean, intuitive interface with Material-UI components

## Technical Implementation

### Components Used
- Material-UI Dialog, Tabs, Grid, Chip, Select, FormControl
- Icons: ScheduleIcon, CalendarTodayIcon
- Toast notifications for user feedback

### State Management
- `schedules`: Object storing schedule data for all counselors
- `selectedCounselor`: Currently selected counselor for schedule management
- `scheduleDialogOpen`: Controls dialog visibility
- `activeTab`: Manages tab selection (view/edit)

### Mock Data Structure
```javascript
schedules = {
  [counselorId]: {
    "Thứ 2": ["8:00-10:00", "14:00-16:00"],
    "Thứ 3": ["10:00-12:00"],
    // ... other days
  }
}
```

## Usage
1. Navigate to the "Tư vấn viên" (Counselor) page from the admin sidebar
2. Click the "Quản lý" button in the "Lịch làm việc" column for any counselor
3. View the current schedule in the first tab
4. Switch to the second tab to edit the schedule
5. Select/deselect time slots for each day
6. Click "Lưu thay đổi" to save changes

## Future Enhancements
- Integration with backend API for persistent storage
- Calendar view for monthly/weekly overview
- Conflict detection for overlapping appointments
- Bulk schedule operations
- Schedule templates for quick setup
- Email notifications for schedule changes
