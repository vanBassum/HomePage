const cardContainer = document.getElementById('cardContainer');

async function checkOnlineStatus(url) {
    try {
        const response = await fetch(url, { method: 'GET', mode: 'no-cors' });
        return true;
    } catch (error) {
        return false;
    }
}

function createCard(item) {
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
                if (event.button === 0) { // Left-click
                    window.location = cardLink.href;
                } else if (event.button === 1) { // Middle-click
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
    var bootstrapTheme = document.getElementById('bootstrap-theme');
    var customTheme = document.getElementById('custom-theme');
    if (dark) {
        bootstrapTheme.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
        customTheme.href = 'styles-dark.css';
    } else {
        bootstrapTheme.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
        customTheme.href = 'styles-light.css';
    }
}

function setupStyle() {
    // TODO: Read preference, store in cookie? 
    // Yeah, i dont want to deal with this annoying cookie law.
    var darkmode = true;        

    setStyle(darkmode);
    var styleSwitch = document.getElementById('styleSwitch');
    styleSwitch.checked = darkmode; // Reflect client's default preference

    styleSwitch.addEventListener('change', function() {
        setStyle(styleSwitch.checked);
    });
}


// Assuming jsonData and createCard are defined elsewhere in your code
jsonData.forEach(item => {
    createCard(item);
});


setupStyle();