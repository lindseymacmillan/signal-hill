document.addEventListener('DOMContentLoaded', function() {
    const issues = document.querySelectorAll('#latest .issue');
    // Set the image top, left and height based on its attributes
    for (const issue of issues) {
        issue.style.top = issue.getAttribute('data-y');
        issue.style.left = issue.getAttribute('data-x');
        const img = issue.querySelector('img');
        img.style.width = issue.getAttribute('data-scale');
    }

    const covers = document.querySelectorAll('#coverflow2 .cover');
    console.log('covers', covers)
    // Set the image top, left and height based on its attributes
    for (const cover of covers) {
        if (cover.classList.contains('spacer')) {
            continue;
        }
        cover.addEventListener('mouseenter', function(e) {
            const coverTitle = cover.getAttribute('data-title');
            const coverDescription = cover.getAttribute('data-description');
            if (coverTitle && coverDescription) {
                setTitleDescription(coverTitle, coverDescription);
            } else {
                setTitleDescription();
            }
        })
        cover.addEventListener('mouseleave', function(e) {
            setTitleDescription();
        })
    }

    const tiersObj = {
        1: {
            title: 'Member',
            price: '$6/month',
            description: '(less than you spend on a latte)'
        },
        2: {
            title: 'Friend',
            price: '$12/month',
            description: '(less than a nice cocktail)'
        },
        3: {
            title: 'Sustainer',
            price: '$24/month',
            description: '(less than a tank of gas or a hardback book)'
        },
        4: {
            title: 'One-time donation',
            price: '$xx,xxx',
            description: ''
        }
    }

    const tiers = document.querySelectorAll('.tiers .tier');
    // Set the image top, left and height based on its attributes
    for (const cover of tiers) {
        cover.addEventListener('mouseenter', function(e) {
            const tier = cover.getAttribute('tier-level');
            setTier(tier);
        })
        cover.addEventListener('mouseleave', function(e) {
            setTier(3);
        })
    }

    const setTier = (tier) => {
        const titleEl = document.querySelector('#tier-title');
        const priceEl = document.querySelector('#tier-price');
        const descriptionEl = document.querySelector('#tier-description');
        const tierObj = tiersObj[tier];
        titleEl.innerHTML = tierObj.title;
        priceEl.innerHTML = tierObj.price;
        descriptionEl.innerHTML = tierObj.description;
        const perks = document.querySelectorAll('#tiers li');
        for (const perk of perks) {
            const tierLevel = perk.getAttribute('tier-level');
            if (tier >= tierLevel) {
                perk.style.opacity = 1;
                perk.style.textDecoration = 'none';
            } else {
                perk.style.opacity = 0.2;
                perk.style.textDecoration = 'line-through';
            }
        }
    }

    const setTitleDescription = function(title, description) {
        const titleEl = document.querySelector('#archivetitle');
        const descriptionEl = document.querySelector('#archivedescription');
        if (title && description) {
            titleEl.innerHTML = title;
            descriptionEl.innerHTML = description;
        } else {
            titleEl.innerHTML = 'Archive';
            descriptionEl.innerHTML = 'Explore the complete collection of stories and work from Signal Hill.';
        }
    }

    const homeSections = document.querySelectorAll('.home section');
    for (const homeSection of homeSections) {
        homeSection.style.backgroundColor = homeSection.getAttribute('data-bg-color');
        const copy = homeSection.querySelector('.copy');
        copy.style.color = homeSection.getAttribute('data-accent-color');
    }

    // Setup scroll listener
    let lastScroll = 0;
    let lastDirection = 'down';
    let ticking = false;
    window.addEventListener('scroll', function() {
        lastDirection = window.scrollY > lastScroll ? 'down' : 'up';
        lastScroll = window.scrollY;
        // If we hit 0, reset the scroll to 1
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        if (window.scrollY < 1) {
            //window.scrollTo(0, 1);
        }
        if (window.scrollY >= maxScroll - 1) {
            //window.scrollTo(0, maxScroll - 1);
        }
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll(lastScroll, lastDirection);
                ticking = false;
            });
            ticking = true;
        }
    });

    const sections = document.querySelectorAll('section');
    const sectionsObj = {};

    // Loop through each section and set the top and bottom based on its bounding client rect
    for (const section of sections) {
        const id = section.getAttribute('id');
        const rect = section.getBoundingClientRect();
        sectionsObj[id] = {
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY
        };
    }

    // If we hit 0, reset the scroll to 1
    if (window.scrollY < 1) {
       //window.scrollTo(0, 1);
    }
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 1) {
       //window.scrollTo(0, maxScroll - 1);
    }

    let lastSection = null;
    let hasInit = false;

    const handleScroll = function(scroll, direction) {
        // Determine which section is currently in view
        let currentSection = null;
        for (const id in sectionsObj) {
            const top = sectionsObj[id].top - 61;
            const bottom = sectionsObj[id].bottom - 61;
            if (scroll >= top && scroll <= bottom) {
                currentSection = id;
                break;
            }
        }
        if (currentSection === lastSection) {
            return;
        }
        handleSectionUpdate(currentSection, !hasInit);
        hasInit = true;
    };

    const handleSectionUpdate = function(sectionId, skipAnimation = false) {
        const duration = skipAnimation ? 0 : 0.2;
        if (lastSection) {
            const lastSectionEl = document.getElementById(lastSection);
            lastSectionEl.classList.remove('current');
        }
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            return;
        }
        targetSection.classList.add('current');
        if (targetSection.hasAttribute('data-accent-color')) {
            const color = targetSection.getAttribute('data-accent-color');
            const brand = document.querySelector('.brand');
            brand.style.color = color;
        } else {
            const brand = document.querySelector('.brand');
            brand.style.color = '';
        }
        lastSection = sectionId;
    }

    // const archiveImage = document.querySelector('#archive .artwork img');
    // console.log('archiveImage', archiveImage)
    // //Setup mousemove listener
    // document.addEventListener('mousemove', function(e) {
    //     // If the mouse is over an archive li image, set the archive image src to the li image src
    //     if (e.target.closest('.archive li')) {
    //         archiveImage.style.display = 'block';
    //         archiveImage.src = e.target.closest('.archive li').getAttribute('data-image');
    //     } else {
    //         archiveImage.style.display = 'none';
    //         archiveImage.src = '';
    //     }
    // });
});