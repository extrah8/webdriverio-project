import Page from './page';
import { expect } from 'chai';
import type { ChainablePromiseElement } from 'webdriverio';

export class FormsPage extends Page {
  // Inputs
  public get inputFirstName() { return $('#firstName'); }
  public get inputLastName() { return $('#lastName'); }
  public get inputEmail() { return $('#userEmail'); }
  public get inputMobileNumber() { return $('#userNumber'); }
  public get inputDateOfBirth() { return $('#dateOfBirthInput'); }
  public get inputSubjects() { return $('#subjectsInput'); }
  public get inputCurrentAddress() { return $('#currentAddress'); }

  // Upload Picture
  public get uploadPictureInput() { return $('#uploadPicture'); }

  // State and City Dropdowns
  public get stateDropDown() { return $('#state'); }
  public get cityDropDown() { return $('#city'); }

  // Submit Button
  public get submitButton() { return $('#submit'); }

  // Modal After Submit
  public get modalTitle() { return $('.modal-title'); }
  public get modalCloseButton() { return $('#closeLargeModal'); }

  /**
   * Fills the basic form inputs.
   */
  public async fillForm(firstName: string, lastName: string, email: string, mobileNumber: string, currentAddress: string): Promise<void> {
    await this.inputFirstName.setValue(firstName);
    await this.inputLastName.setValue(lastName);
    await this.inputEmail.setValue(email);
    await this.inputMobileNumber.setValue(mobileNumber);
    await this.inputCurrentAddress.setValue(currentAddress);
  }

  /**
   * Selects a gender radio button by clicking on its label.
   */
  public async selectGender(gender: 'Male' | 'Female' | 'Other'): Promise<void> {
    const index = gender === 'Male' ? 1 : gender === 'Female' ? 2 : 3;
    const label = $(`label[for="gender-radio-${index}"]`);

    await label.waitForDisplayed({ timeout: 3000 });
    await label.scrollIntoView({ block: 'center' });
    await label.click();
}

  /**
   * Selects a state from the dropdown.
   */
  public async selectState(state: string): Promise<void> {
    await this.stateDropDown.scrollIntoView();
    await this.stateDropDown.click();
    const stateOption = await $(`//div[contains(@id,'react-select-3-option') and text()='${state}']`);
    await stateOption.waitForExist({ timeout: 5000 });
    await stateOption.waitForClickable({ timeout: 5000 });
    await stateOption.click();
  }

  /**
   * Selects a city from the dropdown.
   */
  public async selectCity(city: string): Promise<void> {
    await this.cityDropDown.scrollIntoView();
    await this.cityDropDown.click();
    const cityOption = await $(`//div[contains(@id,'react-select-4-option') and text()='${city}']`);
    await cityOption.waitForExist({ timeout: 5000 });
    await cityOption.waitForClickable({ timeout: 5000 });
    await cityOption.click();
  }

  /**
   * Submits the form.
   */
  public async submitForm(): Promise<void> {
    await this.submitButton.scrollIntoView();
    await this.submitButton.waitForClickable({ timeout: 5000 });
    await this.submitButton.click();
  }

  /**
   * Selects a date from the calendar UI.
   */
  public async selectDateOfBirth(date: string): Promise<void> {
    await this.inputDateOfBirth.click();

    const [day, month, year] = date.split(' ');
    const yearSelect = await $('.react-datepicker__year-select');
    await yearSelect.selectByVisibleText(year);
    const monthSelect = await $('.react-datepicker__month-select');
    await monthSelect.selectByVisibleText(month);
    const dayCell = await $(`.react-datepicker__day--0${day.padStart(2, '0')}`);
    await dayCell.click();
  }

  /**
   * Selects subjects.
   */
  public async selectSubjects(subjects: string[]): Promise<void> {
    for (const subject of subjects) {
      await this.inputSubjects.setValue(subject);
      await browser.keys('Enter');
    }
  }

  /**
   * Selects hobbies.
   */
  public async selectHobbies(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      const hobbyCheckbox = await $(`//label[text()='${hobby}']`);
      await hobbyCheckbox.scrollIntoView();
      await hobbyCheckbox.click();
    }
  }

  /**
   * Uploads a picture file.
   */
  public async uploadPicture(filePath: string): Promise<void> {
    const remoteFilePath = await browser.uploadFile(filePath);
    await this.uploadPictureInput.setValue(remoteFilePath);
  }

  /**
   * Gets the modal field value by label.
   */
  public async getModalValueByLabel(label: string): Promise<string> {
    const row = await $(`//td[text()='${label}']/following-sibling::td`);
    await row.waitForDisplayed({ timeout: 5000 });
    return await row.getText();
  }

  /**
   * Closes the modal.
   */
  public async closeModal(): Promise<void> {
    await this.modalCloseButton.scrollIntoView();
    await this.modalCloseButton.waitForClickable({ timeout: 5000 });
    await this.modalCloseButton.click();
  }

  /**
   * Verifies all form fields inside the modal.
   */
  public async verifyModalData(
    fullName: string,
    email: string,
    gender: string,
    mobile: string,
    dateOfBirth: string,
    subjects: string,
    hobbies: string,
    picture: string,
    address: string,
    stateAndCity: string
  ): Promise<void> {
    await expect(await this.modalTitle.isDisplayed()).to.be.true;
    expect(await this.modalTitle.getText()).to.equal('Thanks for submitting the form');

    expect(await this.getModalValueByLabel('Student Name')).to.equal(fullName);
    expect(await this.getModalValueByLabel('Student Email')).to.equal(email);
    expect(await this.getModalValueByLabel('Gender')).to.equal(gender);
    expect(await this.getModalValueByLabel('Mobile')).to.equal(mobile);
    expect(await this.getModalValueByLabel('Date of Birth')).to.equal(dateOfBirth);
    expect(await this.getModalValueByLabel('Subjects')).to.equal(subjects);
    expect(await this.getModalValueByLabel('Hobbies')).to.equal(hobbies);
    expect(await this.getModalValueByLabel('Picture')).to.equal(picture);
    expect(await this.getModalValueByLabel('Address')).to.equal(address);
    expect(await this.getModalValueByLabel('State and City')).to.equal(stateAndCity);
  }

  /**
   * Verifies that form fields are empty after reset.
   */
  public async verifyFormFieldsAreEmpty(): Promise<void> {
    expect(await this.inputFirstName.getValue()).to.equal('');
    expect(await this.inputLastName.getValue()).to.equal('');
    expect(await this.inputEmail.getValue()).to.equal('');
    expect(await this.inputMobileNumber.getValue()).to.equal('');
    expect(await this.inputCurrentAddress.getValue()).to.equal('');
    expect(await this.inputSubjects.getValue()).to.equal('');
  }


  /**
   * Waits until the given field is marked invalid (border turns red).
   */
  public async waitForFieldToBeInvalid(
    element: ChainablePromiseElement,
    timeout = 2000
  ): Promise<void> {
    await browser.waitUntil(
      async () => {
        const borderColor = await element.getCSSProperty('border-color');
        return borderColor.parsed?.hex?.toLowerCase() === '#dc3545';
      },
      {
        timeout,
        timeoutMsg: 'Border color did not become #dc3545 within expected time',
      }
    );
  }
  
}

export const formsPage = new FormsPage();
