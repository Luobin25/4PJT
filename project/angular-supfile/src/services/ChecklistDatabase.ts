import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {FileService} from './file.service';

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
let TREE_DATA = {

};
let userId;
let FILEService;
/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private fileService: FileService) {
    FILEService = this.fileService;
    userId = JSON.parse(localStorage.getItem('currentUser'))['_id'];
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const result = {};
    result['/'] = {};
    this.travel('_root', result['/']).then((resp: any) => {
      console.log(result);
      const data = this.buildFileTree(result, 0);
          // Notify the change.
      this.dataChange.next(data);
    });
  }
  travel(folder_id, container) {
    return FILEService.getSpecFolderByUserId(userId, folder_id).then((resp: any) => {
      if (resp.success = 'true') {
        if (resp.data.length > 0) {
          return Promise.all(resp.data.map(item => {
            container[item.name] = {};
            return this.travel(item._id, container[item.name]);
          }));
        }
      }
    });
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(value: any, level: number) {
    const data: any[] = [];
    for (const k in value) {
      const v = value[k];
      const node = new TodoItemNode();
      node.item = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        node.children = this.buildFileTree(v, level + 1);
      } else {
        node.item = v;
      }
      data.push(node);
    }
    return data;
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    const child = <TodoItemNode>{item: name};
    if (parent.children) {
      parent.children.push(child);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}
