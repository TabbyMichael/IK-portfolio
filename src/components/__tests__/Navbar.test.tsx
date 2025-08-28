import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Navbar from '../Navbar';

// Mock framer-motion
interface MockMotionProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Helper function to filter framer-motion props
const filterMotionProps = (props: MockMotionProps) => {
  const motionProps = ['initial', 'animate', 'exit', 'whileHover', 'whileTap', 'transition'];
  const filteredProps: Record<string, unknown> = {};
  
  Object.keys(props).forEach(key => {
    if (!motionProps.includes(key)) {
      filteredProps[key] = props[key];
    }
  });
  
  return filteredProps;
};

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => {
      const htmlProps = filterMotionProps(props);
      return <div {...htmlProps}>{children}</div>;
    },
    button: ({ children, ...props }: MockMotionProps) => {
      const htmlProps = filterMotionProps(props);
      return <button {...htmlProps}>{children}</button>;
    },
  },
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('Navbar', () => {
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up body styles
    document.body.style.overflow = 'unset';
  });

  it('renders navigation links', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    expect(screen.getByText('IK')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to home page/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to about page/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to projects showcase/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to newsletter signup/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /navigate to contact page/i })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toBeInTheDocument();

    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveClass('sr-only');
  });

  it('toggles mobile menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText(/open menu/i);
    expect(menuButton).toBeInTheDocument();

    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    });

    // Should prevent body scroll when menu is open
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(screen.getByLabelText(/close menu/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
    });

    // Should restore body scroll when menu is closed
    expect(document.body.style.overflow).toBe('unset');
  });

  it('closes mobile menu when escape key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText(/open menu/i);
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    });

    // Focus the menu to ensure event listeners are active
    const mobileMenu = screen.getByRole('dialog');
    mobileMenu.focus();

    // Send escape key event directly to document
    await user.keyboard('{Escape}');
    
    // Give a bit more time for the async event handling
    await waitFor(() => {
      expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('highlights active navigation item', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Since we're on the root path by default in tests, check that Home is active
    // Use a more specific selector to find the desktop navigation Home link
    const homeLink = screen.getByRole('link', { name: /navigate to home page/i });
    expect(homeLink).toHaveClass('text-accent');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('has proper focus management', async () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    const skipLink = screen.getByText('Skip to main content');
    
    // Test initial state
    expect(skipLink).toHaveClass('sr-only');
    
    // Focus skip link using focus() method instead of click
    skipLink.focus();
    
    // Wait for focus event to be processed
    await waitFor(() => {
      expect(skipLink).not.toHaveClass('sr-only');
    });
    
    // Blur skip link by focusing another element
    const menuButton = screen.getByLabelText(/open menu/i);
    menuButton.focus();
    
    await waitFor(() => {
      expect(skipLink).toHaveClass('sr-only');
    });
  });

  it('closes mobile menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    const menuButton = screen.getByLabelText(/open menu/i);
    await user.click(menuButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
    });

    // The mobile menu has an overlay div that closes the menu when clicked
    // Let's find and click it directly
    const overlay = document.querySelector('.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
    
    if (overlay) {
      await user.click(overlay as Element);
    }

    await waitFor(() => {
      expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('includes theme toggle component', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Theme toggle should be present (assuming it has a recognizable element)
    // This depends on the ThemeToggle component implementation
    const themeToggle = screen.getAllByRole('button');
    expect(themeToggle.length).toBeGreaterThan(1); // Menu button + theme toggle
  });

  it('has proper ARIA labels for navigation links', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/navigate to home page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/navigate to about page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/navigate to projects showcase/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/navigate to newsletter signup/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/navigate to contact page/i)).toBeInTheDocument();
  });
});