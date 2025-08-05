import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuración de Playwright para QA automatizado
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reportes de pruebas
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['list']
  ],
  
  // Configuración global
  use: {
    baseURL: process.env.API_BASE_URL || 'https://api.example.com',
    actionTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Proyectos de pruebas
  projects: [
    {
      name: 'API Tests',
      testMatch: '**/api/**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    
    {
      name: 'Smoke Tests',
      testMatch: '**/*.smoke.spec.js',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  // Output directory para archivos de prueba
  outputDir: 'test-artifacts/',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});
