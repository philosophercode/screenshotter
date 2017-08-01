const CDP = require('chrome-remote-interface');
const chromeLauncher = require('lighthouse/chrome-launcher/chrome-launcher');
const file = require('fs');
const prompt = require('prompt');
const wf = require('word-freq');
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
    //   'https://www.google.com/',
      '--window-size=1000,1000',
    //   '--screenshot',
      '--disable-gpu',
      headless ? '--headless' : ''

    ]
  });
}
prompt.start();

prompt.get(['url'], function (err, result) {
//
// Log the results.
//
    console.log('Command-line input received:');
    console.log('  url: ' + result.url);
    launchChrome().then(async chrome => {

        (async function() {

            const chrome = await launchChrome();
            const protocol = await CDP({port: chrome.port});

            // Extract the DevTools protocol domains we need and enable them.
            // See API docs: https://chromedevtools.github.io/devtools-protocol/
            const {Page, Runtime} = protocol;
            await Promise.all([Page.enable(), Runtime.enable()]);

            Page.navigate({url: `${result.url}`});

            // Wait for window.onload before doing stuff.
            Page.loadEventFired(async () => {
                const title = "document.querySelector('title').textContent";
                // Evaluate the JS expression in the page.
                const result = await Runtime.evaluate({expression: title});

                console.log('Title of page: ' + result.result.value);

                const bodyText = "document.querySelector('body').textContent";
                // Evaluate the JS expression in the page.
                const result2 = await Runtime.evaluate({expression: bodyText});
                const str = result2.result.value
                console.log('Body of page: ' + result2.result.value);


                const frequency = wf.freq(str);
                console.log(frequency);

                const screenshot = await Page.captureScreenshot('png');
                const buffer = new Buffer(screenshot.data, 'base64');
                
                // console.log(screenshot);
                // console.log(buffer);
                
                file.writeFile(`${result.result.value}.png`, buffer, 'base64', function(err) {
                    if (err) {
                    console.error(err);
                    } else {
                    console.log('Screenshot saved');
                    }
                    protocol.close();
                });

                protocol.close();
                chrome.kill(); // Kill Chrome.
            });
            

        })();
        chrome.kill();
    });
});


