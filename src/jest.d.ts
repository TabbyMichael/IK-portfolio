/// <reference types="@testing-library/jest-dom" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attribute: string, value?: string): R;
      toBeDisabled(): R;
      toHaveValue(value: string | number): R;
      toBeVisible(): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveDisplayValue(value: string | string[]): R;
      toHaveFormValues(values: Record<string, unknown>): R;
      toHaveStyle(style: string | Record<string, unknown>): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveErrorMessage(message: string | RegExp): R;
      toHaveDescription(description: string | RegExp): R;
      toHaveAccessibleName(name: string | RegExp): R;
      toHaveAccessibleDescription(description: string | RegExp): R;
    }
  }
}

export {};