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
    const form = document.getElementById('inquiry-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const btnText = submitBtn ? submitBtn.querySelector('span') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Make.com Webhook URL (또는 Google Apps Script URL)
            // 고객님께서 발급받은 URL을 아래에 넣어주세요!
            const WEBHOOK_URL = 'https://hook.make.com/YOUR_WEBHOOK_ID_HERE'; 

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Loading state
            if(btnText) btnText.style.display = 'none';
            if(spinner) spinner.style.display = 'block';
            submitBtn.disabled = true;
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';

            try {
                // Send POST request
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok || response.type === 'opaque') {
                    formMessage.textContent = '문의가 성공적으로 접수되었습니다. 빠르게 확인 후 연락드리겠습니다!';
                    formMessage.classList.add('success');
                    form.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                // 테스트 모드(웹훅 URL이 기본값인 경우)일 때 임시로 성공 메시지 표시
                if (WEBHOOK_URL.includes('YOUR_WEBHOOK_ID_HERE')) {
                    formMessage.textContent = '[안내] 현재 테스트 모드입니다. (실제 Webhook URL을 script.js에 입력해주세요)';
                    formMessage.classList.add('success');
                } else {
                    formMessage.textContent = '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
                    formMessage.classList.add('error');
                }
            } finally {
                // Restore button state
                if(btnText) btnText.style.display = 'block';
                if(spinner) spinner.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});
