async function test() {
  const res = await fetch('http://localhost:5000/api/orders/analytics');
  console.log('Status:', res.status);
  console.log('Text:', await res.text());
}
test();
