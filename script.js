const cardContainer = document.getElementById('cardContainer');

async function checkOnlineStatus(url) {
    try {
        const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
        return true;
    } catch (error) {
        return false;
    }
}

async function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('col-md-6', 'col-lg-4', 'card-container');

    const badgeElement = document.createElement('span');
    badgeElement.classList.add('badge', 'badge-unknown', 'badge-secondary', 'mt-2');
    badgeElement.textContent = 'Checking';

    const cardContent = `
        <div class="card link-card" data-url="${item.link}">
            <div class="card-body d-flex">
                <div class="logo-container">
                    <img src="${item.icon}" alt="${item.title}" class="logo-img">
                </div>
                <div class="title-content">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-description">${item.description}</p>
                </div>
                <div class="buttons-container">
                    ${createButtons(item)}
                </div>
            </div>
        </div>
    `;

    card.innerHTML = cardContent;

    const imgElement = card.querySelector('.logo-img');


    imgElement.onerror = async function () {
        switch (imgElement.imageTryoutState) {
            default:
                imgElement.src = await findGoogleFavicon(item.link);
                imgElement.imageTryoutState = 0;
                break;
            case 1:
                imgElement.src = await findRootFavicon(item.link);
                break;
            case 2: 
                imgElement.src = await findHtmlFavicon(item.link);
                break;
            case 3:
                imgElement.style.display = 'none'; // Hide image if no valid favicon found
                imgElement.onerror = null; // Prevent recursion on the next error
                break;
        }

        imgElement.imageTryoutState++; // Fall through if no favicon found
    };

    card.querySelector('.title-content').appendChild(badgeElement);
    card.addEventListener('click', handleCardClick);
    card.addEventListener('auxclick', handleCardAuxClick);

    const buttonsContainer = card.querySelector('.buttons-container');
    if (buttonsContainer) {
        buttonsContainer.addEventListener('click', handleButtonClicked);
    }

    cardContainer.appendChild(card);
    updateBadgeStatus(card, item.link);
}







function createButtons(item) {
    if (!item.buttons) {
        return '';
    }

    return item.buttons.map(button => `
        <button class="btn btn-primary btn-sm" data-url="${button.url}">
            ${button.label}
        </button>
    `).join('');
}

function handleCardClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== 'BUTTON') {
        const card = clickedElement.closest('.card');
        if (card) {
            const cardLink = card.getAttribute('data-url');
            if (cardLink) {
                window.location.href = cardLink;
            }
        }
    }
}

function handleCardAuxClick(event) {
    const clickedElement = event.target;
    if (clickedElement.tagName !== 'BUTTON') {
        const card = clickedElement.closest('.card');
        if (card) {
            const cardLink = card.getAttribute('data-url');
            if (cardLink) {
                if (event.button === 0) {
                    window.location = cardLink.href;
                } else if (event.button === 1) {
                    window.open(cardLink, '_blank');
                }
            }
        }
    }
}

function handleButtonClicked(event) {
    const button = event.target;
    const buttonUrl = button.getAttribute('data-url');

    if (buttonUrl) {
        fetch(buttonUrl, { method: 'GET', mode: 'no-cors' })
            .then(response => {
                // Handle the response as needed
            })
            .catch(error => {
                console.error('Error fetching URL:', error);
            });
    }
}

async function updateBadgeStatus(card, link) {
    const badgeElement = card.querySelector('.badge-unknown');
    try {
        const isOnline = await checkOnlineStatus(link);
        const badgeClass = isOnline ? 'badge-success' : 'badge-danger';
        badgeElement.textContent = isOnline ? 'Online' : 'Offline';
        badgeElement.classList.remove('badge-unknown');
        badgeElement.classList.add(badgeClass);
    } catch (error) {
        console.error(error);
        badgeElement.textContent = 'Unknown';
        badgeElement.classList.remove('badge-unknown');
        badgeElement.classList.add('badge-danger');
    }
}

function setStyle(dark) {
    const customTheme = document.getElementById('custom-theme');
    customTheme.href = dark ? 'styles-dark.css' : 'styles-light.css';
}

function setupStyle() {
    // TODO: Read preference, store in cookie? 
    // Yeah, i dont want to deal with this annoying cookie law.
    const darkmode = true; // Default preference

    setStyle(darkmode);
    const styleSwitch = document.getElementById('styleSwitch');
    styleSwitch.checked = darkmode;

    styleSwitch.addEventListener('change', function () {
        setStyle(styleSwitch.checked);
    });
}


async function findHtmlFavicon(link) {
    try {
        const response = await fetch(link, { method: 'GET', mode: 'no-cors' });
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const iconLink = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
            if (iconLink) return new URL(iconLink.getAttribute('href'), link).href;

            const appleIcon = doc.querySelector('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
            if (appleIcon) return new URL(appleIcon.getAttribute('href'), link).href;
        }
    } catch (error) {
        console.error(`Error fetching HTML favicon for ${link}:`, error);
    }
    return null;
}

async function findRootFavicon(link) {
    const rootFavicon = `${getRoot(link)}/favicon.ico`;
    try {
        const response = await fetch(rootFavicon, { method: 'HEAD', mode: 'no-cors' });
        if (response.ok || response.type === 'opaque') {
            return rootFavicon;
        }
    } catch (error) {
        console.error(`Error checking root favicon for ${link}:`, error);
    }
    return null;
}

async function findGoogleFavicon(link) {
    try {
        const domainUrl = new URL(link).origin; // Extract full origin (e.g., https://stackoverflow.com)
        const googleIcon = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domainUrl}&size=128`;

        console.log(`Attempting to fetch Google favicon: ${googleIcon}`);

        const response = await fetch(googleIcon, { method: 'HEAD', mode: 'no-cors' });
        if (response.ok || response.type === 'opaque') {
            console.log(`Google favicon found: ${googleIcon}`);
            return googleIcon;
        } else {
            console.log('Google favicon not found.');
        }
    } catch (error) {
        console.error(`Error checking Google favicon for ${link}:`, error);
    }
    return null;
}



function getRoot(url) {
    try {
        const { protocol, host } = new URL(url);
        return `${protocol}//${host}`;
    } catch (error) {
        console.error(`Invalid URL: ${url}`, error);
        return '';
    }
}

// Process each item
jsonData.forEach(item => createCard(item));
setupStyle();
