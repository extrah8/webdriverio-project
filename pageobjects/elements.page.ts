import Page from './page';
import { expect } from '@wdio/globals';
import path from 'path';
import fs from 'fs-extra';

export class ElementsPage extends Page {
  // Inputs
  public get inputFullName() { return $('#userName'); }
  public get inputEmail() { return $('#userEmail'); }
  public get inputCurrentAddress() { return $('#currentAddress'); }
  public get inputPermanentAddress() { return $('#permanentAddress'); }

  // Labels
  public get labelFullName() { return $('#userName-label'); }
  public get labelEmail() { return $('#userEmail-label'); }
  public get labelCurrentAddress() { return $('#currentAddress-label'); }
  public get labelPermanentAddress() { return $('#permanentAddress-label'); }

  // Submit button
  public get submitButton() { return $('#submit'); }

  // Expand/Collapse buttons (checkbox tree)
  public get expandAllButton() { return $('button[aria-label="Expand all"]'); }
  public get collapseAllButton() { return $('button[aria-label="Collapse all"]'); }

  // Result text after checkbox selection
  public get resultText() { return $('#result'); }

  // Upload / Download elements
  public get downloadButton() { return $('#downloadButton'); }
  public get uploadInput() { return $('#uploadFile'); }
  public get uploadedFilePath() { return $('#uploadedFilePath'); }

  // Checkbox tree nodes
  public get desktopNode() { return $('span=Desktop'); }

  // Radio Buttons
  public get yesRadio() { return $('#yesRadio'); }
  public get impressiveRadio() { return $('#impressiveRadio'); }
  public get noRadio() { return $('#noRadio'); }
  public get radioResultText() { return $('.text-success'); }

  // Web Tables Section
  public get rowsPerPageSelect() { return $('select[aria-label="rows per page"]'); }
  public get addNewRecordButton() { return $('#addNewRecordButton'); }
  public get firstNameHeader() { return $('div.rt-resizable-header-content=First Name'); }
  public get lastNameHeader() { return $('div.rt-resizable-header-content=Last Name'); }
  public get ageHeader() { return $('div.rt-resizable-header-content=Age'); }
  public get emailHeader() { return $('div.rt-resizable-header-content=Email'); }
  public get salaryHeader() { return $('div.rt-resizable-header-content=Salary'); }
  public get departmentHeader() { return $('div.rt-resizable-header-content=Department'); }

  // Registration Form
  public get inputFirstName() { return $('#firstName'); }
  public get inputLastName() { return $('#lastName'); }
  public get inputUserEmail() { return $('#userEmail'); }
  public get inputAge() { return $('#age'); }
  public get inputSalary() { return $('#salary'); }
  public get inputDepartment() { return $('#department'); }
  public get submitButtonForm() { return $('#submit'); }

  /** Returns the expand arrow element for a node by its name. */
  public expandArrowByName(name: string) {
    return $(`//span[@class="rct-title" and text()="${name}"]/ancestor::span[@class="rct-text"]//button`);
  }

  /** Returns the checkbox element for a node by its name. */
  public checkboxByName(name: string) {
    return $(`//label[.//span[@class='rct-title' and text()='${name}']]//span[@class='rct-checkbox']`);
  }

  /** Expands all nodes in the checkbox tree. */
  public async expandAll(): Promise<void> {
    await this.expandAllButton.scrollIntoView();
    await this.expandAllButton.waitForClickable({ timeout: 5000 });
    await this.expandAllButton.click();
  }

  /** Collapses all nodes in the checkbox tree. */
  public async collapseAll(): Promise<void> {
    await this.collapseAllButton.scrollIntoView();
    await this.collapseAllButton.waitForClickable({ timeout: 5000 });
    await this.collapseAllButton.click();
  }

  /** Expands a specific node by name. */
  public async expandNode(name: string): Promise<void> {
    const arrow = await this.expandArrowByName(name);
    await arrow.scrollIntoView();
    await arrow.click();
  }

