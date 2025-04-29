import { browser, expect } from '@wdio/globals';

export default class Page {
    /**
     * Open a webpage by the given path
     * @param path URL path to open
     */
    async open(path: string): Promise<void> {
        await browser.url(path);
    }

    /**
     * Click on an element by selector
     * @param selector CSS or XPath selector
     */
    async click(selector: string): Promise<void> {
        const element = await $(selector);
        await element.waitForClickable({ timeout: 5000 });
        await element.click();
    }

    /**
     * Type text into an input field
     * @param selector CSS or XPath selector
     * @param value Text to type
     */
    async type(selector: string, value: string): Promise<void> {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout: 5000 });
        await element.setValue(value);
    }

    /**
     * Get the text content of an element
     * @param selector CSS or XPath selector
     */
    async getText(selector: string): Promise<string> {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout: 5000 });
        return element.getText();
    }

    /**
     * Check if an element is visible
     * @param selector CSS or XPath selector
     */
    async isVisible(selector: string): Promise<boolean> {
        const element = await $(selector);
        return element.isDisplayed();
    }

    /**
     * Wait until an element becomes visible
     * @param selector CSS or XPath selector
     * @param timeout Timeout in milliseconds (default 5000 ms)
     */
    async waitUntilVisible(selector: string, timeout = 5000): Promise<void> {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout });
    }

    /**
     * Scroll to an element
     * @param selector CSS or XPath selector
     */
    async scrollIntoView(selector: string): Promise<void> {
        const element = await $(selector);
        await element.scrollIntoView();
    }

    /**
     * Assert that the text of an element matches the expected value
     * @param selector CSS or XPath selector
     * @param expectedText Expected text value
     */
    async assertText(selector: string, expectedText: string): Promise<void> {
        const actualText = await this.getText(selector);
        expect(actualText).toBe(expectedText);
    }

    /**
     * Get a specific attribute value of an element
     * @param selector CSS or XPath selector
     * @param attribute Attribute name
     */
    async getAttribute(selector: string, attribute: string): Promise<string | null> {
        const element = await $(selector);
        return element.getAttribute(attribute);
    }

    /**
     * Wait for an element to be clickable and then click
     * @param selector CSS or XPath selector
     * @param timeout Timeout in milliseconds (default 5000 ms)
     */
    async waitAndClick(selector: string, timeout = 5000): Promise<void> {
        const element = await $(selector);
        await element.waitForClickable({ timeout });
        await element.click();
    }

    /**
     * Clear an input field and type new text
     * @param selector CSS or XPath selector
     * @param text Text to type
     */
    async clearAndType(selector: string, text: string): Promise<void> {
        const element = await $(selector);
        await element.waitForDisplayed();
        await element.clearValue();
        await element.setValue(text);
    }

    /**
     * Hover over an element
     * @param selector CSS or XPath selector
     */
    async hoverOverElement(selector: string): Promise<void> {
        const element = await $(selector);
        await element.moveTo();
    }

    /**
     * Get the number of elements matching a selector
     * @param selector CSS or XPath selector
     */
    async getElementCount(selector: string): Promise<number> {
        const elements = await $$(selector);
        return elements.length;
    }

    /**
     * Scroll the page by a given amount
     * @param x Horizontal scroll amount
     * @param y Vertical scroll amount
     */
    async scrollBy(x: number, y: number): Promise<void> {
        await browser.execute((scrollX, scrollY) => {
            window.scrollBy(scrollX, scrollY);
        }, x, y);
    }

    /**
     * Wait until an element disappears from the page
     * @param selector CSS or XPath selector
     * @param timeout Timeout in milliseconds (default 5000 ms)
     */
    async waitUntilElementDisappears(selector: string, timeout = 5000): Promise<void> {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout, reverse: true });
    }

    /**
     * Set the state of a checkbox (checked or unchecked)
     * @param selector CSS or XPath selector
     * @param value True to check, false to uncheck
     */
    async setCheckbox(selector: string, value: boolean): Promise<void> {
        const checkbox = await $(selector);
        const isSelected = await checkbox.isSelected();
        if (isSelected !== value) {
            await checkbox.click();
        }
    }
}