import path from 'path';
import { expect } from 'chai';
import { homePage, CardName, ElementsMenuItem } from '../../../pageobjects/home.page';
import { elementsPage } from '../../../pageobjects/elements.page';

describe('DemoQA Elements Section', () => {

  it('Checkbox - should expand/collapse tree and select a checkbox', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.elements);
    await homePage.selectElementMenuItem(ElementsMenuItem.checkBox);

    await elementsPage.expandAll();
    expect(await elementsPage.desktopNode.isDisplayed()).to.be.true;

    await elementsPage.collapseAll();
    expect(await elementsPage.desktopNode.isDisplayed()).to.be.false;

    await elementsPage.expandNode('Home');
    await elementsPage.expandNode('Desktop');
    await elementsPage.clickCheckbox('Commands');

    const isChecked = await elementsPage.isCheckboxChecked('Commands');
    expect(isChecked).to.be.true;

    const resultText = await elementsPage.getResultText();
    expect(resultText).to.contain('commands');
  });

  it('Text Box - should fill the Text Box form and submit', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.elements);
    await homePage.selectElementMenuItem(ElementsMenuItem.textBox);

    await elementsPage.verifyFormElementsVisible();
    await elementsPage.fillForm(
      'John Doe',
      'john.doe@example.com',
      '123 Main St',
      '456 Another St'
    );
    await elementsPage.submitForm();
  });

  it('Upload and Download - should upload and download a file successfully', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.elements);
    await homePage.selectElementMenuItem(ElementsMenuItem.uploadDownload);

    const filePath = path.resolve('./fixtures/test_txt.txt');
    await elementsPage.uploadFile(filePath);

    const uploadedFilePath = await elementsPage.getUploadedFilePath();
    expect(uploadedFilePath).to.contain('test_txt.txt');

    const downloadedFilePath = await elementsPage.downloadFile('sampleFile.jpeg');
    const isDownloadedFileExists = await elementsPage.isFileExists(downloadedFilePath);
    expect(isDownloadedFileExists).to.be.true;

    await elementsPage.deleteFile(downloadedFilePath);
  });

  it('Radio Button - should verify radio buttons functionality', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.elements);
    await homePage.selectElementMenuItem(ElementsMenuItem.radioButton);

    expect(await elementsPage.isRadioEnabled(elementsPage.yesRadio)).to.be.true;
    await elementsPage.clickLabelForRadio('yesRadio');
    expect(await elementsPage.getRadioResultText()).to.contain('Yes');

    expect(await elementsPage.isRadioEnabled(elementsPage.impressiveRadio)).to.be.true;
    await elementsPage.clickLabelForRadio('impressiveRadio');
    expect(await elementsPage.getRadioResultText()).to.contain('Impressive');

    expect(await elementsPage.isRadioEnabled(elementsPage.noRadio)).to.be.false;
  });

  it('Web Tables - should verify web tables functionality', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.elements);
    await homePage.selectElementMenuItem(ElementsMenuItem.webTables);

    await elementsPage.verifyColumnHeaders();
    await elementsPage.changeRowsPerPage('50');

    await elementsPage.addNewRecord(
      'TestName',
      'TestLastName',
      'test@example.com',
      '30',
      '5000',
      'QA'
    );

    await elementsPage.searchRecord('TestName');
    const searchResult = await elementsPage.getTableText();
    expect(searchResult).to.contain('TestName');

    await elementsPage.editRecord(
      'TestName',
      'EditedName',
      'EditedLastName',
      'edited@example.com',
      '31',
      '6000',
      'Dev'
    );

    await elementsPage.searchRecord('EditedName');
    const editedResult = await elementsPage.getTableText();
    expect(editedResult).to.contain('EditedName');

    await elementsPage.deleteRecordByName('EditedName');
    await elementsPage.searchRecord('EditedName');
    const deletedResult = await elementsPage.getTableText();
    expect(deletedResult).to.not.contain('EditedName');
  });

});