import { render, screen } from '@testing-library/react';
import FooterComponent from '@/components/footerComponent';

describe('FooterComponent', () => {
  it('devrait afficher le texte "By Anthony Bauchet"', () => {
    render(<FooterComponent />);
    const textElement = screen.getByText(/By Anthony Bauchet/i);
    expect(textElement).toBeInTheDocument();
  });

  it('devrait avoir la classe bg-gray-800 sur le footer', () => {
    render(<FooterComponent />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('bg-gray-800');
  });

  it('devrait avoir un texte en blanc', () => {
    render(<FooterComponent />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('text-white');
  });
});
