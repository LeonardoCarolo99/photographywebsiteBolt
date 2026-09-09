const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
];

export function preloadFonts() {
  FONT_URLS.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });
}
