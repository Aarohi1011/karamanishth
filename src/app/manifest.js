export default function manifest() {
  return {
    name: 'Karmnisth - Employee Management System',
    short_name: 'Karmnisth',
    description: 'A app to manage the Employee and automate Payroll System',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FFFFFF',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}