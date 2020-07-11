import fetch from "node-fetch";

export const wakeUpDyno = (url: string, interval = 25) => {
    const milliseconds = interval * 60000;
    setTimeout(() => {
        try {
            console.log(`setTimeout called.`);
            // HTTP GET request to the dyno's url
            fetch(url).then(() => console.log(`Fetching ${url}.`));
        } catch (err) {
            // catch fetch errors
            console.log(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
        } finally {
            return wakeUpDyno(url, interval);
        }
    }, milliseconds);
};
