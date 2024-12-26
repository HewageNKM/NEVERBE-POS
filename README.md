# NEVERBE-POS

NEVERBE-POS is a web-based Point of Sale (POS) system designed to streamline sales processes for businesses. It offers a user-friendly interface for managing products, processing transactions, and generating invoices.

## Features

- **Product Management**: Add, edit, and delete products with details such as name, variant, size, and price.
- **Sales Processing**: Efficiently handle customer orders with real-time calculations of totals, taxes, and discounts.
- **Invoice Generation**: Automatically generate and print invoices for completed transactions.
- **Cash Drawer Integration**: Open the cash drawer directly from the application.
- **Responsive Design**: Accessible on various devices, including tablets and desktops.

## Technologies Used

- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Printing**: ESC/POS commands for thermal printers
- **Styling**: Tailwind CSS for responsive design

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HewageNKM/NEVERBE-POS.git
   cd NEVERBE-POS
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Environment Variables**:
4. Configure Environment Variables: Create a .env.local file in the root directory and add your Firebase configuration:
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
   ```
5. **Run the Application**:
6. Start the development server:
    ```bash
    npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage
- Adding Products: Navigate to the product management section to add new products with necessary details.
- Processing Sales: Use the sales interface to add items to the cart, apply discounts, and complete transactions.
- Printing Invoices: Ensure a compatible thermal printer is connected for invoice printing.
- Opening Cash Drawer: Utilize the cash drawer function to open the drawer when needed.
- Printer Integration
- NEVERBE-POS supports thermal printers using ESC/POS commands. Ensure your printer is compatible and connected to the system. For detailed setup instructions, refer to the Print Server Documentation.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements
- React.js
- Next.js
- Tailwind CSS
- Firebase
- ESC/POS Printing
 