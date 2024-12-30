import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  async selectFolder(): Promise<FileSystemDirectoryHandle> {
    return window.showDirectoryPicker({
      mode: 'read'
    });
  }

  async getAudioFiles(dirHandle: FileSystemDirectoryHandle): Promise<File[]> {
    const files: File[] = [];
    
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        if (file.type.startsWith('audio/')) {
          files.push(file);
        }
      }
    }
    
    return files;
  }
}