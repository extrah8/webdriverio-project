import Page from './page';
import { expect } from 'chai';

export class WidgetsPage extends Page {
  // Auto Complete
  public get multiColorInput() { return $('#autoCompleteMultipleInput'); }
  public get singleColorInput() { return $('#autoCompleteSingleInput'); }
  public get multiColorTags() { return $$('.css-12jo7m5.auto-complete__multi-value__label'); }
  public get multiColorRemoveButtons() { return $$('.css-xb97g8.auto-complete__multi-value__remove'); }
  public get singleSelectedColor() { return $('.css-1uccc91-singleValue'); }

  // Date Picker locators
  public get dateInput() { return $('#datePickerMonthYearInput'); }
  public get dateTimeInput() { return $('#dateAndTimePickerInput'); }

  // Calendar UI elements
  public get calendarMonthDropdown() { return $('.react-datepicker__month-select'); }
  public get calendarYearDropdown() { return $('.react-datepicker__year-select'); }
  public get calendarDay15() { return $('.react-datepicker__day--015'); }

  public get sliderInput() { return $('#sliderValue'); }
  public get sliderHandle() { return $('.range-slider'); }

  // Progress Bar
  public get progressBarStartButton() { return $('#startStopButton'); }
  public get progressBarResetButton() { return $('#resetButton'); }
  public get progressBarFill() { return $('#progressBar'); }

  /**
   * Opens the specified accordion section.
   */
  public async openAccordionSection(index: number): Promise<void> {
    const section = await $(`#section${index}Heading`);
    await section.scrollIntoView();
    await section.click();
  }

  /**
   * Waits for accordion content to be displayed.
   */
  public async waitForAccordionContentDisplayed(index: number): Promise<void> {
    const content = await $(`#section${index}Content`);
    await content.waitForDisplayed({ timeout: 5000 });
  }

  /**
   * Checks if accordion content is displayed.
   */
  public async isAccordionContentDisplayed(index: number): Promise<boolean> {
    const content = await $(`#section${index}Content`);
    return await content.isDisplayed();
  }

  /**
   * Gets the text from the specified accordion section.
   */
  public async getAccordionContentText(index: number): Promise<string> {
    const content = await $(`#section${index}Content`);
    return (await content.getText()).trim();
  }

  /**
   * Validates all accordion sections by ensuring content is visible and not empty.
   */
  public async validateAllAccordionSections(): Promise<void> {
    for (const index of [1, 2, 3] as const) {
      if (index !== 1) {
        await this.openAccordionSection(index);
        await this.waitForAccordionContentDisplayed(index);
      }
      const isDisplayed = await this.isAccordionContentDisplayed(index);
      expect(isDisplayed).to.be.true;
      const text = await this.getAccordionContentText(index);
      expect(text.length).to.be.greaterThan(0);
    }
  }

  /**
   * Enters multiple colors into the multi-select input.
   */
  public async enterMultiSelectColors(colors: string[]): Promise<void> {
    for (const color of colors) {
      await this.multiColorInput.setValue(color);
      await browser.keys('Enter');
    }
  }

  /**
   * Returns the list of selected multi colors.
   */
  public async getSelectedMultiColors(): Promise<string[]> {
    const tags = await this.multiColorTags;
    const values: string[] = [];
    for (const tag of tags) {
      const text = (await tag.getText()).trim();
      values.push(text);
    }
    return values;
  }

  /**
   * Removes a specific color from the multi-select list.
   */
  public async removeMultiColor(color: string): Promise<void> {
    const tags = await this.multiColorTags;
    const removes = await this.multiColorRemoveButtons;
    for (let i = 0; i < tags.length; i++) {
      const text = await tags[i].getText();
      if (text === color) {
        await removes[i].click();
        return;
      }
    }
  }

  /**
   * Enters a single color in the single-select input.
   */
  public async enterSingleSelectColor(color: string): Promise<void> {
    await this.singleColorInput.setValue(color);
    await browser.keys('Enter');
  }

  /**
   * Gets the selected single color.
   */
  public async getSelectedSingleColor(): Promise<string> {
    return (await this.singleSelectedColor.getText()).trim();
  }

  /**
   * Enters a date manually into the date input field.
   */
  public async enterDate(date: string): Promise<void> {
    await this.dateInput.click();
    await browser.pause(100);
    await browser.keys(['Control', 'a']);
    await browser.keys('Backspace');
    await browser.pause(100);
    await browser.keys(date.split(''));
  }

  /**
   * Retrieves the value from the date input field.
   */
  public async getDateValue(): Promise<string> {
    return (await this.dateInput.getValue()).trim();
  }

  /**
   * Opens the date picker widget.
   */
  public async openDatePicker(): Promise<void> {
    await this.dateInput.click();
  }

  /**
   * Picks a specific date from the date picker UI.
   */
  public async pickDateViaUI(): Promise<void> {
    await this.dateInput.clearValue();
    await this.openDatePicker();
    await this.calendarMonthDropdown.selectByVisibleText('May');
    await this.calendarYearDropdown.selectByVisibleText('2020');
    await this.calendarDay15.click();
  }

  /**
   * Enters a full date and time string into the input.
   */
  public async enterDateTime(dateTime: string): Promise<void> {
    const input = await $('#dateAndTimePickerInput');
    await input.clearValue();
    await input.setValue(dateTime);
  }

  /**
   * Gets the current value from the date and time input.
   */
  public async getDateTimeValue(): Promise<string> {
    return (await this.dateTimeInput.getValue()).trim();
  }

  /**
   * Moves the slider to a specific value by sending arrow keys.
   */
  public async moveSliderTo(target: number): Promise<void> {
    await this.sliderHandle.scrollIntoView();
    await this.sliderHandle.click();
    let current = await this.getSliderValue();
    while (current !== target) {
      if (current < target) {
        await browser.keys('ArrowRight');
      } else {
        await browser.keys('ArrowLeft');
      }
      current = await this.getSliderValue();
    }
  }

  /**
   * Retrieves the current slider value as a number.
   */
  public async getSliderValue(): Promise<number> {
    const value = await this.sliderInput.getValue();
    return parseInt(value, 10);
  }

  /**
   * Starts the progress bar.
   */
  public async startProgressBar(): Promise<void> {
    await this.progressBarStartButton.click();
  }

  /**
   * Waits for the progress bar to reach a specific percent.
   */
  public async waitForProgressToReach(targetPercent: number, timeout = 15000): Promise<void> {
    await browser.waitUntil(async () => {
      const progressText = await this.progressBarFill.getText();
      const current = parseInt(progressText.replace('%', ''), 10);
      return current >= targetPercent;
    }, { timeout, timeoutMsg: `Progress bar did not reach ${targetPercent}% in time` });
  }

  /**
   * Resets the progress bar.
   */
  public async resetProgressBar(): Promise<void> {
    await this.progressBarResetButton.click();
  }

  /**
   * Gets the current value of the progress bar.
   * Returns 0 if progress is reset and no text is present.
   */
  public async getProgressBarValue(): Promise<number> {
    const progressText = await this.progressBarFill.getText();
    if (!progressText || !progressText.includes('%')) return 0;
    return parseInt(progressText.replace('%', ''), 10);
  }


}

export const widgetsPage = new WidgetsPage();
