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

export class HomePage extends Page {
    public get allCards() {
        return $$('div.card-body h5');
    }

    public getCardByName(name: CardName) {
        return $(`h5=${name}`);
    }

    public async clickCard(name: CardName): Promise<void> {
        const card = await this.getCardByName(name);
        await card.scrollIntoView();
        await card.click();
    }

    public async verifyAllCardsVisible(expectedCards: CardName[]): Promise<void> {
        for (const cardName of expectedCards) {
            const card = await this.getCardByName(cardName);
            await expect(card).toBeDisplayed();
        }
    }

    public async open(): Promise<void> {
        await super.open('/');
    }

    /**
     * Select an item from the Elements section using enum
     * @param item Menu item from ElementsMenuItem enum
     */
    public async selectElementMenuItem(item: ElementsMenuItem): Promise<void> {
        const element = await $(`//ul[@class="menu-list"]//span[text()="${item}"]`);
        await element.scrollIntoView();
        await element.click();
    }

    /**
     * Select an item from the Forms section using enum
     * @param item Menu item from FormsMenuItem enum
     */
    public async selectFormsMenuItem(item: FormsMenuItem): Promise<void> {
        const element = await $(`//ul[@class="menu-list"]//span[text()="${item}"]`);
        await element.scrollIntoView();
        await element.click();
    }
    /**
     * Select an item from the Forms section using enum
     * @param item Menu item from AlertsFrameWindowsMenuItem enum
     */
    public async selectAlertsMenuItem(item: AlertsFrameWindowsMenuItem): Promise<void> {
    const element = await $(`//ul[@class="menu-list"]//span[text()="${item}"]`);
    await element.scrollIntoView();
    await element.click();
    }
}

export const homePage = new HomePage();