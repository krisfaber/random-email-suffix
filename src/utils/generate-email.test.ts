import { generate, GenerationMethod } from './generate-email';

test('generate email with random ID', () => {
  const email = generate('john@email.com', GenerationMethod.randID, 8);
  expect(email.split('@')[0].split('+')[1]).toHaveLength(8);
  expect(email.split('@')[0].split('+')[0]).toBe('john');
  expect(email.split('@')[1]).toBe('email.com');
});

test('generate email with a timestamp', () => {
  const email = generate('john@email.com', GenerationMethod.timestamp);
  expect(+email.split('@')[0].split('+')[1]).toBeLessThanOrEqual(Date.now())
  expect(email.split('@')[0].split('+')[0]).toBe('john');
  expect(email.split('@')[1]).toBe('email.com');
});


test('generated random IDs are random', () => {
  const IDs: string[] = [];

  // generate a 1000 emails
  for (let i = 0; i < 1000; i++) {
    const email = generate('john@email.com', GenerationMethod.randID, 8);
    IDs.push(email.split('@')[0].split('+')[1]);
  }

  expect(new Set(IDs).size).toEqual(IDs.length)
})