  /** Clicks a checkbox by its name. */
  public async clickCheckbox(name: string): Promise<void> {
    const checkbox = await this.checkboxByName(name);
    await checkbox.scrollIntoView();
    await checkbox.click();
  }

  /** Checks if a checkbox is marked as selected. */
  public async isCheckboxChecked(name: string): Promise<boolean> {
    const checkbox = await this.checkboxByName(name);
    const icon = await checkbox.$('svg');
    const iconClass = await icon.getAttribute('class');
    return iconClass?.includes('rct-icon-check') ?? false;
  }

  /** Gets the result text displayed after selecting checkboxes. */
  public async getResultText(): Promise<string> {
    await this.resultText.waitForDisplayed();
    return await this.resultText.getText();
  }

  /** Fills in the text box form with user input. */
  public async fillForm(fullName: string, email: string, currentAddress: string, permanentAddress: string): Promise<void> {
    await this.inputFullName.setValue(fullName);
    await this.inputEmail.setValue(email);
    await this.inputCurrentAddress.setValue(currentAddress);
    await this.inputPermanentAddress.setValue(permanentAddress);
  }

  /** Fills the web table registration form. */
  public async fillWebTableForm(firstName: string, lastName: string, email: string, age: string, salary: string, department: string): Promise<void> {
    await this.inputFirstName.setValue(firstName);
    await this.inputLastName.setValue(lastName);
    await this.inputEmail.setValue(email);
    await this.inputAge.setValue(age);
    await this.inputSalary.setValue(salary);
    await this.inputDepartment.setValue(department);
  }

  /** Submits a generic form. */
  public async submitForm(): Promise<void> {
    await this.submitButton.scrollIntoView();
    await expect(this.submitButton).toBeDisplayed();
    await this.submitButton.click();
  }

  /** Verifies visibility of all form elements in the text box section. */
  public async verifyFormElementsVisible(): Promise<void> {
    await expect(this.labelFullName).toBeDisplayed();
    await expect(this.labelEmail).toBeDisplayed();
    await expect(this.labelCurrentAddress).toBeDisplayed();
    await expect(this.labelPermanentAddress).toBeDisplayed();
    await expect(this.inputFullName).toBeDisplayed();
    await expect(this.inputEmail).toBeDisplayed();
    await expect(this.inputCurrentAddress).toBeDisplayed();
    await expect(this.inputPermanentAddress).toBeDisplayed();
    await expect(this.submitButton).toBeDisplayed();
  }

  /** Uploads a file using the upload input. */
  public async uploadFile(filePath: string): Promise<void> {
    const remoteFilePath = await browser.uploadFile(filePath);
    await this.uploadInput.setValue(remoteFilePath);
  }

  /** Returns the uploaded file path displayed on screen. */
  public async getUploadedFilePath(): Promise<string> {
    await this.uploadedFilePath.waitForDisplayed();
    return await this.uploadedFilePath.getText();
  }

  /** Downloads a file and waits for it to appear in the filesystem. */
  public async downloadFile(expectedFileName: string): Promise<string> {
    await this.downloadButton.scrollIntoView();
    await this.downloadButton.waitForClickable({ timeout: 5000 });
    await this.downloadButton.click();
    const downloadDir = path.resolve('./fixtures');
    const fullPath = path.join(downloadDir, expectedFileName);
    await browser.waitUntil(async () => {
      const exists = await fs.pathExists(fullPath);
      if (!exists) return false;
      const stats = await fs.stat(fullPath);
      return stats.size > 0;
    }, {
      timeout: 10000,
      timeoutMsg: `Expected file ${expectedFileName} to be downloaded`
    });
    return fullPath;
  }

  /** Checks whether a file exists at a specified path. */
  public async isFileExists(filePath: string): Promise<boolean> {
    return fs.pathExists(filePath);
  }

