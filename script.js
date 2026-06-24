document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-up animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    // Contact Form Submission
    let submitted = false;
    const form = document.getElementById('inquiry-form');
    const iframe = document.getElementById('hidden_iframe');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const btnText = submitBtn ? submitBtn.querySelector('span') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

    if (form && iframe) {
        form.addEventListener('submit', () => {
            submitted = true;

            // Loading state
            if(btnText) btnText.style.display = 'none';
            if(spinner) spinner.style.display = 'block';
            submitBtn.disabled = true;
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
        });

        iframe.addEventListener('load', () => {
            if (submitted) {
                // Done loading
                formMessage.textContent = '문의가 성공적으로 접수되었습니다. 빠르게 확인 후 연락드리겠습니다!';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                form.reset();
                submitted = false;

                // Restore button state
                if(btnText) btnText.style.display = 'block';
                if(spinner) spinner.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});
