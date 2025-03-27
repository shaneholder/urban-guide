# Azure Login Application

This application allows users to authenticate with Azure AD and view their Azure resources.

## Azure AD Configuration

1. Go to the Azure Portal (https://portal.azure.com)
2. Navigate to "Azure Active Directory" > "App registrations"
3. Click "New registration"
4. Configure the application:
   - Name: `Azure Resource Viewer` (or your preferred name)
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: `http://localhost:5173` (Vite's default port)
   - Click "Register"

5. After registration, note down:
   - Application (client) ID
   - Directory (tenant) ID

6. Configure API permissions:
   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Azure Service Management"
   - Select "user_impersonation"
   - Click "Add permissions"
   - Click "Grant admin consent"

7. Configure Authentication:
   - Go to "Authentication"
   - Under "Platform configurations", verify the SPA redirect URI
   - Enable "Access tokens" and "ID tokens"
   - Save changes

## Application Setup

1. Clone this repository
2. Create a `.env` file in the root directory:
   ```
   VITE_AZURE_CLIENT_ID=your_client_id
   VITE_AZURE_TENANT_ID=your_tenant_id
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## Features

- Azure AD authentication
- View Azure subscriptions and resources
- Single-page application with TypeScript
- Express.js backend for secure API calls

## Development

- Frontend: React + TypeScript + Vite
- Backend: Express.js + TypeScript
- Authentication: MSAL (Microsoft Authentication Library)

## Important Notes

- Ensure you have appropriate Azure Role-Based Access Control (RBAC) permissions
- Keep your client ID and tenant ID secure
- For production, add appropriate error handling and security measures
- Update the redirect URI in Azure AD when deploying to production
