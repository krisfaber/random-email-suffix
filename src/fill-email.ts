import { generateEmail } from './utils/generate-email';

(async () => {
  const email = await generateEmail();
  const activeTextarea = document.activeElement;
  (activeTextarea as HTMLInputElement).value = email;
})();
