import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCart from "@/components/products/ProductCart";
import { Product } from "@/components/products/Product";

describe("ProductCart Pagination", () => {
  const products: Product[] = Array.from({ length: 15 }, (_, i) => ({
    name: `Product ${i + 1}`,
    description: `Description ${i + 1}`,
    image: `http://example.com/image${i + 1}.jpg`,
    quantity: 1,
    price: 10.00,
  }));

  test("should render pagination controls when there are enough items", () => {
    render(<ProductCart items={products} onRemoveFromCart={() => {}}  onCheckout={() => { }}  />);

    // Check if pagination controls are rendered
    expect(screen.getByRole("button", { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  test("should display the correct items on each page", () => {
    render(<ProductCart items={products} onRemoveFromCart={() => {}} onCheckout={() => { }}  />);

    // Assume default items per page is 10
    const itemsPerPage = 3;
    
    // Check that the first page displays the first 10 products
    products.slice(0, itemsPerPage).forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
    products.slice(itemsPerPage).forEach(product => {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument();
    });

    // Navigate to the second page
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    // Check that the second page displays the remaining products
    products.slice(itemsPerPage,itemsPerPage+itemsPerPage).forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
    products.slice(0, itemsPerPage).forEach(product => {
      expect(screen.queryByText(product.name)).not.toBeInTheDocument();
    });
  });

  test("should handle pagination limits correctly", () => {
    // Assume items per page is 5
    const limitedProducts = Array.from({ length: 12 }, (_, i) => ({
      name: `Product ${i + 1}`,
      description: `Description ${i + 1}`,
      image: `http://example.com/image${i + 1}.jpg`,
      quantity: 1,
      price: 10.00,
    }));

   const handleRemoveFromCart = jest.fn();

    render(<ProductCart items={products} onRemoveFromCart={handleRemoveFromCart} onCheckout={() => { }} />);

    // Check if only the first page of items is displayed
    expect(screen.getAllByText(/Product \d+/).length).toBe(3); 

    // Check the pagination controls
    const nextPageButton = screen.getByRole("button", { name: /Next Page/i });
    expect(nextPageButton).toBeEnabled();

    // Go to the next page
    fireEvent.click(nextPageButton);

    // Check if the next page of items is displayed
    expect(screen.getAllByText(/Product \d+/).length).toBe(3); 

    // Check the "Previous" button is enabled
    const prevPageButton = screen.getByRole("button", { name: /Previous Page/i });
    expect(prevPageButton).toBeEnabled();

    // Go to the last page
    fireEvent.click(nextPageButton); 

    // Check if the last page of items is displayed
    expect(screen.getAllByText(/Product \d+/).length).toBe(3); 

     // Go to the last page
    fireEvent.click(nextPageButton); 
    fireEvent.click(nextPageButton); 

    // Check if the last page of items is displayed
    expect(screen.getAllByText(/Product \d+/).length).toBe(3); 
    expect(prevPageButton).toBeEnabled();

    // Ensure "Next Page" button is disabled on the last page
    expect(screen.getByRole("button", { name: /Next Page/i })).toBeDisabled();

    // Go back to the previous page
    fireEvent.click(prevPageButton);

    // Check if returning to the previous page works correctly
    expect(screen.getAllByText(/Product \d+/).length).toBe(3); 
    expect(screen.getByRole("button", { name: /Next Page/i })).toBeEnabled();
  });

  test("should display the Checkout button when there are items in the cart", () => {
    render(<ProductCart items={products} onRemoveFromCart={() => { } } onCheckout={() => { }} />);

    // Check if the Checkout button is displayed
    expect(screen.getByRole("button", { name: /Checkout/i })).toBeInTheDocument();
  });

  test("should not display the Checkout button when there are no items in the cart", () => {
    render(<ProductCart items={[]} onRemoveFromCart={() => { } } onCheckout={() => { }} />);

    // Check if the Checkout button is not displayed
    expect(screen.queryByRole("button", { name: /Checkout/i })).not.toBeInTheDocument();
  });
});
