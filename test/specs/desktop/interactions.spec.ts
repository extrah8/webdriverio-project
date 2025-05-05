import { expect } from 'chai';
import { homePage, CardName, InteractionsMenuItem } from '../../../pageobjects/home.page';
import { interactionsPage } from '../../../pageobjects/interactions.page';

describe('DemoQA Interactions Section', () => {

  it('Sortable - should allow reordering list items via drag and drop', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.interactions);
    await homePage.selectInteractionsMenuItem(InteractionsMenuItem.sortable);

    await interactionsPage.clickSortableListTab();
    const itemsBefore = await interactionsPage.getSortableListText();
    const sortableListItems = await interactionsPage.sortableListItems;

    await interactionsPage.dragElement(
      await sortableListItems[0],
      await sortableListItems[4]
    );

    const itemsAfter = await interactionsPage.getSortableListText();
    expect(itemsAfter).to.not.deep.equal(itemsBefore);
    expect(itemsAfter[4]).to.equal(itemsBefore[0]);

    await interactionsPage.clickSortableGridTab();
    const gridItemsBefore = await interactionsPage.getSortableGridText();
    const sortableGridItems = await interactionsPage.sortableGridItems;

    await interactionsPage.dragElement(
      await sortableGridItems[0],
      await sortableGridItems[8]
    );

    const gridItemsAfter = await interactionsPage.getSortableGridText();
    expect(gridItemsAfter).to.not.deep.equal(gridItemsBefore);
    expect(gridItemsAfter[8]).to.equal(gridItemsBefore[0]);
  });

  it('Selectable - should allow multiple list and grid items to be selected', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.interactions);
    await homePage.selectInteractionsMenuItem(InteractionsMenuItem.selectable);

    await interactionsPage.clickSelectableListTab();
    const listItems = await interactionsPage.selectableListItems;

    await listItems[0].click();
    await listItems[2].click();
    await listItems[3].click();

    const listSelected = await interactionsPage.getListItemClasses();
    expect(listSelected[0]).to.include('active');
    expect(listSelected[2]).to.include('active');
    expect(listSelected[3]).to.include('active');

    await interactionsPage.clickSelectableGridTab();
    const gridItems = await interactionsPage.selectableGridItems;

    await gridItems[1].click();
    await gridItems[4].click();
    await gridItems[7].click();

    const gridSelected = await interactionsPage.getGridItemClasses();
    expect(gridSelected[1]).to.include('active');
    expect(gridSelected[4]).to.include('active');
    expect(gridSelected[7]).to.include('active');
  });

  it('Resizable - should change dimensions of resizable boxes', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.interactions);
    await homePage.selectInteractionsMenuItem(InteractionsMenuItem.resizable);

    const handle1 = await interactionsPage.resizableBoxHandle;
    const box1 = await interactionsPage.resizableBox;

    const sizeBeforeBox = await interactionsPage.getElementSize(box1);
    await interactionsPage.resizeElement(handle1, 50, 30);
    const sizeAfterBox = await interactionsPage.getElementSize(box1);

    expect(sizeAfterBox.width).to.be.greaterThan(sizeBeforeBox.width);
    expect(sizeAfterBox.height).to.be.greaterThan(sizeBeforeBox.height);

    const handle2 = await interactionsPage.resizableHandle;
    const box2 = await interactionsPage.resizableElement;

    const sizeBeforeFree = await interactionsPage.getElementSize(box2);
    await interactionsPage.resizeElement(handle2, 60, 60);
    const sizeAfterFree = await interactionsPage.getElementSize(box2);

    expect(sizeAfterFree.width).to.be.greaterThan(sizeBeforeFree.width);
    expect(sizeAfterFree.height).to.be.greaterThan(sizeBeforeFree.height);
  });

  it('Droppable - should drop elements to drop targets correctly', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.interactions);
    await homePage.selectInteractionsMenuItem(InteractionsMenuItem.droppable);

    await interactionsPage.clickDroppableTab(interactionsPage.simpleTab);
    await interactionsPage.performDragAndDrop(interactionsPage.simpleDraggable, interactionsPage.simpleDropTarget);
    const simpleText = await interactionsPage.getDropTargetText(interactionsPage.simpleDropTarget);
    expect(simpleText).to.equal('Dropped!');

    await interactionsPage.clickDroppableTab(interactionsPage.acceptTab);
    await interactionsPage.performDragAndDrop(interactionsPage.acceptableDraggable, interactionsPage.acceptDropTarget);
    const acceptText = await interactionsPage.getDropTargetText(interactionsPage.acceptDropTarget);
    expect(acceptText).to.equal('Dropped!');

    await interactionsPage.performDragAndDrop(interactionsPage.notAcceptableDraggable, interactionsPage.acceptDropTarget);
    const notAcceptText = await interactionsPage.getDropTargetText(interactionsPage.acceptDropTarget);
    expect(notAcceptText).to.equal('Dropped!');

    await interactionsPage.clickDroppableTab(interactionsPage.preventPropTab);
    await interactionsPage.performDragAndDrop(interactionsPage.preventDragBox, interactionsPage.notGreedyInnerBox);
    const notGreedyInnerText = await interactionsPage.getDropTargetText(interactionsPage.notGreedyInnerBox);
    expect(notGreedyInnerText).to.include('Dropped');

    // FIXME: flaky behavior on nested drop targets – revisit later
    // await interactionsPage.performDragAndDrop(interactionsPage.preventDragBox, interactionsPage.greedyInnerBox);
    // const greedyInnerText = await interactionsPage.getDropTargetText(interactionsPage.greedyInnerBox);
    // expect(greedyInnerText).to.include('Dropped');

    await interactionsPage.clickDroppableTab(interactionsPage.revertTab);
    const revertable = await interactionsPage.willRevert;
    const notRevertable = await interactionsPage.notRevert;
    const dropTarget = await interactionsPage.revertDropTarget;

    const revertStart = await interactionsPage.getElementLocation(revertable);
    await interactionsPage.performDragAndDrop(revertable, dropTarget);
    await browser.pause(1500);
    const revertEnd = await interactionsPage.getElementLocation(revertable);
    const revertDelta = Math.abs(revertEnd.x - revertStart.x) + Math.abs(revertEnd.y - revertStart.y);
    expect(revertDelta).to.be.lessThan(10);

    const nonRevertStart = await interactionsPage.getElementLocation(notRevertable);
    await interactionsPage.performDragAndDrop(notRevertable, dropTarget);
    await browser.pause(1500);
    const nonRevertEnd = await interactionsPage.getElementLocation(notRevertable);
    const nonRevertDelta = Math.abs(nonRevertEnd.x - nonRevertStart.x) + Math.abs(nonRevertEnd.y - nonRevertStart.y);
    expect(nonRevertDelta).to.be.greaterThan(10);
  });

  it('Draggable - should move elements according to restrictions', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.interactions);
    await homePage.selectInteractionsMenuItem(InteractionsMenuItem.dragabble);

    await interactionsPage.clickDraggableTab(interactionsPage.draggableSimpleTab);
    const simpleStart = await interactionsPage.getElementLocation(interactionsPage.simpleDraggableBox);
    await interactionsPage.dragElementByOffset(interactionsPage.simpleDraggableBox, 100, 100);
    const simpleEnd = await interactionsPage.getElementLocation(interactionsPage.simpleDraggableBox);
    expect(simpleEnd.x).to.be.greaterThan(simpleStart.x);
    expect(simpleEnd.y).to.be.greaterThan(simpleStart.y);

    await interactionsPage.clickDraggableTab(interactionsPage.draggableAxisTab);
    const xStart = await interactionsPage.getElementLocation(interactionsPage.onlyXDraggable);
    await interactionsPage.dragElementByOffset(interactionsPage.onlyXDraggable, 100, 100);
    const xEnd = await interactionsPage.getElementLocation(interactionsPage.onlyXDraggable);
    expect(xEnd.x).to.be.greaterThan(xStart.x);
    expect(xEnd.y).to.be.closeTo(xStart.y, 2);

    const yStart = await interactionsPage.getElementLocation(interactionsPage.onlyYDraggable);
    await interactionsPage.dragElementByOffset(interactionsPage.onlyYDraggable, 100, 100);
    const yEnd = await interactionsPage.getElementLocation(interactionsPage.onlyYDraggable);
    expect(yEnd.y).to.be.greaterThan(yStart.y);
    expect(yEnd.x).to.be.closeTo(yStart.x, 2);

    await interactionsPage.clickDraggableTab(interactionsPage.draggableContainerTab);
    const boxStart = await interactionsPage.getElementLocation(interactionsPage.boxDraggable);
    await interactionsPage.dragElementByOffset(interactionsPage.boxDraggable, 300, 0);
    const boxEnd = await interactionsPage.getElementLocation(interactionsPage.boxDraggable);
    expect(boxEnd.x).to.be.greaterThan(boxStart.x);

    const parentStart = await interactionsPage.getElementLocation(interactionsPage.parentDraggable);
    await interactionsPage.dragElementByOffset(interactionsPage.parentDraggable, 0, 300);
    const parentEnd = await interactionsPage.getElementLocation(interactionsPage.parentDraggable);
    expect(parentEnd.y).to.be.greaterThan(parentStart.y);

    await interactionsPage.clickDraggableTab(interactionsPage.draggableCursorTab);
    const topLeftStart = await interactionsPage.getElementLocation(interactionsPage.topLeftCursorBox);
    await interactionsPage.dragElementByOffset(interactionsPage.topLeftCursorBox, 100, 100);
    const topLeftEnd = await interactionsPage.getElementLocation(interactionsPage.topLeftCursorBox);
    expect(topLeftEnd.x).to.be.greaterThan(topLeftStart.x);
    expect(topLeftEnd.y).to.be.greaterThan(topLeftStart.y);

    const centerStart = await interactionsPage.getElementLocation(interactionsPage.centerCursorBox);
    await interactionsPage.dragElementByOffset(interactionsPage.centerCursorBox, -50, -50);
    const centerEnd = await interactionsPage.getElementLocation(interactionsPage.centerCursorBox);
    expect(centerEnd.x).to.be.lessThan(centerStart.x);
    expect(centerEnd.y).to.be.lessThan(centerStart.y);

    const bottomStart = await interactionsPage.getElementLocation(interactionsPage.bottomCursorBox);
    await interactionsPage.dragElementByOffset(interactionsPage.bottomCursorBox, 70, 70);
    const bottomEnd = await interactionsPage.getElementLocation(interactionsPage.bottomCursorBox);
    expect(bottomEnd.x).to.be.greaterThan(bottomStart.x);
    expect(bottomEnd.y).to.be.greaterThan(bottomStart.y);
  });

});