# Hardware Integrations Specification

## Hardware Simulation Interfaces
Since this is a local build, all hardware devices are simulated/mocked behind abstract interface definitions.

### 1. Barcode Scanner
- **Contract**: Accepts input string simulating a USB-HID keyboard-wedge input ending in `Enter` key.
- **Simulation**: A simple input box or global event listener in POS screen that captures characters and triggers search on `Enter`.

### 2. EDC Card Terminal
- **Contract**: `processCardPayment(amount: number): Promise<{ success: boolean; transactionId: string; maskedCard: string; error?: string }>`
- **Simulation**: Rest API mock that waits for 1.5 seconds and returns successful transaction, simulating terminal response.

### 3. UPI QR Code Generator
- **Contract**: `generateUPIQR(amount: number, txId: string): Promise<{ qrCodeBase64: string; upiPayload: string }>`
- **Simulation**: Generates a standard canvas-based QR code containing UPI URL (e.g., `upi://pay?pa=afreenmall@upi&am=XX&tr=YY`).

### 4. Thermal Printer
- **Contract**: `printReceipt(textBuffer: string): Promise<{ success: boolean; printCount: number }>`
- **Simulation**: Logs printed text receipt formatting to database `PrintedReceipts` log and pops open a text modal or prints to web console for visual review.
