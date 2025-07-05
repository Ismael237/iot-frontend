# IoT Frontend Application

A modern, production-ready React TypeScript frontend application for IoT device management and automation, built with Chakra UI v3 and following Clean Architecture principles.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive interface built with Chakra UI v3
- **Authentication**: JWT-based authentication with auto-refresh
- **Role-based Access**: Admin and user role management
- **Device Management**: Complete device lifecycle management
- **Sensor Monitoring**: Real-time sensor data visualization
- **Actuator Control**: Direct control of IoT actuators
- **Automation Rules**: Create and manage automation workflows
- **Zone Management**: Organize devices by physical zones
- **User Management**: Admin panel for user administration
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Chakra UI v3** for components and theming
- **Zustand** for state management
- **Axios** with JWT interceptors
- **React Router v6** with protected routes
- **React Hook Form** with Zod validation
- **Lucide React** for consistent icons

## 📁 Project Structure

```
src/
├── application/          # Application layer (use cases, services)
├── domain/              # Domain layer (entities, interfaces)
├── infrastructure/      # Infrastructure layer (API, external services)
├── presentation/        # Presentation layer (components, pages, routing)
└── shared/             # Shared utilities and types
```

## 🏗️ Architecture

The application follows **Clean Architecture** principles:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External services and API integration
- **Presentation Layer**: UI components and user interaction

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd iot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=IoT Dashboard
```

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔐 Authentication

The application uses JWT authentication with the following features:

- **Login/Logout**: Secure authentication flow
- **Auto-refresh**: Automatic token refresh
- **Protected Routes**: Role-based route protection
- **Persistent Sessions**: Remember user sessions

### User Roles

- **Admin**: Full access to all features including user management
- **User**: Access to devices, sensors, actuators, and automation

## 📱 Pages & Features

### Dashboard
- System overview with key metrics
- Quick actions and recent activity
- Real-time status monitoring

### Devices
- Device list with search and filters
- Device status monitoring
- Add, edit, and delete devices

### Sensors
- Sensor data visualization
- Real-time readings
- Threshold monitoring

### Actuators
- Actuator control interface
- Power consumption tracking
- Status monitoring

### Automation
- Create automation rules
- Trigger and action management
- Rule execution history

### Zones
- Zone-based device organization
- Occupancy tracking
- Zone-specific controls

### Users (Admin Only)
- User management interface
- Role assignment
- User activity monitoring

### Profile
- User profile management
- Notification preferences
- Security settings

## 🎨 UI Components

The application includes a comprehensive set of reusable components:

- **Button**: Multiple variants (primary, secondary, danger, ghost)
- **Input**: Specialized inputs (EmailInput, PasswordInput)
- **Card**: Content containers with headers and bodies
- **Layout**: MainLayout, Header, Sidebar
- **Forms**: LoginForm with validation

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=IoT Dashboard

# Authentication
VITE_JWT_STORAGE_KEY=iot_auth_token
VITE_REFRESH_TOKEN_KEY=iot_refresh_token

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

### Theme Configuration

The application uses a custom Chakra UI theme with:

- Brand colors and typography
- Component-specific styling
- Responsive breakpoints
- Global styles

## 📊 API Integration

The application integrates with a RESTful API for:

- **Authentication**: Login, logout, token refresh
- **Devices**: CRUD operations for IoT devices
- **Sensors**: Sensor data and readings
- **Actuators**: Actuator control and status
- **Automation**: Rule management and execution
- **Users**: User management (admin only)

## 🧪 Testing

The application includes:

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing

Run tests with:
```bash
npm test
```

## 📦 Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

3. Deploy the `dist` folder to your hosting provider

## 🔒 Security

- **JWT Authentication**: Secure token-based authentication
- **HTTPS**: All API calls use HTTPS
- **Input Validation**: Form validation with Zod
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Roadmap

- [ ] Real-time WebSocket integration
- [ ] Advanced charts and analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced automation features
- [ ] Device firmware management
- [ ] Backup and restore functionality

---

Built with ❤️ using modern web technologies
