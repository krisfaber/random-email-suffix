import { generateEmail } from './utils/generate-email';
import { GenerationHistory } from './utils/history';

(async () => {
  const email = await generateEmail();
  const generationHistory = new GenerationHistory();
  const activeTextarea = document.activeElement;

  if (activeTextarea) {
    (activeTextarea as HTMLInputElement).value = email;
    (activeTextarea as HTMLInputElement).dispatchEvent(new Event('change'));
    await generationHistory.append(email);
  }
})();
