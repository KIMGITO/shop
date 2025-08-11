import { toJpeg, toPng } from 'html-to-image';

type HTMLElementOrNull = HTMLElement | null;

/**
 * Image Helper Utility
 * Provides functions to save or print DOM elements as images
 */
const imageHelper = {
    /**
     * Save element as PNG image
     * @param {HTMLElement} element - DOM element to capture
     * @param {string} filename - Output filename (without extension)
     * @param {Object} options - html-to-image options
     */
    saveAsPng: async (element: HTMLElementOrNull, filename: string = 'image', options: object = {}): Promise<boolean> => {
        try {
            if (!element) throw new Error('No element provided');

            const defaultOptions = {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: 'white',
                ...options,
            };

            const dataUrl = await toPng(element, defaultOptions);
            downloadImage(dataUrl, `${filename}.png`);
            return true;
        } catch (error) {
            console.error('Error saving as PNG:', error);
            return false;
        }
    },

    /**
     * Save element as JPEG image
     * @param {HTMLElement} element - DOM element to capture
     * @param {string} filename - Output filename (without extension)
     * @param {Object} options - html-to-image options
     */
    saveAsJpeg: async (element: HTMLElementOrNull, filename: string = 'image', options: object = {}): Promise<boolean> => {
        try {
            if (!element) throw new Error('No element provided');

            const defaultOptions = {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: 'white',
                ...options,
            };

            const dataUrl = await toJpeg(element, defaultOptions);
            downloadImage(dataUrl, `${filename}.jpg`);
            return true;
        } catch (error) {
            console.error('Error saving as JPEG:', error);
            return false;
        }
    },

    /**
     * Print element as image
     * @param {HTMLElement} element - DOM element to print
     * @param {Object} options - html-to-image options
     */
    printAsImage: async (element: HTMLElementOrNull, options: object = {}): Promise<boolean> => {
        try {
            if (!element) throw new Error('No element provided');

            const defaultOptions = {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: 'white',
                ...options,
            };

            const dataUrl = await toPng(element, defaultOptions);
            printImage(dataUrl);
            return true;
        } catch (error) {
            console.error('Error printing image:', error);
            return false;
        }
    },

    /**
     * Hide elements before capturing image
     * @param {HTMLElement} element - Parent element
     * @param {string} selector - CSS selector for elements to hide
     */
    hideElements: (element: HTMLElementOrNull, selector: string = 'button, a, .no-print'): HTMLElement[] => {
        if (!element) return [];

        const elements = Array.from(element.querySelectorAll(selector)) as HTMLElement[];
        elements.forEach((el) => {
            el.dataset.originalDisplay = el.style.display;
            el.style.display = 'none';
        });
        return elements;
    },

    /**
     * Restore hidden elements
     * @param {Array} elements - Elements to restore
     */
    restoreElements: (elements: HTMLElement[]): void => {
        elements.forEach((el) => {
            if (el && el.style) {
                el.style.display = el.dataset.originalDisplay || '';
            }
        });
    },
};

// Helper function to trigger download
function downloadImage(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Helper function to print image
function printImage(dataUrl: string): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @page { size: auto; margin: 0mm; }
            body { margin: 0; padding: 0; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print();window.close()">
        </body>
      </html>
    `);
        printWindow.document.close();
    }
}

export default imageHelper;
