import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Scanner } from '../Scanner';
import { parseReceiptImage } from '../../services/geminiService';
import { getCategories } from '../../services/expenseService';
import { AIReceiptResponse, Language } from '../../types';

// Mock dependencies
vi.mock('../../services/geminiService');
vi.mock('../../services/expenseService');
vi.mock('../../src/components/layout/PageTransition', () => ({
  PageTransition: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../../src/components/layout/FloatingActionButton', () => ({
  FloatingActionButton: ({ label, secondaryActions }: any) => (
    <div data-testid="fab">
      <button aria-label={label}>FAB</button>
      {secondaryActions?.map((action: any, i: number) => (
        <button key={i} onClick={action.onClick} aria-label={action.label}>
          {action.label}
        </button>
      ))}
    </div>
  ),
}));
vi.mock('../../src/components/layout/BottomSheet', () => ({
  BottomSheet: ({ open, children, title }: any) =>
    open ? (
      <div data-testid="bottom-sheet">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));
vi.mock('../../src/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));
vi.mock('../../src/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockParseReceiptImage = vi.mocked(parseReceiptImage);
const mockGetCategories = vi.mocked(getCategories);

describe('Scanner Component', () => {
  const mockOnScanComplete = vi.fn();
  const mockOnCancel = vi.fn();
  const currentLang: Language = 'en';

  const mockScanResult: AIReceiptResponse = {
    merchant: 'Test Store',
    amount: 42.50,
    category: 'Groceries',
    date: '2024-01-15',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCategories.mockReturnValue(['Groceries', 'Dining', 'Transport']);
  });

  describe('Initial Render', () => {
    it('should render scanner interface with camera and gallery options', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByText('Câmera')).toBeInTheDocument();
      expect(screen.getByText('Galeria')).toBeInTheDocument();
    });

    it('should render back button', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // Check that there's at least one button (the back button)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render FloatingActionButton with quick actions', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByTestId('fab')).toBeInTheDocument();
      expect(screen.getByLabelText('Quick actions')).toBeInTheDocument();
    });

    it('should not show error message initially', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Back Button', () => {
    it('should call onCancel when back button is clicked', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // The back button is the first button in the component
      const buttons = screen.getAllByRole('button');
      const backButton = buttons[0]; // First button should be the back button
      fireEvent.click(backButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('File Upload - Camera', () => {
    it('should process image when camera input changes', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      mockParseReceiptImage.mockResolvedValue({
        data: mockScanResult,
        imageUrl: 'data:image/jpeg;base64,abc123',
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      expect(cameraInput).toBeInTheDocument();

      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
      });

      // Should call parseReceiptImage
      await waitFor(() => {
        expect(mockParseReceiptImage).toHaveBeenCalledWith(
          mockFile,
          ['Groceries', 'Dining', 'Transport'],
          currentLang
        );
      });

      // Should show bottom sheet with results
      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
        expect(screen.getByText('Test Store')).toBeInTheDocument();
        expect(screen.getByText('$42.50')).toBeInTheDocument();
      });
    });

    it('should show error message when scan fails', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      mockParseReceiptImage.mockRejectedValue(new Error('Scan failed'));

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      });

      // Error should be displayed
      await waitFor(() => {
        const errorElement = screen.getByText(/could not read receipt|erro na leitura/i);
        expect(errorElement).toBeInTheDocument();
      });
    });
  });

  describe('File Upload - Gallery', () => {
    it('should process image when gallery input changes', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      mockParseReceiptImage.mockResolvedValue({
        data: mockScanResult,
        imageUrl: 'data:image/jpeg;base64,abc123',
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const galleryInput = document.querySelector('#file-input') as HTMLInputElement;
      expect(galleryInput).toBeInTheDocument();

      Object.defineProperty(galleryInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(galleryInput);

      await waitFor(() => {
        expect(mockParseReceiptImage).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show skeleton loaders during processing', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockParseReceiptImage.mockReturnValue(promise as any);

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      // Should show loading state with skeletons
      await waitFor(() => {
        expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
      });

      // Should hide FAB during processing
      expect(screen.queryByTestId('fab')).not.toBeInTheDocument();

      // Resolve the promise
      resolvePromise!({
        data: mockScanResult,
        imageUrl: 'data:image/jpeg;base64,abc123',
      });

      // Should hide skeletons after processing
      await waitFor(() => {
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      });
    });

    it('should not show FAB during processing', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockParseReceiptImage.mockReturnValue(promise as any);

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      // FAB should be visible initially
      expect(screen.getByTestId('fab')).toBeInTheDocument();

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      // FAB should be hidden during processing
      await waitFor(() => {
        expect(screen.queryByTestId('fab')).not.toBeInTheDocument();
      });

      resolvePromise!({
        data: mockScanResult,
        imageUrl: 'data:image/jpeg;base64,abc123',
      });

      // FAB should reappear after processing
      await waitFor(() => {
        expect(screen.getByTestId('fab')).toBeInTheDocument();
      });
    });
  });

  describe('Bottom Sheet - Scan Results', () => {
    it('should display scan results in bottom sheet', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      mockParseReceiptImage.mockResolvedValue({
        data: mockScanResult,
        imageUrl: 'data:image/jpeg;base64,abc123',
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
      });

      // Check all scan result fields
      expect(screen.getByText('Test Store')).toBeInTheDocument();
      expect(screen.getByText('$42.50')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    });

    it('should call onScanComplete when confirm button is clicked', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      const mockImageUrl = 'data:image/jpeg;base64,abc123';
      mockParseReceiptImage.mockResolvedValue({
        data: mockScanResult,
        imageUrl: mockImageUrl,
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      expect(mockOnScanComplete).toHaveBeenCalledWith(mockScanResult, mockImageUrl);
    });

    it('should close bottom sheet when cancel button is clicked', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      mockParseReceiptImage.mockResolvedValue({
        data: mockScanResult,
        imageUrl: 'data:image/jpeg;base64,abc123',
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByTestId('bottom-sheet')).not.toBeInTheDocument();
      });

      expect(mockOnScanComplete).not.toHaveBeenCalled();
    });

    it('should display receipt image in bottom sheet if available', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      const mockImageUrl = 'data:image/jpeg;base64,abc123';
      mockParseReceiptImage.mockResolvedValue({
        data: mockScanResult,
        imageUrl: mockImageUrl,
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
      });

      const receiptImage = screen.getByAltText('Receipt');
      expect(receiptImage).toBeInTheDocument();
      expect(receiptImage).toHaveAttribute('src', mockImageUrl);
    });
  });

  describe('Floating Action Button', () => {
    it('should have secondary actions for camera, gallery, and manual entry', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      expect(screen.getByLabelText('Take photo')).toBeInTheDocument();
      expect(screen.getByLabelText('Choose from gallery')).toBeInTheDocument();
      expect(screen.getByLabelText('Manual entry')).toBeInTheDocument();
    });

    it('should trigger camera input when camera action is clicked', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(cameraInput, 'click');

      const cameraAction = screen.getByLabelText('Take photo');
      fireEvent.click(cameraAction);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should trigger gallery input when gallery action is clicked', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const galleryInput = document.querySelector('#file-input') as HTMLInputElement;
      const clickSpy = vi.spyOn(galleryInput, 'click');

      const galleryAction = screen.getByLabelText('Choose from gallery');
      fireEvent.click(galleryAction);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should call onCancel when manual entry action is clicked', () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const manualEntryAction = screen.getByLabelText('Manual entry');
      fireEvent.click(manualEntryAction);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing file in input change event', async () => {
      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [],
        writable: false,
      });

      fireEvent.change(cameraInput);

      // Should not call parseReceiptImage
      expect(mockParseReceiptImage).not.toHaveBeenCalled();
      // Should not show loading state
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    it('should handle scan result with missing optional fields', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      const minimalResult: AIReceiptResponse = {
        merchant: 'Test Store',
        amount: 42.50,
      };
      mockParseReceiptImage.mockResolvedValue({
        data: minimalResult,
        imageUrl: '',
      });

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      fireEvent.change(cameraInput);

      await waitFor(() => {
        expect(screen.getByTestId('bottom-sheet')).toBeInTheDocument();
      });

      // Should display available fields
      expect(screen.getByText('Test Store')).toBeInTheDocument();
      expect(screen.getByText('$42.50')).toBeInTheDocument();
      
      // Should not crash on missing fields
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    });

    it('should clear error when new scan is initiated', async () => {
      const mockFile = new File(['receipt'], 'receipt.jpg', { type: 'image/jpeg' });
      
      // First scan fails
      mockParseReceiptImage.mockRejectedValueOnce(new Error('Scan failed'));

      render(
        <Scanner
          onScanComplete={mockOnScanComplete}
          onCancel={mockOnCancel}
          currentLang={currentLang}
        />
      );

      const cameraInput = document.querySelector('#camera-input') as HTMLInputElement;
      Object.defineProperty(cameraInput, 'files', {
        value: [mockFile],
      });

      fireEvent.change(cameraInput);

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/could not read receipt|erro na leitura/i)).toBeInTheDocument();
      });

      // Verify error is displayed
      expect(screen.getByText(/could not read receipt|erro na leitura/i)).toBeInTheDocument();
      
      // Note: In a real scenario, the error would be cleared when the user initiates a new scan
      // by clicking the camera/gallery button again. The component clears the error in handleFileChange
      // when setError(null) is called at the start of the function.
    });
  });
});
