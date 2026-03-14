import { Injectable } from '@angular/core';
import { BaseResume } from './resume-session.service';

/**
 * ResumeParserService
 *
 * Responsible for sending the uploaded file to the Python backend
 * and returning a structured BaseResume object.
 *
 * TODO: Wire up to POST /api/resume/parse once backend is ready.
 */
@Injectable({ providedIn: 'root' })
export class ResumeParserService {

  /**
   * Sends the file to the backend for parsing.
   * Returns a promise that resolves to a partially-structured BaseResume.
   */
  async parse(file: File): Promise<BaseResume> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/resume/parse', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Resume parsing failed: ${response.statusText}`);
    }

    return response.json() as Promise<BaseResume>;
  }
}
