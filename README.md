# Readme - Simple Static Homepage

This repository contains a simple static website that works without a server. You can easily download the files, customize the links and logos you want to display, and open the `index.html` file in your web browser to see the changes.

## Features

- Displays custom links with corresponding logos or favicons.
- Automatically attempts to fetch the best possible favicon when the provided logo is not available.
- Fully static and works without a server.

## Usage

1. **Download Files**: Clone or download the repository to your local machine.

2. **Customize Links and Logos**: 
   - Open the `links.js` file.
   - Add or remove links and corresponding logos according to your preferences.

3. **Open `index.html`**: Once you have customized the links and logos, simply open the `index.html` file in your preferred web browser.

## Favicon Fallback Logic:

If the main icon fails, fallback URLs are tried in order:

1. **SimpleIcons CDN**:
   `https://cdn.simpleicons.org/[service-name]`

2. **Root Favicon**:
   `[protocol]://[host]/favicon.ico`

If all fail, the icon is hidden to keep the UI clean.

## Additional Notes

- This static website is designed to be simple and easy to use.
- You can customize the HTML, CSS, and JavaScript files further to suit your specific needs.
- If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.


## Live Example

See [https://vanbassum.github.io/HomePage](https://vanbassum.github.io/HomePage) for a live example hosted on GitHub Pages.
