import Page from './page';
import { expect } from 'chai';

export class FormsPage extends Page {
    // Inputs
    public get inputFirstName() { return $('#firstName'); }
    public get inputLastName() { return $('#lastName'); }
    public get inputEmail() { return $('#userEmail'); }
    public get inputMobileNumber() { return $('#userNumber'); }
    public get inputDateOfBirth() { return $('#dateOfBirthInput'); }
    public get inputSubjects() { return $('#subjectsInput'); }
    public get inputCurrentAddress() { return $('#currentAddress'); }

    // Gender Radio Buttons
    public get radioMale() { return $('#gender-radio-1'); }
    public get radioFemale() { return $('#gender-radio-2'); }
    public get radioOther() { return $('#gender-radio-3'); }

    // Hobbies Checkboxes
    public get checkboxSports() { return $('#hobbies-checkbox-1'); }
    public get checkboxReading() { return $('#hobbies-checkbox-2'); }
    public get checkboxMusic() { return $('#hobbies-checkbox-3'); }

    // Upload Picture
    public get uploadPictureInput() { return $('#uploadPicture'); }

    // State and City Dropdowns
    public get stateDropDown() { return $('#state'); }
    public get cityDropDown() { return $('#city'); }

    // Submit Button
    public get submitButton() { return $('#submit'); }

    // Modal After Submit
    public get modalTitle() { return $('.modal-title'); }
    public get modalBody() { return $('.modal-body'); }
    public get modalCloseButton() { return $('#closeLargeModal'); }

    // Methods
    public async fillForm(firstName: string, lastName: string, email: string, mobileNumber: string, currentAddress: string): Promise<void> {
        await this.inputFirstName.setValue(firstName);
        await this.inputLastName.setValue(lastName);
        await this.inputEmail.setValue(email);
        await this.inputMobileNumber.setValue(mobileNumber);
        await this.inputCurrentAddress.setValue(currentAddress);
    }

    public async selectGender(gender: 'Male' | 'Female' | 'Other'): Promise<void> {
        const genderLower = gender.toLowerCase();
        let genderElement: WebdriverIO.Element;

        switch (genderLower) {
            case 'male':
                genderElement = await $('label[for="gender-radio-1"]');
                break;
            case 'female':
                genderElement = await $('label[for="gender-radio-2"]');
                break;
            case 'other':
                genderElement = await $('label[for="gender-radio-3"]');
                break;
            default:
                throw new Error(`Invalid gender provided: ${gender}`);
        }

        await genderElement.scrollIntoView();
        await genderElement.click();
    }

    public async selectState(state: string): Promise<void> {
        await this.stateDropDown.scrollIntoView();
        await this.stateDropDown.click();
        const stateOption = await $(`//div[contains(@id,'react-select-3-option') and text()='${state}']`);
        await stateOption.waitForClickable({ timeout: 5000 });
        await stateOption.click();
    }

    public async selectCity(city: string): Promise<void> {
        await this.cityDropDown.scrollIntoView();
        await this.cityDropDown.click();
        const cityOption = await $(`//div[contains(@id,'react-select-4-option') and text()='${city}']`);
        await cityOption.waitForClickable({ timeout: 5000 });
        await cityOption.click();
    }

    public async submitForm(): Promise<void> {
        await this.submitButton.scrollIntoView();
        await this.submitButton.waitForClickable({ timeout: 5000 });
        await this.submitButton.click();
    }

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
    public async selectSubjects(subjects: string[]): Promise<void> {
        for (const subject of subjects) {
            await this.inputSubjects.setValue(subject);
            await browser.keys('Enter');
        }
    }

    public async selectHobbies(hobbies: string[]): Promise<void> {
        for (const hobby of hobbies) {
            const hobbyCheckbox = await $(`//label[text()='${hobby}']`);
            await hobbyCheckbox.scrollIntoView();
            await hobbyCheckbox.click();
        }
    }

    public async uploadPicture(filePath: string): Promise<void> {
        const remoteFilePath = await browser.uploadFile(filePath);
        await this.uploadPictureInput.setValue(remoteFilePath);
    }

    public async getModalValueByLabel(label: string): Promise<string> {
        const row = await $(`//td[text()='${label}']/following-sibling::td`);
        await row.waitForDisplayed({ timeout: 5000 });
        return await row.getText();
    }

    public async closeModal(): Promise<void> {
        await this.modalCloseButton.scrollIntoView();
        await this.modalCloseButton.waitForClickable({ timeout: 5000 });
        await this.modalCloseButton.click();
    }
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
    public async verifyFormFieldsAreEmpty(): Promise<void> {
    expect(await this.inputFirstName.getValue()).to.equal('');
    expect(await this.inputLastName.getValue()).to.equal('');
    expect(await this.inputEmail.getValue()).to.equal('');
    expect(await this.inputMobileNumber.getValue()).to.equal('');
    expect(await this.inputCurrentAddress.getValue()).to.equal('');
    expect(await this.inputSubjects.getValue()).to.equal('');
    }
    public async verifyStateAndCityAreEmpty(): Promise<void> {
    expect(await this.stateDropDown.getText()).to.equal('Select State');
    expect(await this.cityDropDown.getText()).to.equal('Select City');
    }
public async waitForFieldToBeInvalid(element: WebdriverIO.Element, timeout = 2000): Promise<void> {
  await browser.waitUntil(
    async () => {
      const borderColor = await element.getCSSProperty('border-color');
      return borderColor.parsed?.hex?.toLowerCase() === '#dc3545';
    },
    {
      timeout,
      timeoutMsg: '❌ Border color did not become #dc3545 within expected time'
    }
  );
}
}

export const formsPage = new FormsPage();
