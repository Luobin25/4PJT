import {User} from './user';
import {Folder} from './folder';

export class File {
  name: string;
  mime_type: string;
  private: Boolean;
  size: Number;
  owner: User;
  folder: Folder;
}
