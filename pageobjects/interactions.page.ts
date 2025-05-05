import Page from './page';

export class InteractionsPage extends Page {
  // Sortable
  public get sortableTab() {
    return $('#demo-tab-list');
  }

  public get sortableListItems() {
    return $$('#demo-tabpane-list .list-group-item');
  }

  public get sortableGridTab() {
    return $('#demo-tab-grid');
  }

  public get sortableGridItems() {
    return $$('#demo-tabpane-grid .list-group-item');
  }

  // Selectable

  public get selectableListTab() {
    return $('#demo-tab-list');
  }

  public get selectableGridTab() {
    return $('#demo-tab-grid');
  }

  public get selectableListItems() {
    return $$('#verticalListContainer .list-group-item');
  }

  public get selectableGridItems() {
    return $$('#gridContainer .list-group-item');
  }

  // Resizable
  public get resizableBoxHandle() {
    return $('#resizableBoxWithRestriction .react-resizable-handle');
  }

  public get resizableBox() {
    return $('#resizableBoxWithRestriction');
  }

  public get resizableHandle() {
    return $('#resizable .react-resizable-handle');
  }

  public get resizableElement() {
    return $('#resizable');
  }

  // Droppable - Tabs
  public get simpleTab() {
    return $('#droppableExample-tab-simple');
  }

  public get acceptTab() {
    return $('#droppableExample-tab-accept');
  }

  public get preventPropTab() {
    return $('#droppableExample-tab-preventPropogation');
  }

  public get revertTab() {
    return $('#droppableExample-tab-revertable');
  }

  // Droppable - Simple
  public get simpleDraggable() {
    return $('#draggable');
  }

  public get simpleDropTarget() {
    return $('#simpleDropContainer #droppable');
  }

  // Droppable - Accept
  public get acceptableDraggable() {
    return $('#acceptable');
  }

  public get notAcceptableDraggable() {
    return $('#notAcceptable');
  }

  public get acceptDropTarget() {
    return $('#acceptDropContainer #droppable');
  }

  // Droppable - Prevent Propagation
  public get preventDragBox() {
    return $('#dragBox');
  }

  public get notGreedyInnerBox() {
    return $('#notGreedyInnerDropBox');
  }

  public get greedyInnerBox() {
    return $('#greedyDropBoxInner');
  }

  // Droppable - Revert Draggable
  public get willRevert() {
    return $('#revertable');
  }

  public get notRevert() {
    return $('#notRevertable');
  }

  public get revertDropTarget() {
    return $('#revertableDropContainer #droppable');
  }

  // Draggable - Tabs
  public get draggableSimpleTab() {
    return $('#draggableExample-tab-simple');
  }

  public get draggableAxisTab() {
    return $('#draggableExample-tab-axisRestriction');
  }

  public get draggableContainerTab() {
    return $('#draggableExample-tab-containerRestriction');
  }

  public get draggableCursorTab() {
    return $('#draggableExample-tab-cursorStyle');
  }

  // Draggable - Simple
  public get simpleDraggableBox() {
    return $('#dragBox');
  }

  // Draggable - Axis Restricted
  public get onlyXDraggable() {
    return $('#restrictedX');
  }

  public get onlyYDraggable() {
    return $('#restrictedY');
  }

  // Draggable - Container Restricted
  public get boxDraggable() {
    return $('#containmentWrapper .draggable');
  }

  public get parentDraggable() {
    return $('#containmentWrapper + .draggable');
  }

  // Draggable - Cursor Style
  public get topLeftCursorBox() {
    return $('#cursorCenter + .drag-box');
  }

  public get centerCursorBox() {
    return $('#cursorCenter');
  }

  public get bottomCursorBox() {
    return $('#cursorBottom');
  }

  // Methods

  /** Clicks on the Sortable list tab */
  public async clickSortableListTab(): Promise<void> {
    await this.sortableTab.scrollIntoView();
    await this.sortableTab.click();
  }

  /** Clicks on the Sortable grid tab */
  public async clickSortableGridTab(): Promise<void> {
    await this.sortableGridTab.scrollIntoView();
    await this.sortableGridTab.click();
  }

  /** Drags a source element to a target element */
  public async dragElement(source: any, target: any): Promise<void> {
    await source.scrollIntoView();
    await target.scrollIntoView();
    await source.dragAndDrop(target);
  }

  /** Gets all texts from sortable list items */
  public async getSortableListText(): Promise<string[]> {
    const items = await this.sortableListItems;
    const itemsArray = Array.from(items);
    const resolvedItems = await Promise.all(itemsArray.map(item => item.getText()));
    return resolvedItems;
  }

  /** Gets all texts from sortable grid items */
  public async getSortableGridText(): Promise<string[]> {
    const items = await this.sortableGridItems;
    const itemsArray = Array.from(items);
    const resolvedItems = await Promise.all(itemsArray.map(item => item.getText()));
    return resolvedItems;
  }

  /** Clicks the Selectable list tab */
  public async clickSelectableListTab(): Promise<void> {
    await this.selectableListTab.scrollIntoView();
    await this.selectableListTab.click();
  }

  /** Clicks the Selectable grid tab */
  public async clickSelectableGridTab(): Promise<void> {
    await this.selectableGridTab.scrollIntoView();
    await this.selectableGridTab.click();
  }

  /** Gets class attribute from selectable list items */
  public async getListItemClasses(): Promise<string[]> {
    const items = await this.selectableListItems;
    const itemsArray = Array.from(items);
    const classes = await Promise.all(itemsArray.map(item => item.getAttribute('class')));
    return classes;
  }

  /** Gets class attribute from selectable grid items */
  public async getGridItemClasses(): Promise<string[]> {
    const items = await this.selectableGridItems;
    const itemsArray = Array.from(items);
    const classes = await Promise.all(itemsArray.map(item => item.getAttribute('class')));
    return classes;
  }

  /** Resizes element by dragging it by x/y offsets */
  public async resizeElement(handle: any, xOffset: number, yOffset: number): Promise<void> {
    await handle.scrollIntoView();
    await handle.dragAndDrop({ x: xOffset, y: yOffset });
  }

  /** Returns element size { width, height } */
  public async getElementSize(element: any): Promise<{ width: number; height: number }> {
    const size = await element.getSize();
    return { width: size.width, height: size.height };
  }

  /** Clicks any Droppable tab */
  public async clickDroppableTab(tab: any): Promise<void> {
    await tab.scrollIntoView();
    await tab.click();
  }

  /** Performs drag and drop for Droppable elements */
  public async performDragAndDrop(source: any, target: any): Promise<void> {
    await source.scrollIntoView();
    await target.scrollIntoView();
    await source.dragAndDrop(target);
  }

  /** Returns text from drop target */
  public async getDropTargetText(target: any): Promise<string> {
    return await target.getText();
  }

  /** Returns element location { x, y } */
  public async getElementLocation(element: any): Promise<{ x: number; y: number }> {
    return await element.getLocation();
  }

  /** Clicks a given Draggable tab */
  public async clickDraggableTab(tab: any): Promise<void> {
    await tab.scrollIntoView();
    await tab.click();
  }

  /** Drags element by specified offset */
  public async dragElementByOffset(element: any, offsetX: number, offsetY: number): Promise<void> {
    await element.scrollIntoView();
    await element.dragAndDrop({ x: offsetX, y: offsetY });
  }
}

export const interactionsPage = new InteractionsPage();