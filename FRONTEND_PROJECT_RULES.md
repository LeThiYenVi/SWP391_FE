# FRONTEND PROJECT RULES

## **Thông tin dự án**
- **Framework**: ReactJS
- **Ngôn ngữ**: JavaScript/JSX
- **Package Manager**: npm
- **Build Tool**: Vite

---

## **Cấu trúc thư mục**

```
FRONTEND/
├── src/
│   ├── components/
│   │   ├── layouts/
│   │   ├── LoadingSpinner/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── NurseContext/
│   │   ├── AuthContext.jsx
│   │   └── StudentDataContext.jsx
│   ├── mockData/
│   │   ├── students.js
│   │   └── users.js
│   ├── Pages/
│   │   ├── Admin/
│   │   ├── Nurse/
│   │   ├── Parent/
│   │   └── Login.jsx
│   ├── routes/
│   │   ├── AdminRoutes.jsx
│   │   ├── NurseRoutes.jsx
│   │   ├── ParentRoutes.jsx
│   │   └── index.jsx
│   ├── services/
│   ├── styles/
│   │   ├── global.css
│   │   ├── login.css
│   │   └── App.css
│   ├── App.jsx
│   ├── index.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── index.html
```

---

## **Quy tắc đặt tên**

### **1. File và Thư mục**
- **Components**: `PascalCase` (VD: `LoadingSpinner`, `ProtectedRoute`)
- **Pages**: `PascalCase` (VD: `Login`, `Admin`, `Nurse`)
- **Context**: `PascalCase` + `Context` (VD: `AuthContext`, `NurseContext`)
- **Routes**: `PascalCase` + `Routes` (VD: `AdminRoutes`, `NurseRoutes`)
- **Services**: `camelCase` (VD: `userService.js`, `apiService.js`)
- **Styles**: `camelCase` + `.css` (VD: `global.css`, `login.css`)
- **Mock Data**: `camelCase` (VD: `students.js`, `users.js`)

### **2. Biến và Function**
- **Variables**: `camelCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **React Components**: `PascalCase`

---

## **Quy tắc mã hóa**

### **1. Import/Export**
```javascript
// ✅ Đúng
import React from 'react';
import { useState, useEffect } from 'react';
import ComponentName from './ComponentName';

// ✅ Default export cho components
export default ComponentName;

// ✅ Named export cho utilities
export { utilityFunction, CONSTANT_VALUE };
```

### **2. React Components**
```javascript
// ✅ Functional Component với Arrow Function
const ComponentName = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### **3. Props và State**
```javascript
// ✅ Destructuring props
const Component = ({ prop1, prop2, children }) => {
  // Component logic
};

// ✅ PropTypes validation (nếu sử dụng)
Component.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};
```

---

## **Cấu trúc thư mục chi tiết**

### **📁 src/components/**
- Chứa các React components tái sử dụng
- Mỗi component phức tạp nên có thư mục riêng
- File structure: `ComponentName/index.jsx` hoặc `ComponentName.jsx`

### **📁 src/context/**
- Chứa React Context providers
- Quản lý global state của ứng dụng
- Đặt tên: `FeatureContext.jsx`

### **📁 src/Pages/**
- Chứa các page components chính
- Mỗi page có thể có thư mục con cho sub-components
- Route-level components

### **📁 src/routes/**
- Định nghĩa routing cho từng module
- Protected routes và public routes
- Tách biệt routes theo role (Admin, Nurse, Parent)

### **📁 src/services/**
- API calls và business logic
- HTTP client configurations
- Data transformation utilities

### **📁 src/styles/**
- Global CSS và theme variables
- Component-specific styles
- Responsive design utilities

### **📁 src/mockData/**
- Mock data cho development và testing
- JSON files hoặc JavaScript objects
- Temporary data structures

---

## **Best Practices**

### **1. Component Design**
- Sử dụng functional components với hooks
- Tách logic phức tạp thành custom hooks
- Giữ components nhỏ và tập trung (Single Responsibility)

### **2. State Management**
- Sử dụng Context API cho global state
- Local state cho component-specific data
- Avoid prop drilling

### **3. Styling**
- CSS Modules hoặc styled-components
- Responsive design first
- Consistent naming conventions

### **4. Performance**
- React.memo cho expensive components
- useMemo và useCallback khi cần thiết
- Lazy loading cho routes

### **5. Error Handling**
- Error boundaries cho UI errors
- Try-catch cho async operations
- User-friendly error messages

---

## **Development Workflow**

### **1. Git Convention**
```
feature/feature-name
bugfix/bug-description
hotfix/urgent-fix
```

### **2. Commit Messages**
```
feat: add new feature
fix: bug fix
style: formatting changes
refactor: code refactoring
docs: documentation updates
```

### **3. Code Review**
- Mandatory PR reviews
- Test coverage requirements
- Performance impact assessment

---

## **Dependencies Management**

### **Core Dependencies**
- `react`: UI library
- `react-dom`: DOM rendering
- `react-router-dom`: Client-side routing

### **Development Dependencies**
- `vite`: Build tool
- `eslint`: Code linting
- `prettier`: Code formatting

---

## **Testing Strategy**

### **Unit Testing**
- Jest + React Testing Library
- Component testing
- Utility function testing

### **Integration Testing**
- API integration tests
- Route testing
- Context provider testing

### **E2E Testing**
- Cypress hoặc Playwright
- Critical user flows
- Cross-browser testing

---

## **Deployment**

### **Build Process**
```bash
npm run build
npm run preview
```

### **Environment Variables**
```
VITE_API_URL=your_api_url
VITE_APP_NAME=your_app_name
```

### **Production Checklist**
- [ ] Build optimization
- [ ] Environment variables set
- [ ] Error tracking configured
- [ ] Performance monitoring
- [ ] SEO optimization 