import path from 'path';
import { expect } from 'chai';
import { homePage, CardName, FormsMenuItem } from '../../../pageobjects/home.page';
import { formsPage } from '../../../pageobjects/forms.page';
import {
  randomString,
  randomPhoneNumber,
  randomItem,
  genders,
  subjects,
  hobbies,
  states,
  cities
} from '../../../utils/dataGenerator';

describe('DemoQA Forms Section', () => {

  it('Should fill Practice Form with random data, validate modal and reset form fields', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.forms);
    await homePage.selectFormsMenuItem(FormsMenuItem.practiceForm);

    const firstName = randomString(5);
    const lastName = randomString(7);
    const email = `${randomString(5)}@example.com`;
    const mobileNumber = randomPhoneNumber();
    const currentAddress = `${randomString(10)} Street`;
    const genders = ['Male', 'Female', 'Other'] as const;
    type Gender = typeof genders[number];
    const gender: Gender = randomItem([...genders]);
    const selectedSubjects = [randomItem(subjects)];
    const selectedHobbies = [randomItem(hobbies)];
    const state = randomItem(states);
    const city = randomItem(cities[state as keyof typeof cities]);

    await formsPage.fillForm(firstName, lastName, email, mobileNumber, currentAddress);
    await formsPage.selectGender(gender);
    await formsPage.selectDateOfBirth('01 December 2000');
    await formsPage.selectSubjects(selectedSubjects);
    await formsPage.selectHobbies(selectedHobbies);

    const filePath = path.resolve('./fixtures/test_img.png');
    await formsPage.uploadPicture(filePath);

    await formsPage.selectState(state);
    await formsPage.selectCity(city);
    await formsPage.submitForm();

    await formsPage.verifyModalData(
      `${firstName} ${lastName}`,
      email,
      gender,
      mobileNumber,
      '01 December,2000',
      selectedSubjects.join(', '),
      selectedHobbies.join(', '),
      'test_img.png',
      currentAddress,
      `${state} ${city}`
    );

    await formsPage.closeModal();
    await formsPage.verifyFormFieldsAreEmpty();

    expect(await formsPage.stateDropDown.getText()).to.equal('Select State');
    expect(await formsPage.cityDropDown.getText()).to.equal('Select City');
  });

  it('Should not submit form with invalid email and missing mobile number, highlighting errors', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.forms);
    await homePage.selectFormsMenuItem(FormsMenuItem.practiceForm);

    await formsPage.fillForm('John', 'Doe', 'invalidemail', '', 'Some Address');
    await formsPage.selectGender('Male');
    await formsPage.selectDateOfBirth('01 December 2000');
    await formsPage.selectSubjects(['Maths']);
    await formsPage.selectHobbies(['Sports']);

    const filePath = path.resolve('./fixtures/test_img.png');
    await formsPage.uploadPicture(filePath);

    await formsPage.selectState('NCR');
    await formsPage.selectCity('Delhi');
    await formsPage.submitForm();

    const isModalDisplayed = await formsPage.modalTitle.isDisplayed().catch(() => false);
    expect(isModalDisplayed).to.be.false;

    await formsPage.waitForFieldToBeInvalid(formsPage.inputEmail);
    await formsPage.waitForFieldToBeInvalid(formsPage.inputMobileNumber);
  });

});