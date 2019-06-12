import {Injectable} from "@angular/core";
import {Http, RequestOptions, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {AuthenticationService} from "./authentication.service";
import {HttpClient} from "@angular/common/http";
import {File} from "@ionic-native/file";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";

@Injectable()
export class FileService {



  constructor(private http: HttpClient, public authenticationService: AuthenticationService) {
  }

  sayHello(): Promise<any> {
    return this.http.get("helloworld")
      .toPromise()
  }

  getFile(): Promise<any> {
    return this.http.get("listing/type/" +
      this.authenticationService.getLoggedUser()._id + "/file")
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  getFolders(id_folder: String): Promise<any> {
    return this.http.post("folders/" +
      this.authenticationService.getLoggedUser()._id, {folder_id: id_folder})
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  createFolder(id_folder: String, name: String): Promise<any> {
    return this.http.post("create/folder/" + id_folder, {"name": name})
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  getFilesByFolder(id_folder: String): Promise<any> {
    return this.http.post('files/' + this.authenticationService.getLoggedUser()._id, {folder_id: id_folder})
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  getFileById(id_file: String): Promise<any> {
    return this.http.get('file/' + id_file)
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  rename(id: String, name: String, ressource: String): Promise<any> {
    return this.http.post("rename/" + ressource + "/" + id, {"new_name": name})
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  delete(id_file: String): Promise<any> {
    return this.http.delete('file/' + id_file)
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }

  share(id_file: String, ressource): Promise<any> {
    return this.http.get("share/" + ressource + "/" + id_file)
      .toPromise()
      .then(resp => resp, err => console.log(err))
  }


}