  /** Deletes a file if it exists. */
  public async deleteFile(filePath: string): Promise<void> {
    if (await fs.pathExists(filePath)) {
      await fs.unlink(filePath);
    }
  }

  /** Checks if a specific radio button is enabled. */
  public async isRadioEnabled(radio: WebdriverIO.Element): Promise<boolean> {
    return await radio.isEnabled();
  }

  /** Clicks a radio button by its label 'for' attribute. */
  public async clickLabelForRadio(radioId: string): Promise<void> {
    const label = await $(`label[for="${radioId}"]`);
    await label.scrollIntoView();
    await label.click();
  }

  /** Gets the selected radio button result text. */
  public async getRadioResultText(): Promise<string> {
    await this.radioResultText.waitForDisplayed({ timeout: 5000 });
    return await this.radioResultText.getText();
  }

  /** Changes the number of rows displayed in the web table. */
  public async changeRowsPerPage(value: string): Promise<void> {
    await this.rowsPerPageSelect.selectByVisibleText(`${value} rows`);
  }

  /** Adds a new record to the web table. */
  public async addNewRecord(firstName: string, lastName: string, email: string, age: string, salary: string, department: string): Promise<void> {
    await this.addNewRecordButton.click();
    await this.fillRegistrationForm(firstName, lastName, email, age, salary, department);
  }

  /** Edits a record identified by name. */
  public async editRecordByName(name: string): Promise<void> {
    const editButton = await $(`//div[@role='row' and .//div[text()='${name}']]//span[@title='Edit']`);
    await editButton.scrollIntoView();
    await editButton.waitForClickable({ timeout: 5000 });
    await editButton.click();
  }

  /** Edits an existing record in the web table with new data. */
  public async editRecord(oldName: string, newFirstName: string, newLastName: string, newEmail: string, newAge: string, newSalary: string, newDepartment: string): Promise<void> {
    await this.editRecordByName(oldName);
    await this.fillWebTableForm(newFirstName, newLastName, newEmail, newAge, newSalary, newDepartment);
    await this.submitButtonForm.scrollIntoView();
    await this.submitForm();
  }

  /** Deletes a record from the web table by name. */
  public async deleteRecordByName(name: string): Promise<void> {
    const deleteButton = await $(`//div[@role='row' and .//div[text()='${name}']]//span[@title='Delete']`);
    await deleteButton.scrollIntoView();
    await deleteButton.waitForClickable({ timeout: 5000 });
    await deleteButton.click();
  }

  /** Fills the registration form for web table input. */
  private async fillRegistrationForm(firstName: string, lastName: string, email: string, age: string, salary: string, department: string): Promise<void> {
    await this.inputFirstName.setValue(firstName);
    await this.inputLastName.setValue(lastName);
    await this.inputUserEmail.setValue(email);
    await this.inputAge.setValue(age);
    await this.inputSalary.setValue(salary);
    await this.inputDepartment.setValue(department);
    await this.submitButtonForm.click();
  }

  /** Searches the web table for a specific name. */
  public async searchRecord(name: string): Promise<void> {
    const searchInput = await $('#searchBox');
    await searchInput.waitForDisplayed({ timeout: 5000 });
    await searchInput.waitForEnabled({ timeout: 5000 });
    await searchInput.clearValue();
    await searchInput.setValue(name);
  }

  /** Verifies all web table column headers are visible. */
  public async verifyColumnHeaders(): Promise<void> {
    await expect(this.firstNameHeader).toBeDisplayed();
    await expect(this.lastNameHeader).toBeDisplayed();
    await expect(this.ageHeader).toBeDisplayed();
    await expect(this.emailHeader).toBeDisplayed();
    await expect(this.salaryHeader).toBeDisplayed();
    await expect(this.departmentHeader).toBeDisplayed();
  }

  /** Returns all the text content of the table. */
  public async getTableText(): Promise<string> {
    const tableBody = await $('div.rt-tbody');
    return tableBody.getText();
  }
}

export const elementsPage = new ElementsPage();
