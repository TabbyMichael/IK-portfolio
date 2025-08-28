import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import About from '../About';

// Mock framer-motion
interface MockMotionProps {
  children: React.ReactNode;
  initial?: unknown;
  animate?: unknown;
  transition?: unknown;
  className?: string;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => <div {...props}>{children}</div>,
  },
}));

// Mock child components
jest.mock('../../components/about/Timeline', () => {
  return function MockTimeline() {
    return (
      <div data-testid="timeline-section">
        <h2>Professional Timeline</h2>
        <div>Career milestones and experience</div>
      </div>
    );
  };
});

jest.mock('../../components/about/SkillBars', () => {
  return function MockSkillBars() {
    return (
      <div data-testid="skill-bars-section">
        <h2>Technical Skills</h2>
        <div>Frontend Development - 90%</div>
        <div>React & React Native - 85%</div>
      </div>
    );
  };
});

jest.mock('../../components/about/Interests', () => {
  return function MockInterests() {
    return (
      <div data-testid="interests-section">
        <h2>Interests & Hobbies</h2>
        <div>Technology, Design, Innovation</div>
      </div>
    );
  };
});

describe('About Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all main sections', () => {
    render(<About />);

    // Verify main about section
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByAltText('Ian Kibugu')).toBeInTheDocument();
    
    // Verify child components
    expect(screen.getByTestId('timeline-section')).toBeInTheDocument();
    expect(screen.getByTestId('skill-bars-section')).toBeInTheDocument();
    expect(screen.getByTestId('interests-section')).toBeInTheDocument();
  });

  it('displays personal information and biography', () => {
    render(<About />);

    expect(screen.getByRole('heading', { level: 1, name: 'About Me' })).toBeInTheDocument();
    expect(screen.getByText(/self-taught developer based in nairobi/i)).toBeInTheDocument();
    expect(screen.getByText(/passion for creating beautiful and functional web applications/i)).toBeInTheDocument();
  });

  it('renders profile image with correct attributes', () => {
    render(<About />);

    const profileImage = screen.getByAltText('Ian Kibugu');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', expect.stringContaining('Leonardo_Phoenix'));
    expect(profileImage).toHaveClass('rounded-lg');
    expect(profileImage).toHaveClass('w-full');
  });

  it('has resume download functionality', () => {
    render(<About />);

    const resumeSelect = screen.getByRole('combobox');
    expect(resumeSelect).toBeInTheDocument();
    expect(screen.getByText('Select Resume')).toBeInTheDocument();
    
    // Check resume options
    expect(screen.getByText('Data Specialist')).toBeInTheDocument();
    expect(screen.getByText('UX/UI Designer')).toBeInTheDocument();
    expect(screen.getByText('General Resume')).toBeInTheDocument();
  });

  it('handles resume download selection', async () => {
    const user = userEvent.setup();
    
    // Mock document methods
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');
    
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn(),
    } as unknown as HTMLAnchorElement;
    
    createElementSpy.mockReturnValue(mockAnchor);
    appendChildSpy.mockImplementation(() => mockAnchor);
    removeChildSpy.mockImplementation(() => mockAnchor);

    render(<About />);

    const resumeSelect = screen.getByRole('combobox');
    await user.selectOptions(resumeSelect, '/Data Specialist.pdf');

    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    // Cleanup
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('has proper responsive layout', () => {
    const { container } = render(<About />);

    // Check responsive grid layout
    const gridContainer = container.querySelector('.grid-cols-1.md\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();

    // Check responsive padding and margins
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toHaveClass('px-4');
    expect(mainContainer).toHaveClass('sm:px-6');
    expect(mainContainer).toHaveClass('lg:px-8');
  });

  it('renders professional timeline section', () => {
    render(<About />);

    expect(screen.getByTestId('timeline-section')).toBeInTheDocument();
    expect(screen.getByText('Professional Timeline')).toBeInTheDocument();
  });

  it('renders skills section with progress bars', () => {
    render(<About />);

    expect(screen.getByTestId('skill-bars-section')).toBeInTheDocument();
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    expect(screen.getByText(/frontend development.*90%/i)).toBeInTheDocument();
  });

  it('renders interests and hobbies section', () => {
    render(<About />);

    expect(screen.getByTestId('interests-section')).toBeInTheDocument();
    expect(screen.getByText('Interests & Hobbies')).toBeInTheDocument();
  });

  it('has proper page structure and spacing', () => {
    const { container } = render(<About />);

    const pageContainer = container.firstChild as HTMLElement;
    expect(pageContainer).toHaveClass('pt-20');
    expect(pageContainer).toHaveClass('pb-20');

    const glassContainer = container.querySelector('.glass');
    expect(glassContainer).toHaveClass('p-8');
    expect(glassContainer).toHaveClass('rounded-lg');
    expect(glassContainer).toHaveClass('mb-20');
  });

  it('displays all resume options with correct values', () => {
    render(<About />);

    const dataSpecialistOption = screen.getByDisplayValue('/Data Specialist.pdf');
    const uxuiOption = screen.getByDisplayValue('/UXUI.pdf');
    const generalOption = screen.getByDisplayValue('/Kibugu ian (1).pdf');

    expect(dataSpecialistOption).toBeInTheDocument();
    expect(uxuiOption).toBeInTheDocument();
    expect(generalOption).toBeInTheDocument();
  });

  it('has proper semantic structure', () => {
    render(<About />);

    // Check heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('About Me');

    // Check image alt text for accessibility
    const profileImage = screen.getByRole('img');
    expect(profileImage).toHaveAccessibleName('Ian Kibugu');
  });

  it('renders biography with personal details', () => {
    render(<About />);

    expect(screen.getByText(/nairobi, kenya/i)).toBeInTheDocument();
    expect(screen.getByText(/self-taught developer/i)).toBeInTheDocument();
    expect(screen.getByText(/curiosity.*continuous learning/i)).toBeInTheDocument();
  });
});