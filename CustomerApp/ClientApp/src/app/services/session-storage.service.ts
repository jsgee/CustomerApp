import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {

  get length(): number {
    return sessionStorage.length;
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  getSessionItem(key: string) {
    return sessionStorage.getItem(key);
  }

  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  setSessionItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
}
