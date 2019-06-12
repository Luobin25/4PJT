import {User} from './user';

export class Folder {
  name: string;
  private: Boolean;
  owner: User;
  folder: Folder;
}
