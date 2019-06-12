import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable()
export class  FileService {

  currentLocation = '';
  lastLocation = [];

  constructor(private http: HttpClient) {
  }

  getFileById(id: number) {
    const url = `${environment.api_url}/file/${id}`;
    return this.http.get(url).toPromise();
  }
  getAllFilesByUserId(id: number) {
    const url = `${environment.api_url}/files/${id}`;
    return this.http.get(url).toPromise();
  }

  getSpecFolderByUserId(id: number, folder_id: string): Promise<any> {
    const url = `${environment.api_url}/folders/${id}`;
    return this.http.post(url, {folder_id: folder_id}).toPromise();
  }

  getAllFolderByUserId(id: number): Promise<any> {
    const url = `${environment.api_url}/folders/${id}`;
    return this.http.get(url).toPromise();
  }
  getSpecFilesByUserId(id: number, folder_id: string): Promise<any> {
    const url = `${environment.api_url}/files/${id}`;
    return this.http.post(url, {folder_id: folder_id}).toPromise();
  }

  uploadFile(folder_id: string, file): Promise<any> {
    const url = `${environment.api_url}/create/file/${folder_id}`;
    return this.http.post(url, file).toPromise();
  }

  addFolder(folder_id: any, name: string): Promise<any> {
    const url = `${environment.api_url}/create/folder/${folder_id}`;
    return this.http.post(url, {name: name}).toPromise();
  }

  renameFile(file_id: number, resource: string, new_name: string): Promise<any> {
    const url = `${environment.api_url}/rename/${resource}/${file_id}`;
    return this.http.post(url, {new_name: new_name}).toPromise();
  }

  downloadFile(file_id: number): Promise<any> {
    const url = `${environment.api_url}/download/${file_id}`;
    return this.http.get(url, {
      responseType: 'blob'
    }).toPromise();
  }

  deleteFile(file_id: number): Promise<any> {
    const url = `${environment.api_url}/file/${file_id}`;
    return this.http.delete(url).toPromise();
  }

  shareFile(file_id: number, resource: string): Promise<any> {
    const url = `${environment.api_url}/share/${resource}/${file_id}`;
    return this.http.get(url).toPromise();
  }

  deleteFolder(folder_id: number): Promise<any> {
    const url = `${environment.api_url}/folder/${folder_id}`;
    return this.http.delete(url).toPromise();
  }

  moveFile(id: number, folder_id: number) {
    const url = `${environment.api_url}/move/file/${id}`;
    return this.http.post(url, {folder_id: folder_id}).toPromise();
  }

}
