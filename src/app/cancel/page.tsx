export default function CancelPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: '#dc3545' }}>❌ Payment Cancelled</h1>
      <p>Don't worry, you haven't been charged.</p>
      <a href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>Try Again</a>
    </div>
  );
}