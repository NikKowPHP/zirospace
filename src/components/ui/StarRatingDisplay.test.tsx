import React from 'react';
import { render, screen } from '@testing-library/react';
import StarRatingDisplay from './StarRatingDisplay'; // Adjust the import path as needed

describe('StarRatingDisplay', () => {
  test('renders the correct number of full stars for an integer rating', () => {
    render(<StarRatingDisplay rating={4} />);
    const fullStars = screen.queryAllByTestId('full-star'); // Assuming you add data-testid="full-star" to your full star SVG
    expect(fullStars).toHaveLength(4);
    const halfStars = screen.queryAllByTestId('half-star'); // Assuming you add data-testid="half-star" to your half star SVG
    expect(halfStars).toHaveLength(0);
    const emptyStars = screen.queryAllByTestId('empty-star'); // Assuming you add data-testid="empty-star" to your empty star SVG
    expect(emptyStars).toHaveLength(1); // maxRating defaults to 5
  });

  test('renders a half star for a decimal rating', () => {
    render(<StarRatingDisplay rating={3.5} />);
    const fullStars = screen.queryAllByTestId('full-star');
    expect(fullStars).toHaveLength(3);
    const halfStars = screen.queryAllByTestId('half-star');
    expect(halfStars).toHaveLength(1);
    const emptyStars = screen.queryAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(1); // 5 - 3 - 1 = 1
  });

  test('renders no stars for a rating of 0', () => {
    render(<StarRatingDisplay rating={0} />);
    const fullStars = screen.queryAllByTestId('full-star');
    expect(fullStars).toHaveLength(0);
    const halfStars = screen.queryAllByTestId('half-star');
    expect(halfStars).toHaveLength(0);
    const emptyStars = screen.queryAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(5); // maxRating defaults to 5
  });

  test('renders the correct number of stars with a custom maxRating', () => {
    render(<StarRatingDisplay rating={2} maxRating={10} />);
    const fullStars = screen.queryAllByTestId('full-star');
    expect(fullStars).toHaveLength(2);
    const halfStars = screen.queryAllByTestId('half-star');
    expect(halfStars).toHaveLength(0);
    const emptyStars = screen.queryAllByTestId('empty-star');
    expect(emptyStars).toHaveLength(8); // 10 - 2 = 8
  });
});
