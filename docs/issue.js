document.addEventListener('DOMContentLoaded', function() {
    const artwork = document.querySelectorAll('.art img');
    // Set the image top, left and height based on its attributes
    for (const img of artwork) {
        img.style.top = img.getAttribute('data-y');
        img.style.left = img.getAttribute('data-x');
        img.style.width = img.getAttribute('data-scale');
    }

    const issues = document.querySelectorAll('#latest .issue');
    // Set the image top, left and height based on its attributes
    for (const issue of issues) {
        issue.style.top = issue.getAttribute('data-y');
        issue.style.left = issue.getAttribute('data-x');
        const img = issue.querySelector('img');
        img.style.width = issue.getAttribute('data-scale');
    }

    const homeSections = document.querySelectorAll('.home section');
    for (const homeSection of homeSections) {
        homeSection.style.backgroundColor = homeSection.getAttribute('data-bg-color');
        const copy = homeSection.querySelector('.copy');
        copy.style.color = homeSection.getAttribute('data-accent-color');
    }

    const links = document.querySelectorAll('.art a');
    // Set the link top and left based on its attributes
    for (const link of links) {
        link.style.top = link.getAttribute('data-y');
        link.style.left = link.getAttribute('data-x');
        link.style.width = link.getAttribute('data-scale');
    }

    const transcriptLinks = document.querySelectorAll('a[href="transcript"]');
    for (const link of transcriptLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const transcriptEl = document.querySelector('.transcript');
            transcriptEl.classList.toggle('active');
            // Scroll the transcript to the top
            transcriptEl.scrollTop = 0;
        });
    };

    const transcriptClose = document.querySelector('.transcript .close');
    transcriptClose.addEventListener('click', function(e) {
        e.preventDefault();
        const transcriptEl = document.querySelector('.transcript');
        transcriptEl.classList.remove('active');
    });

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
        console.log('handleScroll', scroll, direction)
        // Determine which section is currently in view
        let currentSection = null;
        const margin = 0.5;
        for (const id in sectionsObj) {
            const top = sectionsObj[id].top - window.innerHeight * margin;
            const bottom = sectionsObj[id].bottom - window.innerHeight * margin;
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
            const lastSectionEl = document.querySelector('[data-section="' + lastSection + '"]');
            lastSectionEl.style.animation = lastDirection === 'up' ? `fadeOutDown ${duration}s forwards` : `fadeOutUp ${duration}s forwards`;
            lastSectionEl.classList.remove('current');
        }
        const targetSection = document.querySelector('[data-section="' + sectionId + '"]');
        if (!targetSection) {
            return;
        }
        targetSection.style.animation =  lastDirection === 'up' ? `fadeInDown ${duration}s forwards ${duration}s` : `fadeInUp ${duration}s forwards ${duration}s`;
        targetSection.classList.add('current');
        if (targetSection.hasAttribute('data-accent-color')) {
            const color = targetSection.getAttribute('data-accent-color');
            GiConsole.log('color', color)
            const brand = document.querySelector('.brand');
            brand.style.color = color;
        }
        document.querySelector('#section').textContent = targetSection.getAttribute('data-title');
        lastSection = sectionId;
    }

    // Setup document click listener
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.art a') && !e.target.closest('.art img')) {
            return;
        }
        e.preventDefault();
        const sectionId = e.target.closest('section').id;
        const currentSection = document.querySelector('.current');
        const currentSectionId = currentSection ? currentSection.getAttribute('data-section') : null;
        if (currentSectionId !== sectionId) {
            currentSection.classList.remove('current');
            const targetSection = document.querySelector('[data-section="' + sectionId + '"]');
            targetSection.classList.add('current');
            document.querySelector('#section').textContent = targetSection.getAttribute('data-title');
        }
    });
});