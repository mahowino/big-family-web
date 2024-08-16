// tests/checkout.test.tsx
import CheckoutPage from '@/components/screens/CheckoutPage';
import { render, fireEvent, getAllByTestId, getAllByText } from '@testing-library/react';

describe('CheckoutPage', () => {
  const products = [
    { id: 1, name: 'Product 1', price: 100, quantity: 1 },
    { id: 2, name: 'Product 2', price: 200, quantity: 2 },
  ];
  const serviceFee = 5.00; // Fixed service fee
  const deliveryFee = 100; // Variable delivery fee

  it('should render the products with their quantities', () => {
    const { getByText } = render(<CheckoutPage products={products} serviceFee={serviceFee} deliveryFee={deliveryFee} />);

    expect(getByText('Product 1')).toBeInTheDocument();
    expect(getByText('Product 2')).toBeInTheDocument();
    expect(getByText('Quantity: 1')).toBeInTheDocument();
    expect(getByText('Quantity: 2')).toBeInTheDocument();
  });

   it('should increment the product quantity', () => {
    const { getByTestId } = render(
      <CheckoutPage products={products} serviceFee={serviceFee} deliveryFee={deliveryFee} />
    );

    const incrementButton = getByTestId('increment-button-1');
    fireEvent.click(incrementButton);

    // Using the unique test ID to verify the quantity of the specific product
    expect(getByTestId('product-quantity-1').textContent).toBe('Quantity: 2');
  });

   it('should decrement the product quantity', () => {
    const { getByTestId } = render(
      <CheckoutPage products={products} serviceFee={serviceFee} deliveryFee={deliveryFee} />
    );

    const decrementButton = getByTestId('decrement-button-2');
    fireEvent.click(decrementButton);

    // Using the unique test ID to verify the quantity of the specific product
    expect(getByTestId('product-quantity-2').textContent).toBe('Quantity: 1');
  });
  it('should not decrement the product quantity below 1', () => {
    const { getByTestId, getByText } = render(<CheckoutPage products={products} serviceFee={serviceFee} deliveryFee={deliveryFee} />);
    
    const decrementButton = getByTestId('decrement-button-1');
    fireEvent.click(decrementButton);

    expect(getByText('Quantity: 1')).toBeInTheDocument();
  });

    it('should calculate the total price correctly', () => {
    const { getByTestId } = render(
      <CheckoutPage products={products} serviceFee={serviceFee} deliveryFee={deliveryFee} />
    );

    expect(getByTestId('total-price').textContent).toBe('Total: KES 650.00');
  });

  it('should render products and allow updating delivery fee', () => {
     const { getByTestId, getByText,getByLabelText } =render(<CheckoutPage products={products} serviceFee={serviceFee} deliveryFee={deliveryFee} />);

    // Verify initial rendering of products and fees
    expect(getByText('Product 1')).toBeInTheDocument();
    expect(getByText('Product 2')).toBeInTheDocument();
    expect(getByText(`Service Fee: KES ${serviceFee}`)).toBeInTheDocument();
    expect(getByLabelText('Delivery Fee:')).toHaveValue(deliveryFee.toString());
    expect(getByTestId('total-price')).toHaveTextContent(
      `Total: KES ${products.reduce((acc, product) => acc + product.price * product.quantity, 0) + serviceFee + deliveryFee}`
    );

    // Change delivery fee
    const deliveryFeeInput = getByLabelText('Delivery Fee:') as HTMLInputElement;
    fireEvent.change(deliveryFeeInput, { target: { value: '10' } });

    // Verify updated delivery fee and recalculated total price
    expect(deliveryFeeInput.value).toBe('10');
    expect(getByTestId('total-price')).toHaveTextContent(
      `Total: KES ${products.reduce((acc, product) => acc + product.price * product.quantity, 0) + serviceFee + 10}`
    );
  });


});
