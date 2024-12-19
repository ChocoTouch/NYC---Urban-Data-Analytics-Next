import { render, screen } from '@testing-library/react';
import HeaderComponent from '@/components/headerComponent'; 

describe('HeaderComponent', () => {
  it('devrait afficher le titre "NYC - Urban Data Analytics"', () => {
    render(<HeaderComponent />);

    const titleElement = screen.getByText(/NYC - Urban Data Analytics/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('devrait avoir la classe bg-blue-900 sur le header', () => {
    render(<HeaderComponent />);

    const headerElement = screen.getByRole('banner'); 
    expect(headerElement).toHaveClass('bg-blue-900');
  });

  it('devrait avoir un texte en blanc et une taille de texte correcte', () => {
    render(<HeaderComponent />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('text-white');
  });
});