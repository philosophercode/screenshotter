const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const CDP = require('chrome-remote-interface');
// const protocol = await CDP({port: chrome.port});
// const {Page, Runtime} = protocol;
// await Promise.all([Page.enable(), Runtime.enable()]);

        const protocol = await CDP({port: chrome.port});

        // Extract the DevTools protocol domains we need and enable them.
        // See API docs: https://chromedevtools.github.io/devtools-protocol/
        const {Page, Runtime} = protocol;




/**
 * Launches a debugging instance of Chrome.
 * @param {boolean=} headless True (default) launches Chrome in headless mode.
 *     False launches a full version of Chrome.
 * @return {Promise<ChromeLauncher>}
 */
async function launchChrome(headless = false) {
  return await chromeLauncher.launch({
    // port: 9222, // Uncomment to force a specific port of your choice.
    chromeFlags: [
      '--window-size=412,732',
      '--disable-gpu',
      headless ? '--headless' : ''
    ]
  });
}

launchChrome(true).then(chrome => {
 console.log('launched');



        await Promise.all([Page.enable(), Runtime.enable()]);

        Page.navigate({url: 'https://www.chromestatus.com/'});

        // Wait for window.onload before doing stuff.
        Page.loadEventFired(async () => {
        const js = "document.querySelector('title').textContent";
        // Evaluate the JS expression in the page.
        const result = await Runtime.evaluate({expression: js});

        console.log('Title of page: ' + result.result.value);

        protocol.close();
        chrome.kill(); // Kill Chrome.
        });

});