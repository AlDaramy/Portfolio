/**
 * بورتفوليو الأستاذ محمود بن صلاح الدرعمي
 * ملف التفاعلات البرمجية (JavaScript)
 * تشمل: التبديل بين الوضعين، التمرير السلس، القائمة المتجاوبة، تصفية الشهادات، ونموذج التواصل
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. إدارة الوضع الداكن والفاتح (Dark / Light Mode Toggle)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  // التحقق من التفضيل المحفوظ مسبقًا في المتصفح أو اعتماد الوضع الداكن افتراضيًّا
  const savedTheme = localStorage.getItem('theme-preference') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme-preference', newTheme);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) {
        // أيقونة القمر للتبديل إلى الداكن
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
      }
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'التبديل إلى الوضع الداكن');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        // أيقونة الشمس للتبديل إلى الفاتح
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
      }
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'التبديل إلى الوضع الفاتح');
    }
  }

  // --------------------------------------------------------------------------
  // 2. شريط التنقل وتأثير التمرير (Sticky Header & Active Link)
  // --------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // إضافة خلفية زجاجية للشريط عند التمرير
    if (scrollY > 50) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // تمييز الرابط النشط حسب موضع التمرير
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        drawerLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. القائمة الجانبية للشاشات الصغيرة (Mobile Drawer)
  // --------------------------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    mobileNavDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileNavDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileMenuToggle?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);

  // إغلاق القائمة عند النقر خارج المحتوى
  mobileNavDrawer?.addEventListener('click', (e) => {
    if (e.target === mobileNavDrawer) {
      closeDrawer();
    }
  });

  // إغلاق القائمة عند النقر على أي رابط داخلي
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // زر Escape لإغلاق القائمة
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 4. حركات الظهور التدريجي عند التمرير (Scroll Reveal)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // في حال عدم دعم المتصفح للـ IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 5. تصفية بطاقات الدورات والشهادات (Courses Filter Tabs)
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // إزالة التنشيط عن جميع الأزرار وتفعيله للزر المختار
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. زر العودة للأعلى (Back To Top Button)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. السنة الحالية تلقائيًّا في التذييل (Dynamic Copyright Year)
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 8. التعامل مع نموذج التواصل وتسهيل المحادثة الفورية (Contact Form & WhatsApp)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const formFeedback = document.getElementById('formFeedback');

  // تحويل رسالة النموذج مباشرة إلى تطبيق واتساب (حل فوري عملي 100%)
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const name = document.getElementById('senderName')?.value.trim();
      const subject = document.getElementById('senderSubject')?.value.trim();
      const message = document.getElementById('senderMessage')?.value.trim();

      if (!name || !message) {
        showFormAlert('يرجى ملء حقلي (الاسم) و(نص الرسالة) أولًا قبل الإرسال عبر واتساب.', 'warning');
        return;
      }

      const formattedText = `السلام عليكم ورحمة الله وبركاته، أستاذ محمود بن صلاح.%0a` +
        `اسمي: ${encodeURIComponent(name)}%0a` +
        (subject ? `الموضوع: ${encodeURIComponent(subject)}%0a` : '') +
        `الرسالة: ${encodeURIComponent(message)}`;

      // فتح محادثة واتساب بالرقم الأول (01063685714) بالرسالة المنظمة
      const whatsappUrl = `https://wa.me/201063685714?text=${formattedText}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        showFormAlert('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، نص الرسالة).', 'warning');
        return;
      }

      // توضيح للمستخدم مع توفير بديل الإرسال عبر البريد الإلكتروني
      showFormAlert(
        `شكرًا لتواصلك أستاذ/ة ${name}. تم تجهيز رسالتك! يمكنك إرسالها الآن مباشرة عبر تطبيق البريد أو استخدام زر "إرسال عبر واتساب مباشرة" للتواصل الفوري.`,
        'success'
      );

      // تجهيز رابط mailto للبريد الإلكتروني كبديل تقني قياسي جاهز
      const mailtoUrl = `mailto:mahmoudsalah@example.com?subject=${encodeURIComponent(subject || 'رسالة تواصل من البورتفوليو')}&body=${encodeURIComponent(`الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`)}`;

      // فتح تطبيق البريد بعد ثانية
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1200);
    });
  }

  function showFormAlert(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.style.display = 'block';
    formFeedback.style.padding = '0.75rem 1rem';
    formFeedback.style.borderRadius = '8px';
    formFeedback.style.marginTop = '1rem';
    formFeedback.style.fontSize = '0.875rem';
    formFeedback.style.lineHeight = '1.6';

    if (type === 'warning') {
      formFeedback.style.backgroundColor = 'rgba(234, 179, 8, 0.15)';
      formFeedback.style.border = '1px solid rgba(234, 179, 8, 0.4)';
      formFeedback.style.color = '#eab308';
    } else {
      formFeedback.style.backgroundColor = 'rgba(37, 211, 102, 0.15)';
      formFeedback.style.border = '1px solid rgba(37, 211, 102, 0.4)';
      formFeedback.style.color = '#25d366';
    }
  }
});
