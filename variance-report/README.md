# Variance Report Generator

A Microsoft Teams application for generating detailed P&L variance reports with AI-powered descriptions.

## Features

- Generate detailed variance reports for P&L statements
- AI-powered description generation using Cohere
- Microsoft Teams integration
- Export reports to Word documents
- Customizable cost categories

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- Microsoft Teams account
- Cohere API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/variance-report.git
cd variance-report
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
VITE_COHERE_API_KEY=your_cohere_api_key_here
HTTPS_KEY=path_to_ssl_key
HTTPS_CERT=path_to_ssl_certificate
```

4. For local development, generate SSL certificates:
```bash
mkcert localhost
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `https://localhost:3000`

## Building for Production

```bash
npm run build
```

## Deployment

This application can be deployed to:
- Azure Static Web Apps
- Azure App Service
- Vercel
- Other static hosting providers

See the deployment documentation for more details.

## Teams Integration

1. Register the app in the Microsoft Teams Developer Portal
2. Update the `manifest.json` with your app details
3. Deploy the application to a hosting provider
4. Install the app in Teams

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
