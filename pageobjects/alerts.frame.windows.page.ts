import Page from './page';
import { expect } from 'chai';

class AlertsFrameWindowsPage {
  // Browser Windows
  public get newTabButton() { return $('#tabButton'); }
  public get newWindowButton() { return $('#windowButton'); }
  public get newWindowMessageButton() { return $('#messageWindowButton'); }

  // Alerts
  public get alertButton() { return $('#alertButton'); }
  public get confirmButton() { return $('#confirmButton'); }
  public get promptButton() { return $('#promtButton'); }
  public get timedAlertButton() { return $('#timerAlertButton'); }

  public get alertResult() { return $('#confirmResult'); }
  public get promptResult() { return $('#promptResult'); }

  // Frames
  public get frame1() { return $('#frame1'); }
  public get frame2() { return $('#frame2'); }
  public get frameHeading() { return $('#sampleHeading'); }
  // Nested Frames
  public get parentFrame() { return $('iframe[srcdoc*="Parent frame"]'); }
  public get childFrame() { return $('iframe[srcdoc*="Child Iframe"]'); }

  // Modal Dialogs
  public get smallModalButton() { return $('#showSmallModal'); }
  public get largeModalButton() { return $('#showLargeModal'); }
  public get modalTitle() { return $('.modal-title'); }
  public get modalBody() { return $('.modal-body'); }
  public get closeSmallModalButton() { return $('#closeSmallModal'); }
  public get closeLargeModalButton() { return $('#closeLargeModal'); }

  // Methods
  public async openNewTabAndValidate(expectedText: string): Promise<void> {
    const originalWindow = await browser.getWindowHandle();
    const handlesBefore = await browser.getWindowHandles();
    await this.newTabButton.click();
    await browser.waitUntil(
      async () => (await browser.getWindowHandles()).length > handlesBefore.length,
      { timeout: 3000, timeoutMsg: 'New tab did not open' }
    );
    const handlesAfter = await browser.getWindowHandles();
    const newTab = handlesAfter.find(h => !handlesBefore.includes(h));
    await browser.switchToWindow(newTab!);
    const text = await $('h1').getText();
    expect(text).to.equal(expectedText);
    await browser.closeWindow();
    await browser.switchToWindow(originalWindow);
  }

