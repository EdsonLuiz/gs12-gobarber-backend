import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);
    return file;
  }

  public async delete(file: string): Promise<void> {
    const returnedIndex = this.storage.findIndex(
      fileInStorage => fileInStorage === file,
    );

    this.storage.splice(returnedIndex, 1);
  }
}
