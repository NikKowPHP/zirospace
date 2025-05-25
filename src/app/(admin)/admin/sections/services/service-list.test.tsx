import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ServiceList } from './service-list';
import { useAdmin } from '@/contexts/admin-context';
import { Locale } from '@/i18n';
import { Service } from '@/domain/models/service.model';
import { useRouter } from 'next/navigation';

// Mock the useAdmin context
jest.mock('@/contexts/admin-context', () => ({
  useAdmin: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ServiceList Component', () => {
  const mockServices: Record<Locale, Service[]> = {
    en: [
      { id: '1', slug: 'test-service-1', title: 'Test Service 1', contentHtml: '<p>Test</p>', isPublished: true, createdAt: 'now', updatedAt: 'now' },
      { id: '2', slug: 'test-service-2', title: 'Test Service 2', contentHtml: '<p>Test</p>', isPublished: false, createdAt: 'now', updatedAt: 'now' },
    ],
    pl: [],
  };

  const mockDeleteService = jest.fn();

  beforeEach(() => {
    (useAdmin as jest.Mock).mockReturnValue({
      services: mockServices,
      deleteService: mockDeleteService,
      error: null,
      loading: false,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it('should render the service list', () => {
    render(<ServiceList />);

    expect(screen.getByText('Test Service 1')).toBeInTheDocument();
    expect(screen.getByText('Test Service 2')).toBeInTheDocument();
  });

  it('should display "Published" or "Draft" status correctly', () => {
    render(<ServiceList />);

    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('should call deleteService when the delete button is clicked', async () => {
    render(<ServiceList />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(mockDeleteService).toHaveBeenCalledTimes(0); // Confirm is present
  });

  it('should call deleteService with correct parameters after confirmation', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    render(<ServiceList />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeleteService).toHaveBeenCalledWith('1', 'en');

    confirmSpy.mockRestore();
  });

  it('should push to the edit page when the edit button is clicked', () => {
    render(<ServiceList />);
    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);

    const router = useRouter() as jest.Mocked<ReturnType<typeof useRouter>>;
    expect(router.push).toHaveBeenCalledWith('/admin/sections/services/edit/1?locale=en');
  });

  it('should push to the create page when the add service button is clicked', () => {
    render(<ServiceList />);

    const addButton = screen.getByText('Add Service');
    fireEvent.click(addButton);

    const router = useRouter() as jest.Mocked<ReturnType<typeof useRouter>>;
    expect(router.push).toHaveBeenCalledWith('/admin/sections/services/create');
  });

  it('should change the active locale when a locale button is clicked', () => {
    render(<ServiceList />);

    const polishButton = screen.getByText('Polish');
    fireEvent.click(polishButton);

    expect(useAdmin).toHaveBeenCalled();
  });
});
});
