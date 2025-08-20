export default function manifest() {
  return {
    name: 'karmanishth - Employee Management System',
    short_name: 'karmanishth',
    description: 'A app to manage the Employee and automate Payroll System',
    start_url: '/',
    display: 'standalone',
    background_color: '#06202b',
    theme_color: '#06202b',
    icons: [
      {
        src: '/favicon-196.png',
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