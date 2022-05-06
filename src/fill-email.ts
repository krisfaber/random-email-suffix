import { generateEmail } from './utils/generate-email';
import { GenerationHistory } from './utils/history';

function replaceValue(el: HTMLInputElement, value: string) {
  if (el) {
    el.focus();
    el.select();
    if (!document.execCommand('insertText', false, value)) {
      // Fallback for Firefox: just replace the value
      el.value = value;
    }
    el.dispatchEvent(new Event('change', { bubbles: true })); // usually not needed
  }

  return el;
}

(async () => {
  const email = await generateEmail();
  const generationHistory = new GenerationHistory();
  const activeTextarea = document.activeElement;

  if (activeTextarea) {
    replaceValue(activeTextarea as HTMLInputElement, email);
    await generationHistory.append(email);
  }
})();
