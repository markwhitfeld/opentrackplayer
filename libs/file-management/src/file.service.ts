import { Injectable } from "@angular/core";

export interface FileRef {
  id: string;
  name: string;
  fileInitialised: boolean;
  dataLoaded: boolean;
}

interface FileTracker extends FileRef {
  file: File | null;
  getFile(): Promise<File>;
  arrayBuffer: ArrayBuffer | null;
  getArrayBuffer(): Promise<ArrayBuffer>;
}

@Injectable({
  providedIn: "root",
})
export class FileService {
  private fileTrackers = new Map<string, FileTracker>();

  async selectFolder(): Promise<FileSystemDirectoryHandle> {
    return window.showDirectoryPicker({
      mode: "read",
    });
  }

  async getAudioFiles(
    dirHandle: FileSystemDirectoryHandle
  ): Promise<FileRef[]> {
    const fileRefs: FileRef[] = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && isAudioFile(entry)) {
        const id = crypto.randomUUID();
        this.trackFile(id, entry);
        const fileRef = this.getFileRef(id);
        if (fileRef) {
          fileRefs.push(fileRef);
        }
      }
    }
    return fileRefs;
  }

  getFileRef(id: string): FileRef | null {
    const fileTracker = this.fileTrackers.get(id);
    if (!fileTracker) return null;
    const { name, dataLoaded, fileInitialised } = fileTracker;
    return {
      id,
      name,
      dataLoaded,
      fileInitialised,
    };
  }

  async getArrayBuffer(id: string) {
    const fileTracker = this.fileTrackers.get(id);
    if (!fileTracker) return null;
    return await fileTracker.getArrayBuffer();
  }

  async getLoadedFileRef(id: string): Promise<FileRef | null> {
    const fileTracker = this.fileTrackers.get(id);
    if (!fileTracker) return null;
    await fileTracker.getArrayBuffer();
    return this.getFileRef(id);
  }

  private trackFile(id: string, entry: FileSystemFileHandle) {
    const getFilePromise = entry.getFile();
    const getArrayBufferPromise = getFilePromise.then((file) =>
      file.arrayBuffer()
    );
    const fileTracker: FileTracker = {
      id,
      name: entry.name,
      fileInitialised: false,
      file: null,
      getFile() {
        return getFilePromise;
      },
      dataLoaded: false,
      arrayBuffer: null,
      getArrayBuffer() {
        return getArrayBufferPromise;
      },
    };
    this.fileTrackers.set(id, fileTracker);
    getFilePromise.then((file) => {
      fileTracker.file = file;
      fileTracker.fileInitialised = true;
    });
    getArrayBufferPromise.then((arrayBuffer) => {
      fileTracker.arrayBuffer = arrayBuffer;
      fileTracker.dataLoaded = true;
    });
  }
}

function isAudioFile(entry: FileSystemFileHandle) {
  const fileName = entry.name;
  return (
    fileName.endsWith(".wav") ||
    fileName.endsWith(".mp3") ||
    fileName.endsWith(".m4a")
  );
}
