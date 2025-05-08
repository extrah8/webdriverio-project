import { homePage, CardName, WidgetsMenuItem } from '../../../pageobjects/home.page';
import { widgetsPage } from '../../../pageobjects/widgets.page';
import { expect } from 'chai';

describe('DemoQA Widgets Section', () => {

  it('Accordion - should expand all sections and verify content is displayed', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.widgets);
    await homePage.selectWidgetsMenuItem(WidgetsMenuItem.accordian);

    await widgetsPage.validateAllAccordionSections();
  });

  it('Auto Complete - should allow multi and single color selection and removal', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.widgets);
    await homePage.selectWidgetsMenuItem(WidgetsMenuItem.autoComplete);

    const multiColors = ['Red', 'Green', 'Blue'];
    await widgetsPage.enterMultiSelectColors(multiColors);

    const selectedMulti = await widgetsPage.getSelectedMultiColors();
    expect(selectedMulti).to.have.members(multiColors);

    await widgetsPage.removeMultiColor('Green');
    const updatedMulti = await widgetsPage.getSelectedMultiColors();
    expect(updatedMulti).to.not.include('Green');
    expect(updatedMulti.length).to.equal(2);

    const singleColor = 'Purple';
    await widgetsPage.enterSingleSelectColor(singleColor);
    const selectedSingle = await widgetsPage.getSelectedSingleColor();
    expect(selectedSingle).to.equal(singleColor);
  });

  it('Date Picker - should allow manual and UI date/time selection', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.widgets);
    await homePage.selectWidgetsMenuItem(WidgetsMenuItem.datePicker);

    const manualDate = '05/15/2020';
    await widgetsPage.enterDate(manualDate);
    const inputDate = await widgetsPage.getDateValue();
    expect(inputDate).to.equal(manualDate);

    await widgetsPage.pickDateViaUI();
    const pickedDate = await widgetsPage.getDateValue();
    expect(pickedDate).to.include('05/15');

    const dateTime = 'May 15, 2020 3:45 PM';
    await widgetsPage.enterDateTime(dateTime);
    const inputDateTime = await widgetsPage.getDateTimeValue();
    expect(inputDateTime).to.include('May 15, 2020');
  });

  it('Slider - should move slider to a specific value', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.widgets);
    await homePage.selectWidgetsMenuItem(WidgetsMenuItem.slider);

    const targetValue = 75;
    await widgetsPage.moveSliderTo(targetValue);
    const currentValue = await widgetsPage.getSliderValue();
    expect(currentValue).to.equal(targetValue);
  });

  it('Progress Bar - should pause, complete to 100%, and reset to 0', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.widgets);
    await homePage.selectWidgetsMenuItem(WidgetsMenuItem.progressBar);

    await widgetsPage.startProgressBar();
    await widgetsPage.waitForProgressToReach(40);
    await widgetsPage.startProgressBar();

    const pausedValue = await widgetsPage.getProgressBarValue();
    expect(pausedValue).to.be.at.least(40);

    await widgetsPage.startProgressBar();
    await widgetsPage.waitForProgressToReach(100);
    await browser.pause(2000);

    await widgetsPage.resetProgressBar();
    await browser.pause(2000);

    const resetValue = await widgetsPage.getProgressBarValue();
    expect(resetValue).to.equal(0);
  });

});