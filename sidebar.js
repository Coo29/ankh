document.addEventListener("DOMContentLoaded", function() {
    // Toggle the entire collapsible menu
    const menuToggle = document.getElementById('menuToggle');
    const menuContent = document.getElementById('menuContent');

    if (menuToggle && menuContent) {
        menuToggle.addEventListener('click', function() {
            if (menuContent.style.display === 'none' || menuContent.style.display === '') {
                menuContent.style.display = 'block';
            } else {
                menuContent.style.display = 'none';
            }
        });
    }

    // Toggle individual sections inside the menu
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const sectionContent = this.nextElementSibling;
            if (sectionContent.style.display === 'none' || sectionContent.style.display === '') {
                sectionContent.style.display = 'block';
            } else {
                sectionContent.style.display = 'none';
            }
        });
    });
});