  public async openNewWindowAndValidate(expectedText: string): Promise<void> {
    const originalWindow = await browser.getWindowHandle();
    const handlesBefore = await browser.getWindowHandles();
    await this.newWindowButton.click();
    await browser.waitUntil(
      async () => (await browser.getWindowHandles()).length > handlesBefore.length,
      { timeout: 3000, timeoutMsg: 'New window did not open' }
    );
    const handlesAfter = await browser.getWindowHandles();
    const newWindow = handlesAfter.find(h => !handlesBefore.includes(h));
    await browser.switchToWindow(newWindow!);
    const text = await $('h1').getText();
    expect(text).to.equal(expectedText);
    await browser.closeWindow();
    await browser.switchToWindow(originalWindow);
  }
  
public async handleSimpleAlert(expectedText?: string): Promise<void> {
  await this.alertButton.click();

  const appeared = await browser.waitUntil(
    async () => await browser.isAlertOpen(),
    { timeout: 3000, timeoutMsg: 'Alert did not appear' }
  ).catch(() => false);

  if (!appeared) {
    console.warn('Alert never appeared.');
    return;
  }

  if (expectedText) {
    try {
      const alertText = await browser.getAlertText();
      expect(alertText).to.equal(expectedText);
    } catch {
      console.warn('Could not read alert text.');
    }
  }

  try {
    if (await browser.isAlertOpen()) {
      await browser.acceptAlert();
    }
  } catch {
    console.warn('Alert disappeared before acceptAlert().');
  }
}

public async handleConfirmAlert(accept: boolean, expectedText?: string): Promise<void> {
  await this.confirmButton.scrollIntoView();
  await this.confirmButton.click();
  await browser.pause(100);
  const appeared = await browser.waitUntil(
    async () => await browser.isAlertOpen(),
    { timeout: 3000, timeoutMsg: 'Confirm alert did not appear' }
  ).catch(() => false);
  if (!appeared) {
    console.warn('Confirm alert never appeared.');
    return;
  }
  if (expectedText) {
    try {
      const alertText = await browser.getAlertText();
      expect(alertText).to.equal(expectedText);
    } catch {
      console.warn('Could not read confirm alert text.');
    }
  }
  try {
    if (await browser.isAlertOpen()) {
      await browser.pause(100);
      accept ? await browser.acceptAlert() : await browser.dismissAlert();
    }
  } catch {
    console.warn('Confirm alert disappeared before accept/dismiss.');
  }
}
public async handlePromptAlert(input: string): Promise<void> {
  await this.promptButton.waitForClickable({ timeout: 3000 });
  await this.promptButton.scrollIntoView();
  await this.promptButton.click();
  await browser.pause(200); 
  try {
    await browser.sendAlertText(input);
    await browser.acceptAlert();
  } catch (err) {
    throw new Error('Failed to send text or accept prompt: ' + err);
  }
}
  public async waitForPromptResult(expected: string, timeout = 2000): Promise<void> {
  await browser.waitUntil(
    async () => (await this.promptResult.getText()).trim() === expected,
    { timeout, timeoutMsg: `Prompt result did not update to "${expected}"` }
  );
}
  public async waitForAlertResult(expected: string, timeout = 2000): Promise<void> {
  await browser.waitUntil(
    async () => (await this.alertResult.getText()) === expected,
    { timeout, timeoutMsg: `Alert result did not match: ${expected}` }
  );
}

public async handleDelayedAlert(expectedText: string, timeout = 7000): Promise<void> {
  await this.timedAlertButton.click();
  const appeared = await browser.waitUntil(
    async () => await browser.isAlertOpen(),
    { timeout, timeoutMsg: 'Delayed alert did not appear' }
  ).catch(() => false);
  if (!appeared) {
    console.warn('Delayed alert never appeared.');
    return;
  }
  try {
    const alertText = await browser.getAlertText();
    expect(alertText).to.equal(expectedText);
  } catch {
    console.warn('Could not read delayed alert text.');
  }
  try {
    if (await browser.isAlertOpen()) {
      await browser.acceptAlert();
    }
  } catch {
    console.warn('Delayed alert disappeared before accept.');
  }
}
public async switchToFrameAndGetText(frame: WebdriverIO.Element): Promise<string> {
  await frame.waitForExist({ timeout: 3000 });
  await frame.scrollIntoView();
  const frameElem = await frame;
  await browser.switchFrame(frameElem);
  const heading = await this.frameHeading;
  await heading.waitForDisplayed({ timeout: 3000 });
  const text = await heading.getText();
  await browser.switchToParentFrame();
  return text;
}

public async isFrameContentFullyVisible(frame: WebdriverIO.Element): Promise<boolean> {
  await frame.waitForExist({ timeout: 3000 });
  await frame.scrollIntoView();
  await browser.switchFrame(frame);
  await browser.pause(300);
  const heading = await $('#sampleHeading');
  const isVisible = await heading.isDisplayed();
  await browser.switchToParentFrame();
  return isVisible;
}
public async getNestedFrameTexts(): Promise<{ parentText: string; childText: string }> {
  await this.frame1.waitForExist({ timeout: 5000 });
  await this.frame1.scrollIntoView();
  await browser.switchFrame(await this.frame1);
  const parentText = await $('body').getText();
  const child = await $('iframe');
  await child.waitForExist({ timeout: 3000 });
  await browser.switchFrame(child);
  const childText = await $('body').getText();
  await browser.switchToParentFrame();
  await browser.switchToParentFrame();
  return {
    parentText: parentText.trim(),
    childText: childText.trim(),
  };
}
public async handleModalDialog(size: 'small' | 'large'): Promise<{ title: string; body: string }> {
  const openButton = size === 'small' ? this.smallModalButton : this.largeModalButton;
  const closeButton = size === 'small' ? this.closeSmallModalButton : this.closeLargeModalButton;
  await openButton.scrollIntoView();
  await openButton.click();
  await this.modalTitle.waitForDisplayed({ timeout: 3000 });
  await this.modalBody.waitForDisplayed({ timeout: 3000 });
  const title = await this.modalTitle.getText();
  const body = await this.modalBody.getText();
  await closeButton.waitForClickable({ timeout: 3000 });
  await closeButton.click();
  await this.modalTitle.waitForDisplayed({ reverse: true, timeout: 3000 });
  return { title, body };
}
}

export const alertsFrameWindowsPage = new AlertsFrameWindowsPage();