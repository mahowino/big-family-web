import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductPage from "@/components/screens/ProductPage";
import { Product } from "@/components/products/Product";
import { useRouter } from "next/router";

// Mock the useRouter hook from next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

describe("Products Page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("should render the products form and its elements", () => {
    render(<ProductPage />);

    // Check if the form and its fields are rendered
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Price/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Item to Cart/i })
    ).toBeInTheDocument();
  });

  test("should render a list of cart items", () => {
    // Render the ProductPage with an initial cart state
    render(<ProductPage />);

    // Add a product to the cart
    const product: Product = {
      name: "Test Product",
      description: "Test Description",
      image: "http://example.com/image.jpg",
      quantity: 1,
      price: 9.99,
    };

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: product.name },
    });
    fireEvent.change(screen.getByLabelText(/Product Description/i), {
      target: { value: product.description },
    });
    fireEvent.change(screen.getByLabelText(/Product Image/i), {
      target: { value: product.image },
    });
    fireEvent.change(screen.getByLabelText(/Product Quantity/i), {
      target: { value: product.quantity.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Product Price/i), {
      target: { value: product.price.toString() },
    });

    // Click the "Add Item to Cart" button
    fireEvent.click(screen.getByRole("button", { name: /Add Item to Cart/i }));

    // Check if the cart item list is rendered
    expect(screen.getByTestId("cart-items-list")).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText(`Quantity: ${product.quantity}`)).toBeInTheDocument();
    expect(screen.getByText(`Price: KES ${product.price.toFixed(2)}`)).toBeInTheDocument();
  });

  test("should add items from the form to the cart", () => {
    render(<ProductPage />);

    // Fill in and submit the form to add an item
    const product: Product = {
      name: "Test Product",
      description: "Test Description",
      image: "http://example.com/image.jpg",
      quantity: 1,
      price: 9.99,
    };

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: product.name },
    });
    fireEvent.change(screen.getByLabelText(/Product Description/i), {
      target: { value: product.description },
    });
    fireEvent.change(screen.getByLabelText(/Product Image/i), {
      target: { value: product.image },
    });
    fireEvent.change(screen.getByLabelText(/Product Quantity/i), {
      target: { value: product.quantity.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Product Price/i), {
      target: { value: product.price.toString() },
    });

    // Click the "Add Item to Cart" button
    fireEvent.click(screen.getByRole("button", { name: /Add Item to Cart/i }));

    // Check if the item is added to the cart
    expect(screen.getByTestId("cart-items-list")).toHaveTextContent(product.name);
    expect(screen.getByTestId("cart-items-list")).toHaveTextContent(product.description);
    expect(screen.getByTestId("cart-items-list")).toHaveTextContent(`${product.quantity}`);
    expect(screen.getByTestId("cart-items-list")).toHaveTextContent(`${product.price.toFixed(2)}`);
  });

  test("should remove an item from the cart", () => {
    render(<ProductPage />);

    // Add a product to the cart
    const product: Product = {
      name: "Test Product",
      description: "Test Description",
      image: "http://example.com/image.jpg",
      quantity: 1,
      price: 9.99,
    };

    // Fill in and submit the form to add an item
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: product.name },
    });
    fireEvent.change(screen.getByLabelText(/Product Description/i), {
      target: { value: product.description },
    });
    fireEvent.change(screen.getByLabelText(/Product Image/i), {
      target: { value: product.image },
    });
    fireEvent.change(screen.getByLabelText(/Product Quantity/i), {
      target: { value: product.quantity.toString() },
    });
    fireEvent.change(screen.getByLabelText(/Product Price/i), {
      target: { value: product.price.toString() },
    });

    // Click the "Add Item to Cart" button
    fireEvent.click(screen.getByRole("button", { name: /Add Item to Cart/i }));

    // Check if the item is in the cart
    expect(screen.getByText(product.name)).toBeInTheDocument();

    // Remove the item
    fireEvent.click(screen.getByRole("button", { name: /Delete Item/i }));

    // Check if the item is removed from the cart
    expect(screen.queryByText(product.name)).not.toBeInTheDocument();
  });

  test("should show the total price of cart items", () => {
    render(<ProductPage />);

    // Add multiple products to the cart
    const products: Product[] = [
      { name: "Product 1", description: "Description 1", image: "http://example.com/image1.jpg", quantity: 2, price: 10.00 },
      { name: "Product 2", description: "Description 2", image: "http://example.com/image2.jpg", quantity: 1, price: 20.00 }
    ];

    // Add products to the cart
    products.forEach(product => {
      fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: product.name } });
      fireEvent.change(screen.getByLabelText(/Product Description/i), { target: { value: product.description } });
      fireEvent.change(screen.getByLabelText(/Product Image/i), { target: { value: product.image } });
      fireEvent.change(screen.getByLabelText(/Product Quantity/i), { target: { value: product.quantity.toString() } });
      fireEvent.change(screen.getByLabelText(/Product Price/i), { target: { value: product.price.toString() } });
      fireEvent.click(screen.getByRole("button", { name: /Add Item to Cart/i }));
    });

    // Check if the total price is calculated correctly
    const totalPrice = products.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
    expect(screen.getByTestId("cart-total")).toHaveTextContent(`Total: KES ${totalPrice}`);
  });

  test("should not allow empty or invalid inputs", () => {
    render(<ProductPage />);

    // Clear all fields (assuming form has validation)
    fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Product Description/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Product Image/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Product Quantity/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Product Price/i), { target: { value: "" } });

    // Try to submit the form
    fireEvent.click(screen.getByRole("button", { name: /Add Item to Cart/i }));

    // Check for error messages or validation feedback
    expect(screen.getByText(/Product Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Image URL is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Product Quantity must be greater than zero./i)).toBeInTheDocument();
    expect(screen.getByText(/Product Price must be greater than zero./i)).toBeInTheDocument();

    // Test invalid quantity and price
    fireEvent.change(screen.getByLabelText(/Product Quantity/i), { target: { value: "-1" } });
    fireEvent.change(screen.getByLabelText(/Product Price/i), { target: { value: "invalid" } });

    // Try to submit the form again
    fireEvent.click(screen.getByRole("button", { name: /Add Item to Cart/i }));

    // Check for specific invalid input error messages
    expect(screen.getByText(/Product Quantity must be greater than zero/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Price must be greater than zero/i)).toBeInTheDocument();
  });
});
