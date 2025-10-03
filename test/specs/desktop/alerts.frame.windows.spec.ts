import { expect } from 'chai';
import { homePage, CardName, AlertsFrameWindowsMenuItem } from '../../../pageobjects/home.page';
import { alertsFrameWindowsPage } from '../../../pageobjects/alerts.frame.windows.page';

async function killAds() {
  await browser.execute(() => {
    const selectors = [
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '.adsbygoogle',
      '[aria-label="Advertisement"]'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());
  });
}

describe('DemoQA Alerts, Frame & Windows Section', () => {

  it('Browser Windows - should handle tab and window navigation', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.alertsFrameWindows);
    await homePage.selectAlertsMenuItem(AlertsFrameWindowsMenuItem.browserWindows);

    await alertsFrameWindowsPage.openNewTabAndValidate('This is a sample page');
    await killAds();
    await alertsFrameWindowsPage.openNewWindowAndValidate('This is a sample page');
    await alertsFrameWindowsPage.openNewWindowMessageAndValidate();
  });

  it('Alerts - should handle simple, confirm, prompt, and delayed alerts', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.alertsFrameWindows);
    await homePage.selectAlertsMenuItem(AlertsFrameWindowsMenuItem.alerts);

    await alertsFrameWindowsPage.handleSimpleAlert('You clicked a button');
    await alertsFrameWindowsPage.handleConfirmAlert(false, 'Do you confirm action?');
    await alertsFrameWindowsPage.waitForAlertResult('You selected Cancel');
    await alertsFrameWindowsPage.handleDelayedAlert('This alert appeared after 5 seconds');
  });

  it('Frames - should verify text in both frames is same and visible', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.alertsFrameWindows);
    await homePage.selectAlertsMenuItem(AlertsFrameWindowsMenuItem.frames);

    const frame1Text = await alertsFrameWindowsPage.switchToFrameAndGetText(alertsFrameWindowsPage.frame1);
    const frame2Text = await alertsFrameWindowsPage.switchToFrameAndGetText(alertsFrameWindowsPage.frame2);

    expect(frame1Text).to.equal('This is a sample page');
    expect(frame2Text).to.equal('This is a sample page');
    expect(await alertsFrameWindowsPage.isFrameContentFullyVisible(alertsFrameWindowsPage.frame1)).to.be.true;
    expect(await alertsFrameWindowsPage.isFrameContentFullyVisible(alertsFrameWindowsPage.frame2)).to.be.true;
  });

  it('Nested Frames - should verify content in parent and child frames', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.alertsFrameWindows);
    await homePage.selectAlertsMenuItem(AlertsFrameWindowsMenuItem.nestedFrames);

    const { parentText, childText } = await alertsFrameWindowsPage.getNestedFrameTexts();
    expect(parentText).to.include('Parent frame');
    expect(childText).to.equal('Child Iframe');
  });

  it('Modal Dialogs - should open and close small and large modals with correct content', async () => {
    await homePage.open();
    await homePage.clickCard(CardName.alertsFrameWindows);
    await homePage.selectAlertsMenuItem(AlertsFrameWindowsMenuItem.modalDialogs);

    const smallModal = await alertsFrameWindowsPage.handleModalDialog('small');
    expect(smallModal.title).to.equal('Small Modal');
    expect(smallModal.body).to.include('This is a small modal.');

    const largeModal = await alertsFrameWindowsPage.handleModalDialog('large');
    expect(largeModal.title).to.equal('Large Modal');
    expect(largeModal.body).to.include('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
  });

});