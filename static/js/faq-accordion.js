// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryTriggers = document.querySelectorAll('.faq-category-trigger');

    categoryTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const categoryCard = this.closest('.faq-category-card');
            const content = categoryCard.querySelector('.faq-category-content');
            const chevron = this.querySelector('.faq-category-chevron');
            const isOpen = categoryCard.classList.contains('active');

            // Close all other categories
            categoryTriggers.forEach(otherTrigger => {
                const otherCard = otherTrigger.closest('.faq-category-card');
                const otherContent = otherCard.querySelector('.faq-category-content');
                const otherChevron = otherTrigger.querySelector('.faq-category-chevron');

                if (otherCard !== categoryCard) {
                    otherCard.classList.remove('active');
                    otherContent.style.maxHeight = null;
                    otherChevron.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle current category
            if (isOpen) {
                categoryCard.classList.remove('active');
                content.style.maxHeight = null;
                chevron.style.transform = 'rotate(0deg)';
            } else {
                categoryCard.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                chevron.style.transform = 'rotate(180deg)';
            }
        });
    });
});
