import Page from './page';

export enum CardName {
  elements = 'Elements',
  forms = 'Forms',
  alertsFrameWindows = 'Alerts, Frame & Windows',
  widgets = 'Widgets',
  interactions = 'Interactions',
  bookStoreApplication = 'Book Store Application'
}

export enum ElementsMenuItem {
  textBox = 'Text Box',
  checkBox = 'Check Box',
  radioButton = 'Radio Button',
  webTables = 'Web Tables',
  buttons = 'Buttons',
  links = 'Links',
  brokenLinksImages = 'Broken Links - Images',
  uploadDownload = 'Upload and Download',
  dynamicProperties = 'Dynamic Properties'
}

export enum FormsMenuItem {
  practiceForm = 'Practice Form'
}

export enum AlertsFrameWindowsMenuItem {
  browserWindows = 'Browser Windows',
  alerts = 'Alerts',
  frames = 'Frames',
  nestedFrames = 'Nested Frames',
  modalDialogs = 'Modal Dialogs'
}

export enum WidgetsMenuItem {
  accordian = 'Accordian',
  autoComplete = 'Auto Complete',
  datePicker = 'Date Picker',
  slider = 'Slider',
  progressBar = 'Progress Bar',
  tabs = 'Tabs',
  toolTips = 'Tool Tips',
  menu = 'Menu',
  selectMenu = 'Select Menu'
}

export enum InteractionsMenuItem {
  sortable = 'Sortable',
  selectable = 'Selectable',
  resizable = 'Resizable',
  droppable = 'Droppable',
  dragabble = 'Dragabble'
}

export class HomePage extends Page {
  /**
   * Gets all card titles from the homepage.
   */
  public get allCards() {
    return $$('div.card-body h5');
  }

  /**
   * Returns a card element by its displayed name.
   * @param name - Name of the card to locate.
   */
  public getCardByName(name: CardName) {
    return $(`h5=${name}`);
  }

  /**
   * Navigates to the homepage root URL.
   */
  public async open(): Promise<void> {
    await super.open('/');
  }

  /**
   * Clicks on a specific card by name.
   * @param name - CardName enum value to identify the card.
   */
  public async clickCard(name: CardName): Promise<void> {
    const card = await this.getCardByName(name);
    await card.scrollIntoView();
    await card.click();
  }

  /**
   * Verifies all provided cards are displayed on the page.
   * @param expectedCards - Array of expected CardName enums to verify.
   */
  public async verifyAllCardsVisible(expectedCards: CardName[]): Promise<void> {
    for (const cardName of expectedCards) {
      const card = await this.getCardByName(cardName);
      await expect(card).toBeDisplayed();
    }
  }

  /**
   * Selects a menu item from the Elements section using the enum value.
   * @param item - Item from ElementsMenuItem enum.
   */
  public async selectElementMenuItem(item: ElementsMenuItem): Promise<void> {
    const element = await $(`//ul[@class="menu-list"]//span[text()="${item}"]`);
    await element.scrollIntoView();
    await element.click();
  }

  /**
   * Selects a menu item from the Forms section using the enum value.
   * @param item - Item from FormsMenuItem enum.
   */
  public async selectFormsMenuItem(item: FormsMenuItem): Promise<void> {
    const element = await $(`//ul[@class="menu-list"]//span[text()="${item}"]`);
    await element.scrollIntoView();
    await element.click();
  }

  /**
   * Selects a menu item from the Alerts, Frame & Windows section.
   * @param item - Item from AlertsFrameWindowsMenuItem enum.
   */
  public async selectAlertsMenuItem(item: AlertsFrameWindowsMenuItem): Promise<void> {
    const element = await $(`//ul[@class="menu-list"]//span[text()="${item}"]`);
    await element.scrollIntoView();
    await element.click();
  }

  /**
   * Selects a menu item from the Widgets section using the enum value.
   * @param item - Item from WidgetsMenuItem enum.
   */
  public async selectWidgetsMenuItem(item: WidgetsMenuItem): Promise<void> {
    const element = await $(`//ul[@class='menu-list']//span[text()="${item}"]`);
    await element.scrollIntoView();
    await element.click();
  }

  /**
 * Select an item from the Interactions section using enum
 * @param item Menu item from InteractionsMenuItem enum
 */
public async selectInteractionsMenuItem(item: InteractionsMenuItem): Promise<void> {
  const element = await $(`//ul[@class='menu-list']//span[text()="${item}"]`);
  await element.scrollIntoView();
  await element.click();
}
  
}

export const homePage = new HomePage();