import {Component, Inject, OnInit, ViewChild} from '@angular/core';

import {FlatTreeControl} from '@angular/cdk/tree';
import {
  MAT_DIALOG_DATA, MatCheckbox, MatDialog, MatSelectionList, MatSelectionListChange, MatTree, MatTreeFlatDataSource,
  MatTreeFlattener
} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {of as ofObservable, Observable} from 'rxjs';
import {ChecklistDatabase, TodoItemFlatNode, TodoItemNode} from '../../../services/ChecklistDatabase';
import {FileService} from '../../../services';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move.dialog.component.html',
  styleUrls: ['./move.dialog.component.scss']
})
export class MoveDialogComponent implements OnInit {

  currentNode: any;
  foldersArray;

  @ViewChild(MatCheckbox) checkbox: MatCheckbox;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName: String = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  ngOnInit(): void {

  }

  constructor(private database: ChecklistDatabase, private fileService: FileService, @Inject(MAT_DIALOG_DATA) private data: any
    , public dialog: MatDialog) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data1 => {
      this.dataSource.data = data1;
    });

    this.fileService.getAllFolderByUserId(this.data.userId).then((resp) => {
      if (resp.success === true) {
        this.foldersArray = resp.data;
      }
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
    return ofObservable(node.children);
  }

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.item === node.item
      ? this.nestedNodeMap.get(node)!
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.currentNode = node;
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  moveFile() {
    const foldername = this.currentNode.item;
    let folderId;
    if (foldername !== '/') {
      this.foldersArray.forEach(function (item) {
        if ( item.name === foldername ) {
          folderId = item._id;
          return;
        }
      });
    }else {
      folderId = '_root';
    }
    this.fileService.moveFile(this.data.selectedResource._id, folderId).then((resp: any) => {
      if (resp.success === true) {
        const index = this.data.resources.indexOf(this.data.selectedResource);
        this.data.resources.splice(index, 1);
      }
    });
  }

}
