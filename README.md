# Readme - Simple Static Homepage

This repository contains a simple static website that works without a server. You can easily download the files, customize the links and logos you want to display, and open the `index.html` file in your web browser to see the changes.

---

## Features

- Displays custom links with corresponding logos or favicons.
- Automatically attempts to fetch the best possible favicon when the provided logo is not available.
- Fully static and works without a server.

---

## Usage

1. **Download Files**: Clone or download the repository to your local machine.

2. **Customize Links and Logos**: 
   - Open the `links.js` file.
   - Add or remove links and corresponding logos according to your preferences.

3. **Open `index.html`**: Once you have customized the links and logos, simply open the `index.html` file in your preferred web browser.

4. **Favicon Fallback Logic**:
   - If the provided logo URL fails to load, the application automatically attempts to fetch the favicon using the following order:
     1. **Google Favicon Service**: 
        Fetches a high-quality favicon using Google's service:
        `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=[DOMAIN]&size=128`.
     2. **HTML `<link>` Tag**: Parses the target domain's HTML to find any favicon defined in `<link rel="icon">` or similar tags.
     3. **Root Favicon**: Tries the common `favicon.ico` located at the root of the domain.
   - If all attempts fail, the logo container is hidden to ensure a clean UI.


---

## Additional Notes

- This static website is designed to be simple and easy to use.
- You can customize the HTML, CSS, and JavaScript files further to suit your specific needs.
- If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

---

## Live Example

See [https://vanbassum.github.io/HomePage](https://vanbassum.github.io/HomePage) for a live example hosted on GitHub Pages.
