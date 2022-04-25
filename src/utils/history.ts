import { STORAGE_KEYS } from './storage-keys';

export interface HistoryPayload {
  date: number;
  email: string;
}

export class GenerationHistory {
  private storage: chrome.storage.LocalStorageArea = chrome.storage.local;
  private limit: number = 10;

  async getHistory(): Promise<HistoryPayload[]> {
    const data = await this.storage.get(STORAGE_KEYS.generation_history);
    return data[STORAGE_KEYS.generation_history] || [];
  }

  async append(email: string) {
    const history = await this.getHistory();
    const data = (
      history.length >= this.limit ? history.slice(1) : history
    ).concat({
      date: Date.now(),
      email,
    });

    await this.storage.set({
      [STORAGE_KEYS.generation_history]: data,
    });
  }
}
